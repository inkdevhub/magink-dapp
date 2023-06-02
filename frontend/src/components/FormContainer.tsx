import linkLogo from '../link-logo.svg';
import { Formik } from 'formik';
import { initialValues } from '../const';
import { useLinkContract, useSubmitHandler, useUI } from '../hooks';
import { UrlShortenerForm } from './Form';
import { Header } from './Header';
import { SubmitResult } from './SubmitResult';
import { ConnectWallet, Loader } from '.';
import { hasAny, pickError } from 'useink/utils';
import { useEffect, useState } from 'react';
import { decodeError } from 'useink/core';

export const FormContainer = () => {
  const { waterDryRun, magink, start, getWater } = useLinkContract();
  const submitFn = useSubmitHandler();
  const { showConnectWallet, setShowConnectWallet } = useUI();
  const { water } = useLinkContract();
  const [isAwake, setIsAwake] = useState(false);
  const [waterLevel, setWaterLevel] = useState<number>(0);

  var runtimeError: any; // TODO check this

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isAwake) return;

      const waterStatus = await getWater?.send([], { defaultCaller: true });
      console.log('##### getWater value', waterStatus?.ok && waterStatus.value.decoded);

      if (waterStatus?.ok && waterStatus.value.decoded) {
        // setTxMessage("Read plant health: " + waterStatus?.value?.decoded);
        setWaterLevel(waterStatus.value.decoded);
      }

      runtimeError = pickError(getWater?.result);
      if (runtimeError != undefined) {
        console.log('Form getWater runtimeError', runtimeError);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAwake]);

  const awakeTamagotchi = async () => {
    console.log('awakeTamagotchi');
    setIsAwake(true);

    const startArgs = [initialValues.blocksToLive];
    const options = undefined;
    // setTxMessage('Sign awaking transaction');
    start?.signAndSend(startArgs, options, (result, _api, error) => {
      if (error) {
        console.error(JSON.stringify(error));
      }
      console.log('result', result);
      if (result?.status) {
        // setTxMessage('Transaction status: ' + result?.status.type);
      }
      if (result?.status.isInBlock) {
        console.log('invoke checkLevel');
        //checkLevel();
      }
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
          return isSubmitting && water && !hasAny(water, 'PendingSignature', 'None') ? (
            <Loader message="Submitting transaction..." />
          ) : (
            <>
              <Header />
              <div className="content">
                <div className="form-panel">
                  {/* <img src={linkLogo} className="link-logo" alt="logo" />{" "} */}
                  <h2>Magink!</h2>
                  <br/>
                  {finalized ? (
                    <SubmitResult events={events} slug={slug} errorMessage={errorMessage} />
                  ) : (
                    <UrlShortenerForm
                      awake={awakeTamagotchi}
                      isAwake={isAwake}
                      waterLevel={waterLevel}
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
