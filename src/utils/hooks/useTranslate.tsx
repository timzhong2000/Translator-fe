import { TranslatorConfig } from "@/types/globalConfig";
import { useEffect, useState } from "react";
import { TranslateResult } from "@/types/Payload";
import { TranslatorClientBase } from "../TranslatorClient";

export const useTranslate = (config: TranslatorConfig, srcText: string) => {
  const [result, setResult] = useState<TranslateResult>();

  useEffect(() => {
    if (!srcText) return;
    new TranslatorClientBase(config, console.log)
      .translate(srcText)
      .then((res) => setResult(res));
  }, [config, srcText]);

  return result;
};
