import { TranslatorConfig } from "../../model/translator";
import { OcrConfig } from "./ocr";

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

export interface FilterConfig {
  binaryThreshold: number;
  erodeKernelSize: number;
  erodeIterations: number;
  dilateKernelSize: number;
  dilateIterations: number;
  inverse: boolean;
  zoom: number;
}

export interface CutArea {
  enabled: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  interval: number;
}

export interface StreamSourceConfig extends Partial<MediaStreamConstraints> {
  enabled: boolean;
  fromScreen: boolean;
  video: MediaTrackConstraints;
  videoDeviceId?: string;
  audio: boolean;
  audioDeviceId?: string;
  muted: boolean;
}
