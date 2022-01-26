import { TranslateResult } from "@/types/Payload";
import { useTranslate } from "@/utils/hooks/useTranslate";
import { createContext, useContext } from "react";
import { configContext } from "./config";
import { tesseractContext } from "./tesseract";

interface translatorContext {
  result?: TranslateResult;
}

export const translatorContext = createContext({} as translatorContext);

export const TranslatorProvider: React.FC = (props) => {
  const { translatorConfig } = useContext(configContext);
  const { result: srcText } = useContext(tesseractContext);
  const result = useTranslate(translatorConfig, srcText.replaceAll('?','？'));
  return (
    <translatorContext.Provider value={{ result }}>
      {props.children}
    </translatorContext.Provider>
  );
};
