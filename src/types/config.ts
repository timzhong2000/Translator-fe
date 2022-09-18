import { FilterConfig, CutArea } from "@/types/globalConfig";
import { OcrConfig } from "../model/ocr";
import { TranslatorConfig } from "../model/translator";
import { StreamSourceConfig } from "./streamSource";

export interface GlobalConfig {
  [ConfigScope.FILTER]: FilterConfig;
  [ConfigScope.CUT_AREA]: CutArea;
  [ConfigScope.OCR]: OcrConfig;
  [ConfigScope.TRANSLATOR]: TranslatorConfig;
  [ConfigScope.STREAM_SOURCE]: StreamSourceConfig;
}

export enum ConfigScope {
  FILTER = "filterConfig",
  CUT_AREA = "cutAreaConfig",
  OCR = "ocrConfig",
  STREAM_SOURCE = "streamSourceConfig",
  TRANSLATOR = "translatorConfig",
}
