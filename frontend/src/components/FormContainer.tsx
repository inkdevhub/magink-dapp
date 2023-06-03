import linkLogo from '../link-logo.svg';
import { Formik } from 'formik';
import { initialValues } from '../const';
import { useMaginkContract, useSubmitHandler, useUI } from '../hooks';
import { MaginkForm } from './Form';
import { Header } from './Header';
import { SubmitResult } from './SubmitResult';
import { ConnectWallet, Loader } from '.';
import { hasAny, pickDecoded, pickError } from 'useink/utils';
import { useEffect, useState } from 'react';
import { decodeError } from 'useink/core';
import { useWallet } from 'useink';

export const FormContainer = () => {
  const { claimDryRun, magink, start, getRemaining, getRemainingFor, getBadgesFor } = useMaginkContract();
  const submitFn = useSubmitHandler();
  const { account } = useWallet();
  const { showConnectWallet, setShowConnectWallet } = useUI();
  const { claim } = useMaginkContract();
  const [isAwake, setIsAwake] = useState(false);
  const [remainingBlocks, setRemainingBlocks] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);

  var runtimeError: any; // TODO check this

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isAwake) return;
      const remainingBlocks = await getRemainingFor?.send([account?.address], { defaultCaller: true});
      console.log('##### getRemaining value', remainingBlocks?.ok && remainingBlocks.value.decoded);

      if (remainingBlocks?.ok && remainingBlocks.value.decoded) {
        setRemainingBlocks(remainingBlocks.value.decoded);
        if (remainingBlocks.value.decoded == 0) {
          const badges = await getBadgesFor?.send([account?.address], { defaultCaller: true});
          console.log('##### getBadgesFor value', badges?.ok && badges.value.decoded);
          if (badges?.ok && badges.value.decoded) {
            setBadges(badges.value.decoded);
          }
        }
      }

      runtimeError = pickError(getRemaining?.result);
      if (runtimeError != undefined) {
        console.log('Form getRemaining runtimeError', runtimeError);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAwake]);

  const startMagink = async () => {
    console.log('startMagink');
    setIsAwake(true);

    const startArgs = [initialValues.blocksToLive];
    const options = undefined;
    start?.signAndSend(startArgs, options, (result: any, _api: any, error: any) => {
      if (error) {
        console.error(JSON.stringify(error));
      }
      console.log('result', result);
      const dispatchError = start.result?.dispatchError;

      if (dispatchError && magink?.contract) {
        const errorMessage = decodeError(dispatchError, magink, undefined, 'Something went wrong');
        console.log('errorMessage', errorMessage);
      }
    });
  };

  return (
    <div className="App">
      <ConnectWallet show={showConnectWallet} onClose={() => setShowConnectWallet(false)} />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, helpers) => {
          if (!helpers) return;
          submitFn(values, helpers);
        }}
      >
        {({ status: { finalized, events, slug, errorMessage } = {}, isSubmitting }) => {
          return isSubmitting && claim && !hasAny(claim, 'PendingSignature', 'None') ? (
            <Loader message="Submitting transaction..." />
          ) : (
            <>
              <Header />
              <div className="content">
                <div className="form-panel">
                  {/* <img src={linkLogo} className="link-logo" alt="logo" />{" "} */}
                  <h2>Magink!</h2>
                  <br />
                  {finalized ? (
                    <SubmitResult events={events} slug={slug} errorMessage={errorMessage} />
                  ) : (
                    <MaginkForm
                      awake={startMagink}
                      isAwake={isAwake}
                      badges={badges}
                      remainingBlocks={remainingBlocks}
                      runtimeError={runtimeError}
                    />
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
