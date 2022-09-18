import { FilterConfig, CutArea } from "@/types/globalConfig";
import { OcrConfig, OcrEngine, TesseractOcrConfig } from "../ocr";
import { StreamSourceConfig } from "@/types/streamSource";
import { TranslatorConfig } from "../translator";

export const defaultFilterConfig: FilterConfig = {
  binaryThreshold: 50,
  erodeKernelSize: 3,
  erodeIterations: 0,
  dilateKernelSize: 3,
  dilateIterations: 0,
  inverse: false,
  zoom: 1,
};

export const defaultTranslatorConfig: TranslatorConfig = {
  enabled: true,
  url: "http://localhost:3002",
  secretKey: "",
  provider: "baidu",
  srcLang: "ja",
  destLang: "zh_CN",
  cache: true,
};

export const defaultStreamSourceConfig: StreamSourceConfig = {
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

export const defaultCutAreaConfig: CutArea = {
  enabled: true,
  x1: 0,
  x2: 1,
  y1: 0,
  y2: 0,
  interval: 1000,
};

export const defaultOcrConfig: OcrConfig = {
  type: OcrEngine.TesseractFrontend,
  workerConfig: {},
  lang: "jpn",
} as TesseractOcrConfig;
