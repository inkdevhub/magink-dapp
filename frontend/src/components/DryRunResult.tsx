import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Values } from "../types";
import { useMaginkContract } from "../hooks";
import { pickDecoded, pickTxInfo } from "useink/utils";

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

  const decoded = pickDecoded(startDryRun?.result);
  const txInfo = pickTxInfo(startDryRun?.result);
  // console.log("decoded", decoded)
  // console.log("txInfo", txInfo)
  return (
      <div>
        <p>storage deposit: {txInfo ? txInfo.storageDeposit.asCharge.toHuman() : '--'}</p>
        <p>gas fee: {txInfo ? txInfo.partialFee.toHuman() : '--'}</p>
      </div>
  );
}
