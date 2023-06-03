#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod magink {
    use crate::ensure;
    use ink::storage::Mapping;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        TooEarlyToClaim,
        UserNotFound,
    }

    #[ink(storage)]
    pub struct Magink {
        user: Mapping<AccountId, Profile>,
    }
    #[derive(
        Debug, PartialEq, Eq, PartialOrd, Ord, Clone, scale::Encode, scale::Decode,
    )]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Profile {
        // duration in blocks until next claim
        claim_era: u8,
        // block number of last claim
        start_block: u32,
        // number of badges claimed
        badges_claimed: u8,
    }

    impl Magink {
        /// Creates a new Magink smart contract.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                user: Mapping::new(),
            }
        }

        /// (Re)Start the Magink the claiming era for the caller.
        #[ink(message)]
        pub fn start(&mut self, era: u8) {
            let profile = Profile {
                claim_era: era,
                start_block: self.env().block_number(),
                badges_claimed: 0,
            };
            self.user.insert(self.env().caller(), &profile);
        }

        /// Claim the badge after the era.
        #[ink(message)]
        pub fn claim(&mut self) -> Result<(), Error> {
            ensure!(self.get_remaining() == 0, Error::TooEarlyToClaim);

            // update profile
            let mut profile = self.get_profile().ok_or(Error::UserNotFound).unwrap();
            profile.badges_claimed += 1;
            profile.start_block = self.env().block_number();
            self.user.insert(self.env().caller(), &profile);
            Ok(())
        }

        /// Returns the remaining blocks in the era.
        #[ink(message)]
        pub fn get_remaining(&self) -> u8 {

            let current_block = self.env().block_number();
            let caller = self.env().caller();
            self.user.get(&caller).map_or(0, |profile| {
                if current_block - profile.start_block >= profile.claim_era as u32 {
                    return 0;
                }
                profile.claim_era - (current_block - profile.start_block) as u8
            })
        }

        /// Returns the remaining blocks in the era for the given account.
        #[ink(message)]
        pub fn get_remaining_for(&self, account: AccountId) -> u8 {

            let current_block = self.env().block_number();
            self.user.get(&account).map_or(0, |profile| {
                if current_block - profile.start_block >= profile.claim_era as u32 {
                    return 0;
                }
                profile.claim_era - (current_block - profile.start_block) as u8
            })
        }

        /// Returns the profile of the given account.
        #[ink(message)]
        pub fn get_account_profile(&self, account: AccountId) -> Option<Profile> {
            self.user.get(&account)
        }
        
        /// Returns the profile of the caller.
        #[ink(message)]
        pub fn get_profile(&self) -> Option<Profile> {
            let caller = self.env().caller();
            self.user.get(&caller)
        }

        /// Returns the badge of the caller.
        #[ink(message)]
        pub fn get_badges(&self) -> u8 {
            self.get_profile().map_or(0, |profile| profile.badges_claimed)
        }

        /// Returns the badge count of the given account.
        #[ink(message)]
        pub fn get_badges_for(&self, account: AccountId) -> u8 {
            self.get_account_profile(account).map_or(0, |profile| profile.badges_claimed)
        }

    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn start_works() {
            let mut magink = Magink::new();
            println!("get {:?}", magink.get_remaining());
            magink.start(10);
            assert_eq!(10, magink.get_remaining());
            advance_block();
            assert_eq!(9, magink.get_remaining());
        }

        #[ink::test]
        fn claim_works() {
            const ERA: u32 = 10;
            let accounts = default_accounts();
            let mut magink = Magink::new();
            magink.start(ERA as u8);
            advance_n_blocks(ERA - 1);
            assert_eq!(1, magink.get_remaining());

            // claim fails, too early
            assert_eq!(Err(Error::TooEarlyToClaim), magink.claim());
            
            // claim succeeds
            advance_block();
            assert_eq!(Ok(()), magink.claim());
            assert_eq!(1, magink.get_badges());
            assert_eq!(1, magink.get_badges_for(accounts.alice));
            assert_eq!(1, magink.get_badges());
            assert_eq!(10, magink.get_remaining());
            
            // claim fails, too early
            assert_eq!(Err(Error::TooEarlyToClaim), magink.claim());
            advance_block();
            assert_eq!(9, magink.get_remaining());
            assert_eq!(Err(Error::TooEarlyToClaim), magink.claim());
        }

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<Environment>()
        }

        // fn set_sender(sender: AccountId) {
        //     ink::env::test::set_caller::<Environment>(sender);
        // }
        fn advance_n_blocks(n: u32) {
            for _ in 0..n {
                advance_block();
            }
        }
        fn advance_block() {
            ink::env::test::advance_block::<ink::env::DefaultEnvironment>();
        }
    }
}

/// Evaluate `$x:expr` and if not true return `Err($y:expr)`.
///
/// Used as `ensure!(expression_to_ensure, expression_to_return_on_false)`.
#[macro_export]
macro_rules! ensure {
    ( $x:expr, $y:expr $(,)? ) => {{
        if !$x {
            return Err($y.into());
        }
    }};
}
