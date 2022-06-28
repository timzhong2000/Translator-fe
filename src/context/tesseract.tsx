import { OcrLangType } from "@/types/globalConfig";
import React, {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createWorker, ImageLike, WorkerOptions } from "tesseract.js";
import { configContext } from "./config";

const defaultConfig: Partial<WorkerOptions> = {
  corePath: "/vendor/tesseract/tesseract-core.wasm.js",
  langPath: "/vendor/tesseract/tessdata_fast",
  workerPath: "/vendor/tesseract/worker.min.js",
  errorHandler: (err) => console.error(err),
  gzip: false,
  cacheMethod: "none",
};

export interface TesseractContext {
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  statusList: MutableRefObject<TesseractHook.Status[]>;
  progressList: MutableRefObject<number[]>;
  recognize: (pic: ImageLike) => Promise<void>;
}

export const tesseractContext = createContext({} as TesseractContext);

export namespace TesseractHook {
  export type Status =
    | "loading tesseract core"
    | "loading tesseract core failed"
    | "initializing tesseract"
    | "initializing tesseract failed"
    | "initializing api"
    | "initializing api failed"
    | "recognizing text"
    | "idle";

  const logParser =
    (
      setStatus: (status: Status) => void,
      setProgress: (progress: number) => void
    ) =>
    (log: any) => {
      if (!log) return;
      const status = log.status as Status;
      const progress = log.progress as number;
      setStatus(status);
      setProgress(progress);
    };

  const createServer = (
    config: Partial<WorkerOptions>,
    language: OcrLangType,
    onReady: () => void
  ) => {
    const worker = createWorker(config);
    (async () => {
      await worker.load();
      await worker.loadLanguage(language);
      await worker.initialize(language);
      onReady();
    })();
    return worker;
  };

  const removeStopWords = (text: string) => {
    text = text.replaceAll(/\s|\d/g, "");
    return text;
  };

  export const TesseractContextProvider: React.FC<{
    poolSize: number;
    lang: OcrLangType;
  }> = (props) => {
    const pool = useRef<Tesseract.Worker[]>([]);
    const statusList = useRef<Status[]>([]);
    const progressList = useRef<number[]>([]);
    const [result, setResult] = useState("");

    // initial tesseract
    useEffect(() => {
      for (let i = 0; i < props.poolSize; i++) {
        console.log("[tesseract] create server")
        pool.current.push(
          createServer(
            {
              ...defaultConfig,
              logger: logParser(
                (status) => (statusList.current[i] = status),
                (progress) => (progressList.current[i] = progress)
              ),
            },
            props.lang,
            () => (statusList.current[i] = "idle")
          )
        );
      }
      return () => {
        pool.current.forEach((server) => server.terminate());
        pool.current = [];
      };
    }, [props.lang, props.poolSize]);

    const recognize = useCallback(
      async (pic: ImageLike) => {
        const id = statusList.current.findIndex((v) => v === "idle");
        if (id >= 0) {
          statusList.current[id] = "recognizing text";
          (async () => {
            console.time(`[Tesseract Hook] (worker ${id}) recognize`);
            const {
              data: { text: text },
            } = await pool.current[id].recognize(pic);
            console.timeEnd(`[Tesseract Hook] (worker ${id}) recognize`);
            setResult(removeStopWords(text));
            statusList.current[id] = "idle";
          })();
        } else {
          console.error("all busy");
        }
      },
      [statusList]
    );

    return (
      <tesseractContext.Provider
        value={{ statusList, progressList, result, setResult, recognize }}
      >
        {props.children}
      </tesseractContext.Provider>
    );
  };

  export const TesseractContextProviderWithConfig: React.FC = (props) => {
    const { ocrConfig } = useContext(configContext);
    return (
      <TesseractContextProvider lang={ocrConfig.lang} poolSize={ocrConfig.poolSize}>
        {props.children}
      </TesseractContextProvider>
    );
  };
}
