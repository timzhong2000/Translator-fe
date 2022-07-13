import { TranslatorConfig } from "@/types/globalConfig";
import { useEffect, useState } from "react";
import { TranslateResult } from "@/types/Payload";
import { TranslatorClientBase } from "../TranslatorClient";
import { logger, LogType } from "@/utils/logger";

export const useTranslate = (config: TranslatorConfig, srcText: string) => {
  const [result, setResult] = useState<TranslateResult>();

  useEffect(() => {
    if (!srcText) return;
    new TranslatorClientBase(config, (err) =>
      logger.record(LogType.TRANSLATOR_ERROR, err)
    )
      .translate(srcText)
      .then((res) => setResult(res));
  }, [config, srcText]);

  return result;
};
