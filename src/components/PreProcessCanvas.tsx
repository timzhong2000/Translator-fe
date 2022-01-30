import { useContext, useRef, useMemo, useEffect } from "react";
import { Box } from "@mui/material";
import { debounce } from "lodash";

import { configContext } from "@/context/config";
import { openCvContext } from "@/context/opencv";
import { tesseractContext } from "@/context/tesseract";
import { transContext } from "@/context/videoProcessor";
import { putImageData } from "@/utils/2dFilter";
import { opencvFilter } from "@/utils/opencvFilter";

const PreProcessCanvas = () => {
  const { cutArea, filterConfig } = useContext(configContext);
  const { selectedImageData } = useContext(transContext);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { ready: cvReady, cv } = useContext(openCvContext);
  const { recognize } = useContext(tesseractContext);

  const applyFilter = useMemo(() => {
    return debounce((selectedImageData?: ImageData) => {
      if (!canvasEl.current || !selectedImageData || !cvReady) return;
      console.time(`[PreProcess Component] runfilter `);
      putImageData(canvasEl.current, selectedImageData);
      const mat = cv.imread(canvasEl.current);
      opencvFilter(cv, mat, filterConfig.binaryThreshold, {
        kernelSize: filterConfig.erodeKernelSize,
        iterations: filterConfig.erodeIterations,
      });
      cv.imshow(canvasEl.current, mat);
      mat.delete();
      console.timeEnd(`[PreProcess Component] runfilter `);
      recognize(canvasEl.current.toDataURL());
    }, cutArea.interval / 5);
  }, [filterConfig]);

  useEffect(() => {
    requestAnimationFrame(() => applyFilter(selectedImageData));
  }, [selectedImageData, cutArea]);

  if (selectedImageData) {
    return (
      <canvas
        ref={canvasEl}
        style={{
          width: selectedImageData.width,
          height: selectedImageData.height,
        }}
      ></canvas>
    );
  } else {
    return <Box>请先进行选区</Box>;
  }
};

export default PreProcessCanvas