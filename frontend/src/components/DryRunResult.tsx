import { useEffect, useRef } from "react";
import { Values } from "../types";
import { useMaginkContract } from "../hooks";
import { pickTxInfo } from "useink/utils";

interface Props {
  values: Values;
}

export function DryRunResult({ values }: Props) {
  const { startDryRun } = useMaginkContract();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function getOutcome() {
      startDryRun?.send([values.blocksToLive], { defaultCaller: true });
    }

    function debouncedDryRun() {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      timeoutId.current = setTimeout(() => {
        getOutcome().catch(console.error);
        timeoutId.current = null;
      }, 300);
    }

    debouncedDryRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDryRun?.send]);

  if (!startDryRun?.result) return null;

  const txInfo = pickTxInfo(startDryRun?.result);

  return (
      <div>
        <p>storage deposit: {txInfo ? txInfo.storageDeposit.asCharge.toHuman() : '--'}</p>
        <p>gas fee: {txInfo ? txInfo.partialFee.toHuman() : '--'}</p>
      </div>
  );
}
