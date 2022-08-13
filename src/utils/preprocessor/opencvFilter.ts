import { Mat, OpenCV } from "@/model";
import { FilterConfig } from "@/types/globalConfig";
import { logger, LogType } from "../logger";

export const opencvBackgroundColor = (cv: OpenCV, src: Mat) => {
  const mean = cv.mean(src) as unknown as Array<number>; // todo
  return {
    r: mean[0],
    g: mean[1],
    b: mean[2],
    a: mean[3],
  };
};

export const createOpencvFilter = ({
  binaryThreshold,
  inverse,
  erodeIterations,
  erodeKernelSize,
  dilateIterations,
  dilateKernelSize,
  zoom,
}: FilterConfig) => {
  return function filter(cv: OpenCV, src: Mat) {
    const endTimer = logger.timing(LogType.OPENCV_PROCESS);
    const zoomFactor = Math.min(
      3,
      Math.ceil(1 / ((src.rows * src.cols) / 1000000))
    );
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
    src.convertTo(src, cv.CV_8U);
    if (inverse) {
      cv.bitwise_not(src, src);
    }
    cv.resize(src, src, new cv.Size(0, 0), zoomFactor, zoomFactor);
    cv.threshold(src, src, binaryThreshold, 255, cv.THRESH_BINARY);

    const erodeKernel = new cv.Mat.ones(
      new cv.Size(erodeKernelSize, erodeKernelSize),
      cv.CV_8U
    );
    cv.erode(
      src,
      src,
      erodeKernel,
      new cv.Point(-1, -1),
      erodeIterations,
      cv.BORDER_DEFAULT,
      new cv.Scalar()
    );
    erodeKernel.delete();

    const dilateKernel = new cv.Mat.ones(
      new cv.Size(dilateKernelSize, dilateKernelSize),
      cv.CV_8U
    );
    cv.dilate(
      src,
      src,
      dilateKernel,
      new cv.Point(-1, -1),
      dilateIterations,
      cv.BORDER_DEFAULT,
      new cv.Scalar()
    );
    dilateKernel.delete();
    cv.resize(
      src,
      src,
      new cv.Size(0, 0),
      zoom / zoomFactor,
      zoom / zoomFactor
    ); // 缩放到原始大小 * zoom的尺寸
    endTimer();
    return src.clone();
  };
};
