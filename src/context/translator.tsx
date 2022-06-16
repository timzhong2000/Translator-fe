import { TranslatorConfig } from "@/types/globalConfig";
import { TranslateResult } from "@/types/Payload";
import { useTranslate } from "@/utils/hooks/useTranslate";
import { createContext, useContext, useState } from "react";
import { configContext } from "./config";
import { tesseractContext } from "./tesseract";

interface translatorContext {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  result?: TranslateResult;
}

export const translatorContext = createContext({} as translatorContext);

export const TranslatorProvider: React.FC<{
  translatorConfig: TranslatorConfig;
  srcText: string;
}> = (props) => {
  const [enabled, setEnabled] = useState(true);
  const result = useTranslate(
    props.translatorConfig,
    enabled ? props.srcText : ""
  );

  return (
    <translatorContext.Provider value={{ enabled, setEnabled, result }}>
      {props.children}
    </translatorContext.Provider>
  );
};

export const TranslatorProviderWithConfig: React.FC = (props) => {
  const { result: srcText } = useContext(tesseractContext);
  const { translatorConfig } = useContext(configContext);
  return (
    <TranslatorProvider translatorConfig={translatorConfig} srcText={srcText}>
      {props.children}
    </TranslatorProvider>
  );
};
