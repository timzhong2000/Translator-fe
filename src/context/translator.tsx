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

export const TranslatorProvider: React.FC = (props) => {
  const [enabled, setEnabled] = useState(true);
  const { translatorConfig } = useContext(configContext);
  const { result: srcText } = useContext(tesseractContext);
  const result = useTranslate(
    translatorConfig,
    enabled ? encodeURIComponent(srcText) : ""
  );

  return (
    <translatorContext.Provider value={{ enabled, setEnabled, result }}>
      {props.children}
    </translatorContext.Provider>
  );
};
