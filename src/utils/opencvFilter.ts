import { Mat } from "opencv-ts";
import { Opencv } from "../context/opencv";

export const opencvFilter = (
  cv: Opencv,
  src: Mat,
  threshold: number,
  erode = { kernelSize: 3, iterations: 2 }
) => {
  console.time("[opencv] run filter");
  const zoomFactor = Math.min(
    10,
    Math.ceil(1 / ((src.rows * src.cols) / 1000000))
  );
  cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
  src.convertTo(src, cv.CV_8U);
  cv.resize(src, src,  new cv.Size(0, 0), zoomFactor, zoomFactor);
  cv.threshold(src, src, threshold, 255, cv.THRESH_BINARY);

  const erodeKernel = new cv.Mat.ones(new cv.Size(erode.kernelSize, erode.kernelSize), cv.CV_8U)
  cv.erode(
    src,
    src,
    erodeKernel,
    new cv.Point(-1, -1),
    erode.iterations,
    cv.BORDER_DEFAULT,
    new cv.Scalar()
  );
  erodeKernel.delete()
  cv.resize(src, src, new cv.Size(0, 0), 1 / zoomFactor, 1 / zoomFactor );

  console.timeEnd("[opencv] run filter");
};
