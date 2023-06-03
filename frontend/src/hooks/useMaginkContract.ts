import { useContext } from "react";
import { MaginkContractContext } from "../contexts";

export const useMaginkContract = () => {
  const context = useContext(MaginkContractContext);

  if (context === undefined) {
    throw new Error(
      "useMaginkContract must be used within a MaginkContractProvider"
    );
  }

  return context;
}
