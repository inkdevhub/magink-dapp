import { Form, useFormikContext } from 'formik';
import { Values } from '../types';
import { NewUserGuide } from './NewUserGuide';
import { useMaginkContract, useUI } from '../hooks';
import { pickDecodedError } from 'useink/utils';
import { useBalance, useWallet } from 'useink';
import { Button } from './Button';
import { Gallery } from './Gallery';
import InkFacts from './InkFacts';

interface Props {
  awake: () => void;
  isAwake: boolean;
  badges: number;
  remainingBlocks: number;
  runtimeError?: any;
}

export const MaginkForm = ({ awake, isAwake, remainingBlocks, runtimeError, badges }: Props) => {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const { claimDryRun, magink } = useMaginkContract();
  const { account } = useWallet();
  const { setShowConnectWallet } = useUI();
  const balance = useBalance(account);
  const hasFunds = !balance?.freeBalance.isEmpty && !balance?.freeBalance.isZero();

  const isFirtsClaim = badges == 0;

  if (runtimeError != undefined) {
    console.log('----------------Form getRemaining runtimeError', runtimeError);
  }
  return (
    <Form>
      {account && !isAwake && (
        <>
        <p>Press Start for ten swanky lessons about ink! and Astar Network</p>
        <br/>
        <Button type="button"
          disabled={isSubmitting || !isValid || !hasFunds } onClick={awake}>
          Start
        </Button>
        </>
      )}

      <div className="group">
        {account && isAwake && (
          <>
            <InkFacts badges={badges} />
            <br />
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || (remainingBlocks != 0 && !isFirtsClaim) || badges >= 9}
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
      {remainingBlocks != 0 && isAwake && badges <= 9 && !isFirtsClaim && (
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
