import { ISO963_1 } from "./ISO963";

export interface FilterConfig {
  binaryThreshold: number;
  erodeKernelSize: number;
  erodeIterations: number;
  dilateKernelSize: number;
  dilateIterations: number;
  inverse: boolean;
  zoom: number;
}

export interface TranslatorConfig {
  url: string;
  key: string;
  provider: string; // 翻译引擎
  srcLang: ISO963_1;
  destLang: ISO963_1;
  cache: boolean;
}

export interface StreamMeta {
  video: {
    height: number;
    width: number;
  };
}

export interface MediaDevicesConfig extends Partial<MediaStreamConstraints> {
  enabled: boolean;
  fromScreen: boolean;
  videoDeviceId?: string;
  video: {
    height: number; // 不控制实际录制的分辨率，只用来保存当前视频流的属性
    width: number; // 不控制实际录制的分辨率，只用来保存当前视频流的属性
  } & MediaTrackConstraints;
  audio: boolean;
  audioDeviceId?: string;
}

export interface ReplayConfig {
  mute: boolean;
}

export interface CutArea {
  enabled: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  interval: number;
}

export type OcrLangType = "jpn" | "eng" | "chi_sim" | "chi_tra";
export interface OcrConfig {
  lang: OcrLangType;
  poolSize: number;
}
