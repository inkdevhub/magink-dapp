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
            ensure!(self.get_remaining() > 0, Error::TooEarlyToClaim);

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

        /// Returns the profile of the given account.
        #[ink(message)]
        pub fn get_account_profile(&self, account: AccountId) -> Option<Profile> {
            self.user.get(&account)
        }
        
        /// Returns the profile of the caller.
        fn get_profile(&self) -> Option<Profile> {
            let caller = self.env().caller();
            self.user.get(&caller)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn it_works() {
            let mut magink = Magink::new();
            println!("get {:?}", magink.get_remaining());
            magink.start(10);
            assert_eq!(10, magink.get_remaining());
            advance_block();
            assert_eq!(9, magink.get_remaining());
        }

        fn advance_block() {
            ink::env::test::advance_block::<ink::env::DefaultEnvironment>();
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::build_message;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn it_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // given
            let constructor = MaginkRef::new(false);
            let contract_acc_id = client
                .instantiate("magink", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            let get = build_message::<MaginkRef>(contract_acc_id.clone())
                .call(|magink| magink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), false));

            // when
            let flip = build_message::<MaginkRef>(contract_acc_id.clone())
                .call(|magink| magink.flip());
            let _flip_res = client
                .call(&ink_e2e::bob(), flip, 0, None)
                .await
                .expect("flip failed");

            // then
            let get = build_message::<MaginkRef>(contract_acc_id.clone())
                .call(|magink| magink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), true));

            Ok(())
        }

        #[ink_e2e::test]
        async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // given
            let constructor = MaginkRef::new_default();

            // when
            let contract_acc_id = client
                .instantiate("magink", &ink_e2e::bob(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            // then
            let get = build_message::<MaginkRef>(contract_acc_id.clone())
                .call(|magink| magink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), false));

            Ok(())
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
