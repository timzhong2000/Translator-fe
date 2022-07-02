import { useOcrClient } from "@/utils/hooks/useOcrClient";
import React, { createContext, useState } from "react";

interface OcrContext {
  recongnize: React.Dispatch<React.SetStateAction<Blob>>;
  text: string;
  setEnable: React.Dispatch<React.SetStateAction<boolean>>;
  enable: boolean;
}

export const ocrContext = createContext({} as OcrContext);

export const OcrContextProvider: React.FC = (props) => {
  const [blob, setBlob] = useState<Blob>(new Blob());
  const [enable, setEnable] = useState(true);
  const text = useOcrClient("tesseract-local", blob);
  return (
    <ocrContext.Provider
      value={{
        recongnize: setBlob,
        text: enable ? text : "ocr已暂停",
        enable,
        setEnable,
      }}
    >
      {props.children}
    </ocrContext.Provider>
  );
};
