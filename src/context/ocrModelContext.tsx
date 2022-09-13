import { OcrBase, createTesseractOcr } from "@/model";
import { DefaultOcr } from "@/model";
import { useState, useEffect, createContext, FC } from "react";
import { core } from "@/model/core";
import { observer } from "mobx-react-lite";

export const ocrModelContext = createContext({} as OcrBase);

// const config = { url: "http://localhost:5000/api/rec", lang: "japan" };
const defaultOcr = new DefaultOcr();

const _OcrModelContextProvider: FC = ({ children }) => {
  const [ocr, setOcr] = useState(defaultOcr as OcrBase);
  const ocrConfig = core.config.ocrConfig;
  useEffect(() => {
    // createPaddleOcr(config).then((paddle) => setOcr(paddle));
    createTesseractOcr({ workerConfig: {}, language: "jpn" }).then(
      (tesseract) => {
        setOcr(tesseract);
        // (window as any).ocr = tesseract;
      }
    );
    return () => ocr.destroy();
  }, [ocrConfig]);
  return (
    <ocrModelContext.Provider value={ocr}>{children}</ocrModelContext.Provider>
  );
};

export const OcrModelContextProvider = observer(_OcrModelContextProvider);
