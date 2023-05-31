import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import TamagotchinkFactory from "./typedContract/constructors/Tamagotchink";
import Tamagotchink from "./typedContract/contracts/Tamagotchink";
import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";

use(chaiAsPromised);

// Create a new instance of contract
const wsProvider = new WsProvider("ws://127.0.0.1:9944");
// Create a keyring instance
const keyring = new Keyring({ type: "sr25519" });

describe("Tamagotchink test", () => {
  let TamagotchinkFactory: TamagotchinkFactory;
  let api: ApiPromise;
  let deployer: KeyringPair;
  
  let contract: Tamagotchink;
  const initialState = true;

  before(async function setup(): Promise<void> {
    api = await ApiPromise.create({ provider: wsProvider });
    deployer = keyring.addFromUri("//Alice");

    TamagotchinkFactory = new TamagotchinkFactory(api, deployer);

    contract = new Tamagotchink(
      (await TamagotchinkFactory.new(initialState)).address,
      deployer,
      api
    );
  });

  after(async function tearDown() {
    await api.disconnect();
  });
});
