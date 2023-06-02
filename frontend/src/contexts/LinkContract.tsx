import { PropsWithChildren, createContext } from "react";
import { useContract, DryRun, useDryRun, useTx, Tx, useCall, Call, ChainContract } from "useink";
import { CONTRACT_ADDRESS } from "../const";
import metadata from "../metadata.json";
import { useTxNotifications } from "useink/notifications";

interface LinkContractState {
  magink?: ChainContract; 
  startDryRun?: DryRun<number>;
  waterDryRun?: DryRun<number>;
  start?: Tx<number>;
  water?: Tx<number>;
  getWater?: Call<number>;
}

export const LinkContractContext = createContext<LinkContractState>({});

export function LinkContractProvider({ children }: PropsWithChildren) {
  const magink = useContract(CONTRACT_ADDRESS, metadata);
  const waterDryRun = useDryRun<number>(magink, 'water');
  const startDryRun = useDryRun<number>(magink, 'start');
  const water = useTx(magink, 'water');
  const start = useTx(magink, 'start');
  const getWater = useCall<number>(magink, 'getWater');
  useTxNotifications(water);
  useTxNotifications(start);

  // The current contract does not return an Result<_, Err> so we need to hack the
  // duplicate Slug error check. ink! v4 handles this better. Using ink! v4 we can simply
  // use `pickError(waterDryRun?.result)` and check for the error type or undefined.
  // const hasDuplicateSlug = waterDryRun?.result?.ok && 
  //   waterDryRun.result.value.storageDeposit.asCharge.eq(0) && 
  //   waterDryRun.result.value.partialFee.gtn(0)

  return (
    <LinkContractContext.Provider value={{ magink, startDryRun, waterDryRun, start, water, getWater }}>
      {children}
    </LinkContractContext.Provider>
  );
}