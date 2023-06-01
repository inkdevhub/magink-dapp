#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod tamagotchink {
    #[ink(storage)]
    pub struct Tamagotchink {
        blocks_to_live: u8,
        start_block: u32,
    }

    impl Tamagotchink {
        /// Creates a new Tamagotchink smart contract.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                blocks_to_live: 0,
                start_block: 0,
            }
        }

        /// Set the eras of the Tamagotchink smart contract.
        #[ink(message)]
        pub fn start(&mut self, life_span: u8) {
            self.blocks_to_live = life_span;
            self.start_block = self.env().block_number();
        }

        /// Water the plant
        #[ink(message)]
        pub fn water(&mut self) {
            self.start_block = self.env().block_number();
        }

        /// Returns the current value of the Tamagotchink's boolean.
        #[ink(message)]
        pub fn get_water(&self) -> u8 {
            let current_block = self.env().block_number();
            if current_block - self.start_block >= self.blocks_to_live as u32 {
                return 0;
            }
            self.blocks_to_live - (current_block - self.start_block) as u8
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn it_works() {
            let mut tamagotchink = Tamagotchink::new();
            println!("get {:?}", tamagotchink.get_water());
            tamagotchink.start(10);
            assert_eq!(10, tamagotchink.get_water());
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
            let constructor = TamagotchinkRef::new(false);
            let contract_acc_id = client
                .instantiate("tamagotchink", &ink_e2e::alice(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            let get = build_message::<TamagotchinkRef>(contract_acc_id.clone())
                .call(|tamagotchink| tamagotchink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), false));

            // when
            let flip = build_message::<TamagotchinkRef>(contract_acc_id.clone())
                .call(|tamagotchink| tamagotchink.flip());
            let _flip_res = client
                .call(&ink_e2e::bob(), flip, 0, None)
                .await
                .expect("flip failed");

            // then
            let get = build_message::<TamagotchinkRef>(contract_acc_id.clone())
                .call(|tamagotchink| tamagotchink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), true));

            Ok(())
        }

        #[ink_e2e::test]
        async fn default_works(mut client: ink_e2e::Client<C, E>) -> E2EResult<()> {
            // given
            let constructor = TamagotchinkRef::new_default();

            // when
            let contract_acc_id = client
                .instantiate("tamagotchink", &ink_e2e::bob(), constructor, 0, None)
                .await
                .expect("instantiate failed")
                .account_id;

            // then
            let get = build_message::<TamagotchinkRef>(contract_acc_id.clone())
                .call(|tamagotchink| tamagotchink.get());
            let get_res = client.call_dry_run(&ink_e2e::bob(), &get, 0, None).await;
            assert!(matches!(get_res.return_value(), false));

            Ok(())
        }
    }
}
