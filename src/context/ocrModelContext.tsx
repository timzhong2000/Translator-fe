import { ConnectedComponentType, OcrBase, createTesseractOcr } from "@/model";
import { DefaultOcr } from "@/model";
import { createConnector } from "@/context/connector";
import { useState, useEffect, createContext } from "react";
import { storeContext } from "./store";

export const ocrModelContext = createContext({} as OcrBase);

export const ocrConfigConnector = createConnector(
  storeContext,
  ({ ocrConfig }) => ({ ocrConfig })
);

// const config = { url: "http://localhost:5000/api/rec", lang: "japan" };
const defaultOcr = new DefaultOcr();

const _OcrModelContextProvider: ConnectedComponentType<
  typeof ocrConfigConnector
> = ({ ocrConfig, children }) => {
  const [ocr, setOcr] = useState(defaultOcr as OcrBase);
  useEffect(() => {
    // createPaddleOcr(config).then((paddle) => setOcr(paddle));
    createTesseractOcr({ workerConfig: {}, language: "jpn" }).then(
      (tesseract) => setOcr(tesseract)
    );
  }, [ocrConfig]);
  return (
    <ocrModelContext.Provider value={ocr}>{children}</ocrModelContext.Provider>
  );
};

export const OcrModelContextProvider = ocrConfigConnector(
  _OcrModelContextProvider
);
