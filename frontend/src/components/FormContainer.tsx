import { Formik } from 'formik';
import { initialValues } from '../const';
import { useMaginkContract, useSubmitHandler, useUI } from '../hooks';
import { MaginkForm } from './Form';
import { Header } from './Header';
import { SubmitResult } from './SubmitResult';
import { ConnectWallet, Loader } from '.';
import { hasAny, pickError } from 'useink/utils';
import { useEffect, useState } from 'react';
import { decodeError } from 'useink/core';
import { useBlockHeader, useWallet } from 'useink';

export const FormContainer = () => {
  const { magink, start, getRemaining, getRemainingFor, getBadgesFor } = useMaginkContract();
  const submitFn = useSubmitHandler();
  const { account } = useWallet();
  const { showConnectWallet, setShowConnectWallet } = useUI();
  const { claim } = useMaginkContract();
  const [isAwake, setIsAwake] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [remainingBlocks, setRemainingBlocks] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);
  const block = useBlockHeader();

  var runtimeError: any; // TODO check this

  useEffect(() => {
    checkBadges();
  }, [block]);

  const checkBadges = async () => {
    if (!isAwake) return;
    //get remaining blocks until next claim
    const remaining = await getRemainingFor?.send([account?.address], { defaultCaller: true });
    console.log('##### blocks until claim', remaining?.ok && remaining.value.decoded);
    if (remaining?.ok && remaining.value.decoded) {
      setRemainingBlocks(remaining.value.decoded);
    }

    const badges = await getBadgesFor?.send([account?.address], { defaultCaller: true });
    console.log('##### badges count', badges?.ok && badges.value.decoded);
    if (badges?.ok && badges.value.decoded) {
      setBadges(badges.value.decoded);
    }

    runtimeError = pickError(getRemaining?.result);
    if (runtimeError != undefined) {
      console.log('Form getRemaining runtimeError', runtimeError);
    }
  };

  const readBadges = async () => {
    console.log('##### getBadgesFor add', account?.address);
    const badges = await getBadgesFor?.send([account?.address], { defaultCaller: true });
    console.log('##### getBadgesFor value', badges?.ok && badges.value.decoded);
    if (badges?.ok && badges.value.decoded) {
      setBadges(badges.value.decoded);
      if (badges.value.decoded == 0) {
        startMagink();
      } else {
        setIsAwake(true);
      }
    }
  };

  const startMagink = async () => {
    console.log('startMagink');
    const startArgs = [initialValues.blocksToLive];
    const options = undefined;
    setIsStarting(true);
    start?.signAndSend(startArgs, options, (result: any, _api: any, error: any) => {
      if (error) {
        console.error(JSON.stringify(error));
      }
      console.log('result', result);
      const dispatchError = start.result?.dispatchError;

      if (!result?.status.isInBlock) return;

      if (dispatchError && magink?.contract) {
        const errorMessage = decodeError(dispatchError, magink, undefined, 'Something went wrong');
        console.log('errorMessage', errorMessage);
      }
      setIsAwake(true);
      setIsStarting(false);
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
        {({ status: { finalized, events, errorMessage } = {}, isSubmitting }) => {
          return isSubmitting && claim && !hasAny(claim, 'PendingSignature', 'None') ? (
            <Loader message="Claiming your badge..." />
          ) : (
            <>
              {isStarting && (<Loader message="Initializing app for new user..." />)}
              {!isStarting && (
                <>
                  <Header />
                  <div className="content">
                    <div className="form-panel">
                      {/* <img src={linkLogo} className="link-logo" alt="logo" />{" "} */}
                      <h2>Magink!</h2>
                      <br />
                      {finalized ? (
                        <SubmitResult events={events} errorMessage={errorMessage} />
                      ) : (
                        <MaginkForm
                          awake={readBadges}
                          isAwake={isAwake}
                          badges={badges}
                          remainingBlocks={remainingBlocks}
                          runtimeError={runtimeError}
                        />
                      )}
                    </div>
                  </div>
                </>)}
            </>
          );
        }}
      </Formik>
    </div>
  );
};
