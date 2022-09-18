import { CutArea, FilterConfig } from "@/types/globalConfig";
import ISO963_1 from "@/types/ISO963";
import { StreamSourceConfig } from "@/types/streamSource";
import { ExhaustiveCheckError } from "@/utils/common/error";
import { cloneDeep, debounce, merge } from "lodash-es";
import { makeAutoObservable } from "mobx";
import {
  isPaddleOcrConfig,
  isTesseractOcrConfig,
  OcrConfig,
  OcrEngine,
  OcrLangType,
} from "../ocr";
import {
  defaultFilterConfig,
  defaultCutAreaConfig,
  defaultOcrConfig,
  defaultTranslatorConfig,
  defaultStreamSourceConfig,
} from "./defaultConfig";
import { ConfigScope } from "./types";

function getConfig<T>(tag: ConfigScope, defaultValue: T, loadCache = true) {
  if (loadCache) {
    const cache = localStorage.getItem(tag);
    return cache
      ? merge(cloneDeep(defaultValue), JSON.parse(cache) as T)
      : defaultValue;
  }
  return defaultValue;
}

const saveConfig = debounce((tag: ConfigScope, config: unknown) => {
  localStorage.setItem(tag, JSON.stringify(config));
}, 500);

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

  save = (scope: ConfigScope) => {
    saveConfig(scope, this[scope]);
  };

  /* FilterConfig */
  patchFilterConfig = (config: Partial<FilterConfig>) => {
    this.save(ConfigScope.FILTER);
    this[ConfigScope.FILTER] = { ...this[ConfigScope.FILTER], ...config };
  };

  setBinaryThreshold = (threshold: number) => {
    this.save(ConfigScope.FILTER);
    this[ConfigScope.FILTER].binaryThreshold = threshold;
  };

  setErodeKernelSize = (size: number) => {
    this[ConfigScope.FILTER].erodeKernelSize = size;
    this.save(ConfigScope.FILTER);
  };

  setErodeIterations = (interations: number) => {
    this[ConfigScope.FILTER].erodeIterations = interations;
    this.save(ConfigScope.FILTER);
  };

  setDilateKernelSize = (size: number) => {
    this[ConfigScope.FILTER].dilateKernelSize = size;
    this.save(ConfigScope.FILTER);
  };

  setDilateIterations = (interations: number) => {
    this[ConfigScope.FILTER].dilateIterations = interations;
    this.save(ConfigScope.FILTER);
  };

  setInverse = (inverse: boolean) => {
    this[ConfigScope.FILTER].inverse = inverse;
  };

  toggleInverse = () => {
    this.setInverse(!this[ConfigScope.FILTER].inverse);
  };

  setZoom = (zoomFactor: number) => {
    this[ConfigScope.FILTER].zoom = zoomFactor;
    this.save(ConfigScope.FILTER);
  };

  /* CutArea */
  patchCutArea = (config: Partial<CutArea>) => {
    this[ConfigScope.CUT_AREA] = { ...this[ConfigScope.CUT_AREA], ...config };
    this.save(ConfigScope.CUT_AREA);
  };

  /* Translator */
  setTrnaslatorBackendUrl = (url: string) => {
    this[ConfigScope.TRANSLATOR].url = url;
    this.save(ConfigScope.TRANSLATOR);
  };

  setSecretKey = (secretKey: string) => {
    this[ConfigScope.TRANSLATOR].secretKey = secretKey;
    this.save(ConfigScope.TRANSLATOR);
  };

  setProvider = (provider: string) => {
    this[ConfigScope.TRANSLATOR].provider = provider;
    this.save(ConfigScope.TRANSLATOR);
  };

  setSrcLang = (srcLang: ISO963_1) => {
    this[ConfigScope.TRANSLATOR].srcLang = srcLang;
    this.save(ConfigScope.TRANSLATOR);
  };

  setDestLang = (destLang: ISO963_1) => {
    this[ConfigScope.TRANSLATOR].destLang = destLang;
    this.save(ConfigScope.TRANSLATOR);
  };

  enableCache = () => {
    this[ConfigScope.TRANSLATOR].cache = true;
    this.save(ConfigScope.TRANSLATOR);
  };

  dissableCache = () => {
    this[ConfigScope.TRANSLATOR].cache = false;
    this.save(ConfigScope.TRANSLATOR);
  };

  /* OCR */
  setOcrConfig = (config: OcrConfig) => {
    this[ConfigScope.OCR] = config;
    this.save(ConfigScope.OCR);
  };

  // 必须保证当前类型一致才可以patch，失败时返回false
  patchOcrConfig = (config: Pick<OcrConfig, "type"> & Partial<OcrConfig>) => {
    const type = this[ConfigScope.OCR].type;
    switch (type) {
      case OcrEngine.PaddleOcrBackend:
        if (isPaddleOcrConfig(config)) {
          this.setOcrConfig({ ...this[ConfigScope.OCR], ...config });
          return true;
        }
        break;
      case OcrEngine.TesseractFrontend:
        if (isTesseractOcrConfig(config)) {
          this.setOcrConfig({ ...this[ConfigScope.OCR], ...config });
          return true;
        }
        break;
      default: {
        const exhaustiveCheck: never = type;
        throw new ExhaustiveCheckError(exhaustiveCheck);
      }
    }
    console.warn(
      `[patchOcrConfig] warning: cannot patch type (${config.type}) to current type(${type})`
    );
  };

  setOcrLang = (lang: OcrLangType) => {
    this[ConfigScope.OCR].lang = lang;
    this.save(ConfigScope.OCR);
  };

  /* StreamSource */
  patchStreamSourceConfig = (config: Partial<StreamSourceConfig>) => {
    this[ConfigScope.STREAM_SOURCE] = {
      ...this[ConfigScope.STREAM_SOURCE],
      ...config,
    };
    this.save(ConfigScope.STREAM_SOURCE);
  };

  enableStreamRecord = () => {
    this[ConfigScope.STREAM_SOURCE].enabled = true;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  disableStreamRecord = () => {
    this[ConfigScope.STREAM_SOURCE].enabled = false;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  setFromScreen = (isFromScreen: boolean) => {
    this[ConfigScope.STREAM_SOURCE].fromScreen = isFromScreen;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  toggleFromScreen = () => {
    this.setFromScreen(!this[ConfigScope.STREAM_SOURCE].fromScreen);
    this.save(ConfigScope.STREAM_SOURCE);
  };

  setMuted = (muted: boolean) => {
    this[ConfigScope.STREAM_SOURCE].muted = muted;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  toggleAudioEnabled = () => {
    this[ConfigScope.STREAM_SOURCE].audio =
      !this[ConfigScope.STREAM_SOURCE].audio;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  setAudioDeviceId = (id?: string) => {
    this[ConfigScope.STREAM_SOURCE].audioDeviceId = id;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  setVideoConfig = (config: MediaTrackConstraints) => {
    this[ConfigScope.STREAM_SOURCE].video = config;
    this.save(ConfigScope.STREAM_SOURCE);
  };

  setVideoDeviceId = (id?: string) => {
    this[ConfigScope.STREAM_SOURCE].videoDeviceId = id;
    this.save(ConfigScope.STREAM_SOURCE);
  };
}

// 单例
export const config = new Config();
