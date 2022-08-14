import opencv_ts from "opencv-ts";

export { Mat } from "opencv-ts";
export type OpenCV = typeof opencv_ts;
export enum PreProcessorEvent {
  ON_OPENCV_LOADED,
  ON_OPENCV_ERROR,
  ON_SIZE_CHANGED,
}
