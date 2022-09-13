import { CutArea, FilterConfig } from "@/types/globalConfig";
import ISO963_1 from "@/types/ISO963";
import { cloneDeep, merge } from "lodash-es";
import { makeAutoObservable } from "mobx";
import { OcrConfig, OcrLangType } from "../ocr";
import { StreamSourceConfig } from "../stream";
import {
  defaultFilterConfig,
  defaultCutAreaConfig,
  defaultOcrConfig,
  defaultTranslatorConfig,
  defaultStreamSourceConfig,
} from "./defaultConfig";
import { ConfigScope } from "./types";

function getConfig<T>(tag: string, defaultValue: T, loadCache = true) {
  if (loadCache) {
    const cache = localStorage.getItem(tag);
    return cache
      ? merge(cloneDeep(defaultValue), JSON.parse(cache) as T)
      : defaultValue;
  }
  return defaultValue;
}

export class Config {
  [ConfigScope.FILTER] = getConfig(ConfigScope.FILTER, defaultFilterConfig);
  [ConfigScope.CUT_AREA] = getConfig(
    ConfigScope.CUT_AREA,
    defaultCutAreaConfig
  );
  [ConfigScope.OCR] = getConfig(ConfigScope.OCR, defaultOcrConfig);
  [ConfigScope.TRANSLATOR] = getConfig(
    ConfigScope.TRANSLATOR,
    defaultTranslatorConfig
  );
  [ConfigScope.STREAM_SOURCE] = getConfig(
    ConfigScope.STREAM_SOURCE,
    defaultStreamSourceConfig
  );

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 初始化设置
   * @param recover 是否尝试从localstorage还原以前的设置
   * @returns
   */
  initConfig = (recover = true) => {
    this[ConfigScope.FILTER] = getConfig(
      ConfigScope.FILTER,
      defaultFilterConfig,
      recover
    );
    this[ConfigScope.CUT_AREA] = getConfig(
      ConfigScope.CUT_AREA,
      defaultCutAreaConfig,
      recover
    );
    this[ConfigScope.OCR] = getConfig(ConfigScope.OCR, defaultOcrConfig);
    this[ConfigScope.TRANSLATOR] = getConfig(
      ConfigScope.TRANSLATOR,
      defaultTranslatorConfig,
      recover
    );
    this[ConfigScope.STREAM_SOURCE] = getConfig(
      ConfigScope.STREAM_SOURCE,
      defaultStreamSourceConfig,
      recover
    );
  };

  reset = () => {
    this.initConfig(false);
  };

  /* FilterConfig */
  patchFilterConfig = (config: Partial<FilterConfig>) => {
    this[ConfigScope.FILTER] = { ...this[ConfigScope.FILTER], ...config };
  };

  setBinaryThreshold = (threshold: number) => {
    this[ConfigScope.FILTER].binaryThreshold = threshold;
  };

  setErodeKernelSize = (size: number) => {
    this[ConfigScope.FILTER].erodeKernelSize = size;
  };

  setErodeIterations = (interations: number) => {
    this[ConfigScope.FILTER].erodeIterations = interations;
  };

  setDilateKernelSize = (size: number) => {
    this[ConfigScope.FILTER].dilateKernelSize = size;
  };

  setDilateIterations = (interations: number) => {
    this[ConfigScope.FILTER].dilateIterations = interations;
  };

  setInverse = (inverse: boolean) => {
    this[ConfigScope.FILTER].inverse = inverse;
  };

  toggleInverse = () => {
    this.setInverse(!this[ConfigScope.FILTER].inverse);
  };

  setZoom = (zoomFactor: number) => {
    this[ConfigScope.FILTER].zoom = zoomFactor;
  };

  /* CutArea */
  patchCutArea = (config: Partial<CutArea>) => {
    this[ConfigScope.CUT_AREA] = { ...this[ConfigScope.CUT_AREA], ...config };
  };

  /* Translator */
  setTrnaslatorBackendUrl = (url: string) => {
    this[ConfigScope.TRANSLATOR].url = url;
  };

  setSecretKey = (secretKey: string) => {
    this[ConfigScope.TRANSLATOR].secretKey = secretKey;
  };

  setProvider = (provider: string) => {
    this[ConfigScope.TRANSLATOR].provider = provider;
  };

  setSrcLang = (srcLang: ISO963_1) => {
    this[ConfigScope.TRANSLATOR].srcLang = srcLang;
  };

  setDestLang = (destLang: ISO963_1) => {
    this[ConfigScope.TRANSLATOR].destLang = destLang;
  };

  enableCache = () => {
    this[ConfigScope.TRANSLATOR].cache = true;
  };

  dissableCache = () => {
    this[ConfigScope.TRANSLATOR].cache = false;
  };

  /* OCR */
  patchOcrConfig = (config: Partial<OcrConfig>) => {
    this[ConfigScope.OCR] = { ...this[ConfigScope.OCR], ...config };
  };

  setOcrLang = (lang: OcrLangType) => {
    this[ConfigScope.OCR].lang = lang;
  };

  /* StreamSource */
  patchStreamSourceConfig = (config: Partial<StreamSourceConfig>) => {
    this[ConfigScope.STREAM_SOURCE] = {
      ...this[ConfigScope.STREAM_SOURCE],
      ...config,
    };
  };

  enableStreamRecord = () => {
    this[ConfigScope.STREAM_SOURCE].enabled = true;
  };

  disableStreamRecord = () => {
    this[ConfigScope.STREAM_SOURCE].enabled = false;
  };

  setFromScreen = (isFromScreen: boolean) => {
    this[ConfigScope.STREAM_SOURCE].fromScreen = isFromScreen;
  };

  toggleFromScreen = () => {
    this.setFromScreen(!this[ConfigScope.STREAM_SOURCE].fromScreen);
  };

  setMuted = (muted: boolean) => {
    this[ConfigScope.STREAM_SOURCE].muted = muted;
  };

  toggleAudioEnabled = () => {
    this[ConfigScope.STREAM_SOURCE].audio =
      !this[ConfigScope.STREAM_SOURCE].audio;
  };

  setAudioDeviceId = (id?: string) => {
    this[ConfigScope.STREAM_SOURCE].audioDeviceId = id;
  };

  setVideoConfig = (config: MediaTrackConstraints) => {
    this[ConfigScope.STREAM_SOURCE].video = config;
  };

  setVideoDeviceId = (id?: string) => {
    this[ConfigScope.STREAM_SOURCE].videoDeviceId = id;
  };
}
