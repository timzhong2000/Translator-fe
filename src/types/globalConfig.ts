import { ISO963_1 } from "./ISO963";

export interface FilterConfig {
  binaryThreshold: number,
  erodeKernelSize: number,
  erodeIterations: number,
}

export interface TranslatorConfig {
  url: string;
  key: string;
  provider: string; // 翻译引擎
  srcLang: ISO963_1;
  destLang: ISO963_1;
  cache: boolean;
}

export interface MediaDevicesConfig extends Partial<MediaStreamConstraints> {
  enabled: boolean;
  fromScreen: boolean;
  videoDeviceId?: string
  video: { height: number; width: number; frameRate: number;} & MediaTrackConstraints;
  audio: boolean;
  audioDeviceId?: string
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
