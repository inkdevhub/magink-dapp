import { DryRunResult } from "./DryRunResult";
import { Form, Field, ErrorMessage, useFormikContext } from "formik";
import { Values, UIEvent, TransferredBalanceEvent } from "../types";
import { ChangeEvent, useState } from "react";
import { NewUserGuide } from "./NewUserGuide";
import { useLinkContract, useUI } from "../hooks";
import { pickDecoded, pickDecodedError, pickError } from "useink/utils";
import { decodeError } from "useink/core";
import { useWallet } from "useink";
import { Button } from "./Button";
import { get } from "http";

export const UrlShortenerForm = () => {
  const { isSubmitting, isValid, values, setFieldTouched, handleChange } = useFormikContext<Values>();
  const { waterDryRun, tamagotchink, start, getWater } = useLinkContract();
  const { account } = useWallet();
  const { setShowConnectWallet } = useUI();
  const [isAwake, setIsAwake] = useState(false);
  const [txMessage, setTxMessage] = useState<string>("");
  const [waterLevel, setWaterLevel] = useState<number>(0);

  var runtimeError;
  const checkLevel = () => {
      const interval = setInterval(async () => {
        const waterStatus = await getWater?.send([], { defaultCaller: true });
        console.log("##### getWater value", waterStatus?.ok && waterStatus.value.decoded);
        
        if (waterStatus?.ok && waterStatus.value.decoded) {
          // setTxMessage("Read plant health: " + waterStatus?.value?.decoded);
          setWaterLevel(waterStatus.value.decoded);
        }

        runtimeError = pickError(getWater?.result);
        if (runtimeError != undefined) {
          console.log("Form getWater runtimeError", runtimeError);
        }
      }, 5000);
      return () => clearInterval(interval);
  }
  const awakeTamagotchi = async () => {
    console.log("awakeTamagotchi");
    setIsAwake(true);

    const startArgs = [values.blocksToLive];
    const options = undefined;
    setTxMessage("Sign awaking transaction");
    start?.signAndSend(startArgs, options, (result, _api, error) => {
      if (error) {
        console.error(JSON.stringify(error));
      }
      console.log("result", result);
      if (result?.status) {
        setTxMessage("Transaction status: " + result?.status.type);
      }
      if (result?.status.isInBlock) {
        console.log("invoke checkLevel");
        checkLevel();
      }
      const dispatchError = start.result?.dispatchError;

      if (dispatchError && tamagotchink?.contract) {
        const errorMessage = decodeError(dispatchError, tamagotchink, undefined, 'Something went wrong');
        console.log("errorMessage", errorMessage);
      }
    });

  };
  return (
    <Form>
      <div className="group">
        {account &&
          // !isAwake && 
          (
            <Button
              type="button"
              disabled={isSubmitting || !isValid}
              onClick={awakeTamagotchi}
            >
              Awake Tamagotchi
            </Button>
          )}
      </div>

      <div className="group">
        Blocks to live{" "}{waterLevel}
        {/* <ErrorMessage name="alias" component="div" className="error-message" /> */}
      </div>

      {/* <div className="group">
        {isValid && <DryRunResult values={values} />}
      </div> */}


      <div className="group">
        {account ? (
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Water
          </Button>
        ) : (
          <Button 
          type="button"

          onClick={() => setShowConnectWallet(true)}>
            Connect Wallet
          </Button>
        )}
      </div>

      <div className="text-xs text-left mb-2 text-purple-500">
        {txMessage}
      </div>

      {runtimeError && tamagotchink && (
        <div className="text-xs text-left mb-2 text-red-500">
          {pickDecodedError(
            waterDryRun,
            tamagotchink,
            {
              ContractTrapped: 'Unable to complete transaction.',
              StorageDepositLimitExhausted: 'Not enough funds in the selected account.',
              StorageDepositNotEnoughFunds: 'Not enough funds in the selected account.',
            },
            'Something went wrong.',
          )}
        </div>
      )}

      <div className="group">
        <NewUserGuide />
      </div>
    </Form>
  );
};
