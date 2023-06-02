import { Values, UIEvent, TransferredBalanceEvent } from "../types";
import { FormikHelpers } from "formik";
import { pickDecoded, pickError } from "useink/utils";
import { decodeError } from "useink/core";
import { useMaginkContract } from "./useMaginkContract";

export const useSubmitHandler = () => {
  const { claim, claimDryRun, magink } = useMaginkContract();
  
  return async (
    values: Values,
    { setSubmitting, setStatus }: FormikHelpers<Values>
  ) => {
    const isDryRunSuccess = null === pickDecoded(claimDryRun?.result);
    console.log("submit error", pickError(claimDryRun?.result));
    const dr = pickDecoded(claimDryRun?.result);
    console.log("claimDryRun", dr);
    // const isDryRunSuccess = true;
    if (!isDryRunSuccess) return;
    console.log("send claim Tx")

    const claimArgs = [];
    const options = undefined;

    claim?.signAndSend(undefined, options, (result, _api, error) => {
      if (error) {
        console.error(JSON.stringify(error));
        setSubmitting(false);
      }

      if (!result?.status.isInBlock) return;

      const events: UIEvent[] = [];
      let slug = "";

      // Collect Contract emitted events
      result?.contractEvents?.forEach(({ event, args }) => {
        slug = args[0].toHuman()?.toString() || "";
        events.push({
          name: event.identifier,
          message: `${event.docs.join()}`,
        });
      });

      // Collect pallet emitted events
      result?.events.forEach(({ event }) => {
        if ('ContractEmitted' !== event.method) {
          let message = '';

          if ('balances' === event.section) {
            const data = typeof event.data.toHuman() as any as TransferredBalanceEvent;
            message = `Amount: ${data.amount}`;
          }

          events.push({
            name: `${event.section}:${event.method}`,
            message,
          });
        }
      });

      const dispatchError = claim.result?.dispatchError;

      if (dispatchError && magink?.contract) {
        const errorMessage = decodeError(dispatchError, magink, undefined, 'Something went wrong') ;
        setStatus({ finalized: true, events, errorMessage })
      }

      if (slug) setStatus({ finalized: true, events, errorMessage: "", slug })

      setSubmitting(false);
    });
  };
};
