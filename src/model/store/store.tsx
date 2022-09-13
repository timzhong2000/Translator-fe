import { OcrBackend, StreamConfig, TranslatorConfig, OcrConfig } from "@/model";
import { throttle } from "lodash-es";
import { createContext, useEffect, useState } from "react";
import { CutArea, FilterConfig } from "../../types/globalConfig";

const defaultFilterConfig: FilterConfig = {
  binaryThreshold: 50,
  erodeKernelSize: 3,
  erodeIterations: 0,
  dilateKernelSize: 3,
  dilateIterations: 0,
  inverse: false,
  zoom: 1,
};

const defaultTranslatorConfig: TranslatorConfig = {
  url: "http://localhost:3002",
  secretKey: "",
  provider: "baidu",
  srcLang: "ja",
  destLang: "zh_CN",
  cache: true,
};

const defaultStreamConfig: StreamConfig = {
  enabled: false,
  fromScreen: false,
  video: {
    frameRate: 30,
  },
  videoDeviceId: undefined,
  audio: true,
  audioDeviceId: undefined,
  muted: false,
};

const defaultCutAreaConfig: CutArea = {
  enabled: true,
  x1: 0,
  x2: 1,
  y1: 0,
  y2: 0,
  interval: 1000,
};

const defaultOcrConfig: OcrConfig = {
  type: OcrBackend.TesseractFrontend,
  lang: "jpn",
};

function getConfig<T>(tag: string, defaultValue: T, loadCache = true) {
  if (loadCache) {
    const cache = localStorage.getItem(tag);
    return cache ? (JSON.parse(cache) as T) : defaultValue;
  }
  return defaultValue;
}

export interface StoreContext {
  filterConfig: FilterConfig;
  setFilterConfig: (data: FilterConfig) => void;
  cutArea: CutArea;
  setCutArea: (data: CutArea) => void;
  translatorConfig: TranslatorConfig;
  setTranslatorConfig: (data: TranslatorConfig) => void;
  streamConfig: StreamConfig;
  setStreamConfig: (data: StreamConfig) => void;
  ocrConfig: OcrConfig;
  setOcrConfig: React.Dispatch<React.SetStateAction<OcrConfig>>;
  reset: () => void;
}

function useDataStore<T>(tag: string, defaultValue: T) {
  const [data, setData] = useState(getConfig(tag, defaultValue));
  useEffect(
    throttle(() => localStorage.setItem(tag, JSON.stringify(data)), 10000),
    [data]
  ); // auto save
  return {
    data,
    setData,
    reset: () => setData(getConfig(tag, defaultValue, false)),
  };
}

export const storeContext = createContext({} as StoreContext);

export const StoreContextProvider: React.FC = (props) => {
  const {
    data: filterConfig,
    setData: setFilterConfig,
    reset: resetFilterConfig,
  } = useDataStore("FilterConfig", defaultFilterConfig);
  const {
    data: cutArea,
    setData: setCutArea,
    reset: resetCutArea,
  } = useDataStore("CutAreaConfig", defaultCutAreaConfig);
  const {
    data: translatorConfig,
    setData: setTranslatorConfig,
    reset: resetTranslatorConfig,
  } = useDataStore("TranslatorConfig", defaultTranslatorConfig);
  const {
    data: streamConfig,
    setData: setStreamConfig,
    reset: resetMediaDevicesConfig,
  } = useDataStore("StreamConfig", defaultStreamConfig);
  const {
    data: ocrConfig,
    setData: setOcrConfig,
    reset: resetOcrConfig,
  } = useDataStore("OcrConfig", defaultOcrConfig);

  useEffect(() => {
    console.log("[Config-Context] start");
    return () => {
      console.log("[Config-Context] end");
    };
  }, []);

  const reset = () => {
    resetFilterConfig();
    resetCutArea();
    resetTranslatorConfig();
    resetMediaDevicesConfig();
    resetOcrConfig();
  };

  return (
    <storeContext.Provider
      value={{
        filterConfig,
        setFilterConfig,
        cutArea,
        setCutArea,
        translatorConfig,
        setTranslatorConfig,
        streamConfig,
        setStreamConfig,
        ocrConfig,
        setOcrConfig,
        reset,
      }}
    >
      {props.children}
    </storeContext.Provider>
  );
};
