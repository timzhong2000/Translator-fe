import { Mat } from "opencv-ts";
import { Opencv } from "@/context/opencv";

export const opencvBackgroundColor = (cv: Opencv, src: Mat) => {
  const mean = cv.mean(src) as unknown as Array<number>; // todo
  return {
    r: mean[0],
    g: mean[1],
    b: mean[2]
  }
};

export const opencvFilter = (
  cv: Opencv,
  src: Mat,
  threshold: number,
  inverse = false,
  erode = { kernelSize: 3, iterations: 0 },
  dilate = { kernelSize: 3, iterations: 0 },
  zoomNormalization = 2
) => {
  console.time("[opencv] run filter");
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
  cv.threshold(src, src, threshold, 255, cv.THRESH_BINARY);

  const erodeKernel = new cv.Mat.ones(
    new cv.Size(erode.kernelSize, erode.kernelSize),
    cv.CV_8U
  );
  cv.erode(
    src,
    src,
    erodeKernel,
    new cv.Point(-1, -1),
    erode.iterations,
    cv.BORDER_DEFAULT,
    new cv.Scalar()
  );
  erodeKernel.delete();

  const dilateKernel = new cv.Mat.ones(
    new cv.Size(dilate.kernelSize, dilate.kernelSize),
    cv.CV_8U
  );
  cv.dilate(
    src,
    src,
    dilateKernel,
    new cv.Point(-1, -1),
    dilate.iterations,
    cv.BORDER_DEFAULT,
    new cv.Scalar()
  );
  dilateKernel.delete();
  cv.resize(
    src,
    src,
    new cv.Size(0, 0),
    zoomNormalization / zoomFactor,
    zoomNormalization / zoomFactor
  ); // 缩放到原始大小 * zoomNormalization的尺寸
  console.timeEnd("[opencv] run filter");
};
