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
