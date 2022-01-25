import { configContext } from "@/context/config";
import { transContext } from "@/context/videoProcessor";
import { cutAreaParser } from "@/utils/cutAreaParser";
import { Box } from "@mui/material";
import { useCallback, useContext, useEffect, useRef } from "react";
import { TransResult } from "./TransResult";

export const SelectArea: React.FC<{}> = () => {
  const { mediaDevicesConfig, cutArea, setCutArea } = useContext(configContext);
  const { stream, setVideoRef } = useContext(transContext);
  const cutAreaEl = useRef<HTMLDivElement>(null);
  const areaConfig = cutAreaParser(cutArea);
  const isResizing = useRef(false);
  const startAbsolutePos = useRef({ x: 0, y: 0 });
  const videoEl = useRef<HTMLVideoElement>(null);

  useEffect(() => void setVideoRef(videoEl), []); // 转发到context中

  useEffect(() => {
    if (stream) {
      videoEl.current!.srcObject = stream;
    }
  }, [stream]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    if (e.nativeEvent.target == cutAreaEl.current) return;
    isResizing.current = true;
    startAbsolutePos.current = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    };
    setCutArea({
      ...cutArea,
      x1: e.nativeEvent.offsetX,
      y1: e.nativeEvent.offsetY,
      x2: e.nativeEvent.offsetX,
      y2: e.nativeEvent.offsetY,
    });
  }, []);

  const onResize = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing.current) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            setCutArea({
              ...cutArea,
              x2: cutArea.x1 + (e.clientX - startAbsolutePos.current.x),
              y2: cutArea.y1 + (e.clientY - startAbsolutePos.current.y),
            });
          }, 0);
        });
      }
    },
    [cutArea]
  );

  const onResizeEnd = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing.current == false) return;
      isResizing.current = false;
      setCutArea({
        ...cutArea,
        x2: cutArea.x1 + (e.clientX - startAbsolutePos.current.x),
        y2: cutArea.y1 + (e.clientY - startAbsolutePos.current.y),
      });
    },
    [cutArea]
  );

  if (stream && stream?.getTracks().length > 0) {
    return (
      <div
        style={{
          position: "relative",
          width: mediaDevicesConfig.video.width,
          height: mediaDevicesConfig.video.height,
        }}
        onMouseDown={onResizeStart}
        onMouseMove={onResize}
        onMouseUp={onResizeEnd}
      >
        <video
          autoPlay
          muted={!mediaDevicesConfig.audio}
          ref={videoEl}
          style={{
            position: "absolute",
            width: mediaDevicesConfig.video.width,
            height: mediaDevicesConfig.video.height,
          }}
        ></video>
        <div
          ref={cutAreaEl}
          style={{
            position: "absolute",
            width: areaConfig.width,
            height: areaConfig.height,
            borderStyle: "solid",
            borderColor: "red",
            borderWidth: "2px",
            top: areaConfig.startY,
            left: areaConfig.startX,
          }}
        >
          <TransResult />
        </div>
      </div>
    );
  } else {
    return <Box>正在初始化摄像头模块，请稍等</Box>;
  }
};
