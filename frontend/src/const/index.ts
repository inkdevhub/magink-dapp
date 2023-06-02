import * as Yup from "yup";
import { Values } from "../types";
import { pseudoRandomId } from "useink/utils";

export const initialValues: Values = { blocksToLive: 10 };

export const UrlShortenerSchema = Yup.object().shape({
  url: Yup.string().url().required("URL is a required field"),
  alias: Yup.string()
    .min(5, "Alias is too short! (min 5 characters)")
    .max(10, "Alias is too long! (max 10 characters)")
    .required("Alias is a required field"),
});

export const CONTRACT_ADDRESS =
  "bGMxiu9q9JQX2KtdeLjVdxErq3XkDVYyJ48BMC6vYGXWQ56";
