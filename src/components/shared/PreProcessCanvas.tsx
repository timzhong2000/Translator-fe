import { useContext, useRef, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import debounce from "lodash/debounce";

import { configContext } from "@/context/config";
import { openCvContext } from "@/context/opencv";
import { tesseractContext } from "@/context/tesseract";
import { videoContext } from "@/context/videoProcessor";
import { putImageData } from "@/utils/filter/2dFilter";
import { opencvBackgroundColor, opencvFilter } from "@/utils/opencvFilter";
import { useTranslation } from "react-i18next";

const PreProcessCanvas = () => {
  const { cutArea, filterConfig } = useContext(configContext);
  const { selectedImageData, setBackGroundColor } = useContext(videoContext);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { ready: cvReady, cv } = useContext(openCvContext);
  const { recognize } = useContext(tesseractContext);
  const { t } = useTranslation();

  const applyFilter = useMemo(() => {
    return debounce((selectedImageData?: ImageData) => {
      if (!canvasEl.current || !selectedImageData || !cvReady) return;
      console.time(`[PreProcess Component] runfilter `);
      putImageData(canvasEl.current, selectedImageData);
      const mat = cv.imread(canvasEl.current);
      const backgroundColor = opencvBackgroundColor(cv, mat);
      opencvFilter(
        cv,
        mat,
        filterConfig.binaryThreshold,
        filterConfig.inverse,
        {
          kernelSize: filterConfig.erodeKernelSize,
          iterations: filterConfig.erodeIterations,
        },
        {
          kernelSize: filterConfig.dilateKernelSize,
          iterations: filterConfig.dilateIterations,
        }
      );
      cv.imshow(canvasEl.current, mat);
      mat.delete();
      console.timeEnd(`[PreProcess Component] runfilter `);
      requestAnimationFrame(() => {
        if (canvasEl.current) recognize(canvasEl.current.toDataURL());
        setBackGroundColor(backgroundColor);
      });
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
    return <Box>{t("selectArea.missingSelection")}</Box>;
  }
};

export default PreProcessCanvas;
