import { createContext, useEffect, useState } from "react";
import {
  TranslatorConfig,
  MediaDevicesConfig,
  ReplayConfig,
  CutArea,
  FilterConfig,
  OcrConfig,
} from "../types/globalConfig";

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
  url: "https://transapi.timzhong.top",
  key: "",
  provider: "baidu",
  srcLang: "ja",
  destLang: "zh_CN",
  cache: true,
};

const defaultMediaDevicesConfig: MediaDevicesConfig = {
  enabled: false,
  fromScreen: false,
  video: {
    width: 1920,
    height: 1080,
    frameRate: 30,
  },
  videoDeviceId: undefined,
  audio: true,
  audioDeviceId: undefined,
};

const defaultReplayConfig: ReplayConfig = {
  mute: false,
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
  lang: "jpn",
  poolSize: 4
};

function getConfig<T>(tag: string, defaultValue: T, loadCache = true) {
  const local = loadCache
    ? (JSON.parse(localStorage.getItem(tag) || "{}") as Partial<T>)
    : {};
  return {
    ...defaultValue,
    ...local,
  };
}

export interface ConfigContext {
  filterConfig: FilterConfig;
  setFilterConfig: React.Dispatch<React.SetStateAction<FilterConfig>>;
  cutArea: CutArea;
  setCutArea: React.Dispatch<React.SetStateAction<CutArea>>;
  translatorConfig: TranslatorConfig;
  setTranslatorConfig: React.Dispatch<React.SetStateAction<TranslatorConfig>>;
  mediaDevicesConfig: MediaDevicesConfig;
  setMediaDevicesConfig: React.Dispatch<
    React.SetStateAction<MediaDevicesConfig>
  >;
  replayConfig: ReplayConfig;
  setReplayConfig: React.Dispatch<React.SetStateAction<ReplayConfig>>;
  ocrConfig: OcrConfig;
  setOcrConfig: React.Dispatch<React.SetStateAction<OcrConfig>>;
  reset: () => void;
}

export const configContext = createContext({} as ConfigContext);

export const ConfigContextProvider: React.FC = (props) => {
  const [filterConfig, setFilterConfig] = useState<FilterConfig>(
    getConfig("FilterConfig", defaultFilterConfig)
  );
  const [cutArea, setCutArea] = useState<CutArea>(
    getConfig("CutArea", defaultCutAreaConfig)
  );
  const [translatorConfig, setTranslatorConfig] = useState<TranslatorConfig>(
    getConfig("TranslatorConfig", defaultTranslatorConfig)
  );
  const [mediaDevicesConfig, setMediaDevicesConfig] =
    useState<MediaDevicesConfig>(
      getConfig("MediaDevicesConfig", defaultMediaDevicesConfig, false)
    );
  const [replayConfig, setReplayConfig] = useState<ReplayConfig>(
    getConfig("ReplayConfig", defaultReplayConfig)
  );
  const [ocrConfig, setOcrConfig] = useState<OcrConfig>(
    getConfig("OcrConfig", defaultOcrConfig)
  );

  useEffect(() => {
    console.log("[Config-Context] start");
    return () => {
      console.log("[Config-Context] end");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("FilterConfig", JSON.stringify(filterConfig));
    localStorage.setItem("CutAreaConfig", JSON.stringify(cutArea));
    localStorage.setItem("TranslatorConfig", JSON.stringify(translatorConfig));
    localStorage.setItem(
      "MediaDevicesConfig",
      JSON.stringify(mediaDevicesConfig)
    );
    localStorage.setItem("ReplayConfig", JSON.stringify(replayConfig));
    localStorage.setItem("OcrConfig", JSON.stringify(ocrConfig));
  }, [
    filterConfig,
    cutArea,
    translatorConfig,
    mediaDevicesConfig,
    replayConfig,
    ocrConfig,
  ]);

  const reset = () => {
    setFilterConfig(getConfig("FilterConfig", defaultFilterConfig, false));
    setCutArea(getConfig("CutArea", defaultCutAreaConfig, false));
    setTranslatorConfig(
      getConfig("TranslatorConfig", defaultTranslatorConfig, false)
    );
    setMediaDevicesConfig(
      getConfig("MediaDevicesConfig", defaultMediaDevicesConfig, false)
    );
    setReplayConfig(getConfig("ReplayConfig", defaultReplayConfig, false));
    setOcrConfig(getConfig("OcrConfig", defaultOcrConfig, false));
  };

  return (
    <configContext.Provider
      value={{
        filterConfig,
        setFilterConfig,
        cutArea,
        setCutArea,
        translatorConfig,
        setTranslatorConfig,
        mediaDevicesConfig,
        setMediaDevicesConfig,
        replayConfig,
        setReplayConfig,
        ocrConfig,
        setOcrConfig,
        reset,
      }}
    >
      {props.children}
    </configContext.Provider>
  );
};
