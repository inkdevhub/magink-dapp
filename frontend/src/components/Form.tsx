import { Form, useFormikContext } from 'formik';
import { Values } from '../types';
import { NewUserGuide } from './NewUserGuide';
import { useMaginkContract, useUI } from '../hooks';
import { pickDecodedError } from 'useink/utils';
import { useWallet } from 'useink';
import { Button } from './Button';
import { Gallery } from './Gallery';
import { astarFacts } from '../const';


interface Props {
  awake: () => void;
  isAwake: boolean;
  isStarting: boolean;
  badges: number;
  remainingBlocks: number;
  runtimeError?: any;
}

export const MaginkForm = ({ awake, isAwake, isStarting, remainingBlocks, runtimeError, badges }: Props) => {
  const { isSubmitting, isValid, values, setFieldTouched, handleChange } = useFormikContext<Values>();
  const { claimDryRun, magink, start, getRemaining } = useMaginkContract();
  const { account } = useWallet();
  const { setShowConnectWallet } = useUI();

  if (runtimeError != undefined) {
    console.log('----------------Form getRemaining runtimeError', runtimeError);
  }
  return (
    <Form>
      {account && !isAwake && (
        <Button type="button" disabled={isSubmitting || !isValid || isStarting} onClick={awake}>
          Start
        </Button>
      )}
      {isStarting && (
        <div className="animate-pulse text-lg font-semibold mt-6">
          Starting smart contract... please wait
        </div>
      )}

      {/* <div className="group">
        {isValid && <DryRunResult values={values} />}
      </div> */}

      <div className="group">
        {account && isAwake && (
          <>
            <p>{astarFacts[badges]}</p>
            <br />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || remainingBlocks != 0 || badges >= 9}
            >
              Claim badge
            </Button>
          </>
        )}
        {!account && (
          <Button type="button" onClick={() => setShowConnectWallet(true)}>
            Connect Wallet
          </Button>
        )}
      </div>
      {remainingBlocks != 0 && isAwake && badges <= 9 &&(
        <div className="text-xs text-left mb-2 text-gray-200">
          Claim a new badge after {remainingBlocks} blocks
        </div>
      )}
      {account && isAwake && (
        <Gallery level={badges} />
      )}
      {runtimeError && magink && (
        <div className="text-xs text-left mb-2 text-red-500">
          {pickDecodedError(
            claimDryRun,
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
