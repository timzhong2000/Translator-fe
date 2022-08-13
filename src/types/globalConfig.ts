import { OcrBackend } from "@/model/ocr/types";

export interface FilterConfig {
  binaryThreshold: number;
  erodeKernelSize: number;
  erodeIterations: number;
  dilateKernelSize: number;
  dilateIterations: number;
  inverse: boolean;
  zoom: number;
}

export interface StreamMeta {
  video: {
    height: number;
    width: number;
  };
}

export interface CutArea {
  enabled: boolean;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  interval: number;
}


