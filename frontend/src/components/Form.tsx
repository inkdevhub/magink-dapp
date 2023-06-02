import { Form, useFormikContext } from 'formik';
import { Values } from '../types';
import { useState } from 'react';
import { NewUserGuide } from './NewUserGuide';
import { useLinkContract, useUI } from '../hooks';
import { pickDecodedError } from 'useink/utils';
import { useWallet } from 'useink';
import { Button } from './Button';
import { Gallery } from './Gallery';
import { DryRunResult } from './DryRunResult';


interface Props {
  awake: () => void;
  isAwake: boolean;
  waterLevel: number;
  runtimeError?: any;
}

export const MaginkForm = ({ awake, isAwake, waterLevel, runtimeError }: Props) => {
  const { isSubmitting, isValid, values, setFieldTouched, handleChange } = useFormikContext<Values>();
  const { waterDryRun, magink, start, getWater } = useLinkContract();
  const { account } = useWallet();
  const { setShowConnectWallet } = useUI();
  const [txMessage, setTxMessage] = useState<string>('');

  return (
    <Form>
      <div className="group">
        {account && !isAwake && (
          <Button type="button" disabled={isSubmitting || !isValid} onClick={awake}>
            Start
          </Button>
        )}
      </div>

      <div className="group">
        Claim a new badge after {" "}{waterLevel}{" "} blocks
      </div>

      <div className="group">
        {isValid && <DryRunResult values={values} />}
      </div>

      <div className="group">
        {account ? (
          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            Claim badge
          </Button>
        ) : (
          <Button type="button" onClick={() => setShowConnectWallet(true)}>
            Connect Wallet
          </Button>
        )}
      </div>
      <Gallery level={9}/>

      <div className="text-xs text-left mb-2 text-purple-500">{txMessage}</div>

      {runtimeError && magink && (
        <div className="text-xs text-left mb-2 text-red-500">
          {pickDecodedError(
            waterDryRun,
            magink,
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
