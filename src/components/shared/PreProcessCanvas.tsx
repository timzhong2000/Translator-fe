import {
  useContext,
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import debounce from "lodash/debounce";

import { configContext } from "@/context/config";
import { openCvContext } from "@/context/opencv";
import { selectedImageContext } from "@/context/video";
import { putImageData } from "@/utils/filter/2dFilter";
import { opencvFilter } from "@/utils/opencvFilter";
import { useTranslation } from "react-i18next";
import { OcrImage } from "@/utils/OcrClient";
import { ocrContext } from "@/context/ocrContext";

const PreProcessCanvas = () => {
  const { cutArea, filterConfig } = useContext(configContext);
  const selectedImageData = useContext(selectedImageContext);
  const { ready: cvReady, cv } = useContext(openCvContext);
  const { recongnize } = useContext(ocrContext);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  const applyFilter = useCallback(
    debounce(async (selectedImageData?: ImageData) => {
      if (!canvasEl.current || !selectedImageData || !cvReady) return;
      putImageData(canvasEl.current, selectedImageData);
      const mat = cv.imread(canvasEl.current);
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
      recongnize(await OcrImage.canvasToBlob(canvasEl.current));
    }, cutArea.interval / 5),
    [filterConfig]
  );

  useEffect(
    () => void requestAnimationFrame(() => applyFilter(selectedImageData)),
    [selectedImageData, cutArea]
  );

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
