import { CutArea } from "@/types/globalConfig";
import { useEffect, useState } from "react";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { logger, LogType } from "@/utils/logger";

// 截取视频帧，转换为ImageData
export const useVideoFream = (
  videoEl: HTMLVideoElement | undefined,
  cutArea: CutArea,
  interval: number
) => {
  const [imageData, setImageData] = useState<ImageData>();

  useEffect(() => {
    const captureInterval = setInterval(() => {
      if (!videoEl) return;
      const endTimer = logger.timing(LogType.CAPTURE_VIDEO_FRAME);
      const areaConfig = cutAreaParser(cutArea);
      const offscreenCanvas = document.createElement("canvas");
      if (areaConfig.width === 0 || areaConfig.height === 0) {
        return;
      }
      offscreenCanvas.width = areaConfig.width;
      offscreenCanvas.height = areaConfig.height;
      const ctx = offscreenCanvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.drawImage(
        videoEl,
        areaConfig.startX,
        areaConfig.startY,
        areaConfig.width,
        areaConfig.height,
        0,
        0,
        areaConfig.width,
        areaConfig.height
      );
      setImageData(ctx.getImageData(0, 0, areaConfig.width, areaConfig.height));
      endTimer();
    }, interval);
    return () => void clearInterval(captureInterval);
  }, [videoEl, cutArea, interval]);

  return { imageData };
};
