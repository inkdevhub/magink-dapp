import { Values } from "../types";
import { FormikHelpers } from "formik";

import { useMaginkContract } from "./useMaginkContract";

export const useSubmitHandler = () => {
  const { claim } = useMaginkContract();
  
  return async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    console.log("send claim Tx")

    const claimArgs = undefined;
    const options = undefined;

    claim?.signAndSend(claimArgs, options, (result, _api, error) => {
      if (error) {
        console.error(JSON.stringify(error));
        setSubmitting(false);
      }

      if (!result?.status.isInBlock) return;

      setSubmitting(false);
    });
  };
};
