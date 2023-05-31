import { DryRunResult } from "./DryRunResult";
import { Form, Field, ErrorMessage, useFormikContext } from "formik";
import { Values } from "../types";
import { ChangeEvent, useState } from "react";
import { NewUserGuide } from "./NewUserGuide";
import { useLinkContract, useUI } from "../hooks";
import { pickDecoded, pickDecodedError, pickError } from "useink/utils";
import { useWallet } from "useink";
import { Button } from "./Button";

export const UrlShortenerForm = () => {
  const { isSubmitting, isValid, values, setFieldTouched, handleChange } = useFormikContext<Values>();
  const { shortenDryRun, link } = useLinkContract();
  const { account } = useWallet();
  const { setShowConnectWallet } = useUI();
  const [isAwake, setIsAwake] = useState(false);
  const [era, setEra] = useState<number>(0);

  const decoded = pickDecoded(shortenDryRun?.result);
  const runtimeError = pickError(shortenDryRun?.result);

  const awakeTamagotchi = async () => {
    console.log("awakeTamagotchi");
    setIsAwake(true);

  };

  return (
    <Form>
      <div className="group">
        {account && !isAwake &&(
          <Button
            type="button"
            disabled={isSubmitting || !isValid}
            onClick={awakeTamagotchi}
          >
            Awake Tamagotchi
          </Button>
        ) }
      </div>

      <div className="group">
        Eras to live{" "}{isAwake && (era)}
        <ErrorMessage name="alias" component="div" className="error-message" />
      </div>

      <div className="group">
        {isValid && values.url && <DryRunResult values={values} />}
      </div>

      <div className="group">
        {account ? (
          <Button
            type="submit"
            disabled={isSubmitting || decoded !== 'Shortened' || !isValid}
          >
            Shorten
          </Button>
        ) : (
          <Button onClick={() => setShowConnectWallet(true)}>
            Connect Wallet
          </Button>
        )}
      </div>

      {runtimeError && link && (
        <div className="text-xs text-left mb-2 text-red-500">
          {pickDecodedError(
            shortenDryRun, 
            link, 
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
