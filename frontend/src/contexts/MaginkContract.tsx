import { PropsWithChildren, createContext } from "react";
import { useContract, DryRun, useDryRun, useTx, Tx, useCall, Call, ChainContract } from "useink";
import { CONTRACT_ADDRESS } from "../const";
import metadata from "../metadata.json";
import { useTxNotifications } from "useink/notifications";

interface MaginkContractState {
  magink?: ChainContract; 
  startDryRun?: DryRun<number>;
  claimDryRun?: DryRun<number>;
  start?: Tx<number>;
  claim?: Tx<number>;
  getRemaining?: Call<number>;
  getRemainingFor?: Call<number>;
}

export const MaginkContractContext = createContext<MaginkContractState>({});

export function MaginkContractProvider({ children }: PropsWithChildren) {
  const magink = useContract(CONTRACT_ADDRESS, metadata);
  const claimDryRun = useDryRun<number>(magink, 'claim');
  const startDryRun = useDryRun<number>(magink, 'start');
  const claim = useTx(magink, 'claim');
  const start = useTx(magink, 'start');
  const getRemaining = useCall<number>(magink, 'getRemaining');
  const getRemainingFor = useCall<number>(magink, 'getRemainingFor');
  useTxNotifications(claim);
  useTxNotifications(start);

  // The current contract does not return an Result<_, Err> so we need to hack the
  // duplicate Slug error check. ink! v4 handles this better. Using ink! v4 we can simply
  // use `pickError(claimDryRun?.result)` and check for the error type or undefined.
  // const hasDuplicateSlug = claimDryRun?.result?.ok && 
  //   claimDryRun.result.value.storageDeposit.asCharge.eq(0) && 
  //   claimDryRun.result.value.partialFee.gtn(0)

  return (
    <MaginkContractContext.Provider value={{ magink, startDryRun, claimDryRun, start, claim, getRemaining, getRemainingFor }}>
      {children}
    </MaginkContractContext.Provider>
  );
}