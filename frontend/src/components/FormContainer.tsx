import linkLogo from "../link-logo.svg";
import { Formik } from "formik";
import { initialValues, UrlShortenerSchema } from "../const";
import { useLinkContract, useSubmitHandler, useUI } from "../hooks";
import { UrlShortenerForm } from "./Form";
import { Header } from "./Header";
import { SubmitResult } from "./SubmitResult";
import { ConnectWallet, Loader } from ".";
import { hasAny } from "useink/utils";

export const FormContainer = () => {
  const submitFn = useSubmitHandler();
  const { showConnectWallet, setShowConnectWallet } = useUI();
  const { water } = useLinkContract();

  return (
    <div className="App">
      <ConnectWallet show={showConnectWallet} onClose={() => setShowConnectWallet(false)} />
      <Formik
        initialValues={initialValues}
        validationSchema={UrlShortenerSchema}
        onSubmit={(values, helpers) => {
          if (!helpers) return;
          submitFn(values, helpers);
        }}
      >
        {({
          status: { finalized, events, slug, errorMessage } = {},
          isSubmitting,
        }) => {
          return isSubmitting && water && !hasAny(water, 'PendingSignature', 'None') ? (
            <Loader message="Submitting transaction..." />
          ) : (
            <>
              <Header />
              <div className="content">
                <div className="form-panel">
                  {/* <img src={linkLogo} className="link-logo" alt="logo" />{" "} */}
                  <h2>Tamagotchink!</h2>
                  <h2>.</h2>
                  {finalized ? (
                    <SubmitResult
                      events={events}
                      slug={slug}
                      errorMessage={errorMessage}
                    />
                  ) : (
                    <UrlShortenerForm />
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
