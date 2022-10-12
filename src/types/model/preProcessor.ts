export type { Mat } from "@techstark/opencv-js";
export type OpenCV = typeof window.cv;

export enum OpenCVStatus {
  Uninitialized = "uninitialized",
  Loading = "loading",
  Ready = "ready",
  LoadFailed = "load_failed",
}
