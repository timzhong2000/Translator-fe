import { FilterConfig, CutArea } from "@/types/globalConfig";
import { OcrConfig } from "../ocr";
import { StreamSourceConfig } from "../stream";
import { TranslatorConfig } from "../translator";

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
