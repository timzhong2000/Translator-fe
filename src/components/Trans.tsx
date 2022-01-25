import { configContext } from "@/context/config";
import { transContext } from "@/context/videoProcessor";
import { getImageData, putImageData } from "@/utils/2dFilter";
import { openCvContext } from "@/context/opencv";
import { opencvFilter } from "@/utils/opencvFilter";
import { Box, Link } from "@mui/material";
import { debounce } from "lodash";
import { useMemo, useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { SelectArea } from "./SelectArea";
import { FilterSetting } from "./ConfigPanel";
import { tesseractContext } from "@/context/tesseract";

const PreProcessCanvas = () => {
  const { cutArea, filterConfig } =
    useContext(configContext);
  const { selectedImageData } = useContext(transContext);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { ready: cvReady, cv } = useContext(openCvContext);
  const {recognize} = useContext(tesseractContext)
  
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

export const Trans = () => {
  const { selectedImageData } = useContext(transContext);
  const { mediaDevicesConfig } = useContext(configContext);
  const { ready: cvReady } = useContext(openCvContext);
  if (!mediaDevicesConfig.enabled)
    return (
      <div>
        录制未启动，请前往<Link href="/#/setting">设置</Link>开启录制
      </div>
    );
  if (!cvReady) return <div>OpenCV正在加载中...</div>;
  return (
    <div>
      {selectedImageData ? <FilterSetting /> : null}
      <PreProcessCanvas />
      <SelectArea />
    </div>
  );
};
