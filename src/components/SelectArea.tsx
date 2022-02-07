import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Box } from "@mui/material";

import { TransResult } from "./TransResult";

import { configContext } from "@/context/config";
import { transContext } from "@/context/videoProcessor";
import { cutAreaParser } from "@/utils/cutAreaParser";
import VirtualScreen from "./VirtualScreen";

const SelectArea: React.FC<{}> = () => {
  const { mediaDevicesConfig, cutArea, setCutArea } = useContext(configContext);
  const { stream } = useContext(transContext);
  const cutAreaEl = useRef<HTMLDivElement>(null);
  const areaConfig = cutAreaParser(cutArea);
  const isResizing = useRef(false);
  const startAbsolutePos = useRef({ x: 0, y: 0 });


  const onResizeStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (e.nativeEvent.target == cutAreaEl.current) return;
      let clientX = 0,
        clientY = 0,
        offsetX = 0,
        offsetY = 0;
      if (e.nativeEvent instanceof MouseEvent) {
        console.log(e);

        clientX = e.nativeEvent.clientX;
        clientY = e.nativeEvent.clientY;
        offsetX = e.nativeEvent.offsetX;
        offsetY = e.nativeEvent.offsetY;
      } else if (e instanceof TouchEvent) {
        if (e.nativeEvent.touches.length !== 2) return;
        clientX = e.nativeEvent.touches[0].clientX;
        clientY = e.nativeEvent.touches[0].clientY;
        // offsetX = e.nativeEvent.targetTouches[0].pageX - e.nativeEvent.targetTouches[0].getBoundingClientRect().left;
        // offsetX = e.nativeEvent.targetTouches[0].pageY - e.nativeEvent.targetTouches[0].getBoundingClientRect().top;
      }
      isResizing.current = true;
      startAbsolutePos.current = {
        x: clientX,
        y: clientY,
      };
      setCutArea({
        ...cutArea,
        x1: offsetX,
        y1: offsetY,
        x2: offsetX,
        y2: offsetY,
      });
    },
    []
  );

  const onResize = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing.current) {
        let clientX = 0,
          clientY = 0;
        if (e.nativeEvent instanceof MouseEvent) {
          clientX = e.nativeEvent.clientX;
          clientY = e.nativeEvent.clientY;
        } else if (e instanceof TouchEvent) {
          if (e.nativeEvent.touches.length !== 2) return;
          clientX = e.nativeEvent.touches[0].clientX;
          clientY = e.nativeEvent.touches[0].clientY;
        }
        requestAnimationFrame(() => {
          setTimeout(() => {
            setCutArea({
              ...cutArea,
              x2: cutArea.x1 + (clientX - startAbsolutePos.current.x),
              y2: cutArea.y1 + (clientY - startAbsolutePos.current.y),
            });
          }, 0);
        });
      }
    },
    [cutArea]
  );

  const onResizeEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing.current == false) return;
      isResizing.current = false;
      let clientX = 0,
        clientY = 0;
      if (e.nativeEvent instanceof MouseEvent) {
        clientX = e.nativeEvent.clientX;
        clientY = e.nativeEvent.clientY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        if (e.nativeEvent.touches.length !== 2) return;
        clientX = e.nativeEvent.touches[0].clientX;
        clientY = e.nativeEvent.touches[0].clientY;
      }
      setCutArea({
        ...cutArea,
        x2: cutArea.x1 + (clientX - startAbsolutePos.current.x),
        y2: cutArea.y1 + (clientY - startAbsolutePos.current.y),
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
        onMouseMove={onResize}
        onDoubleClick={onResizeEnd}
      >
        <VirtualScreen
          onClick={onResizeStart}
          onDoubleClick={onResizeEnd}
        />
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
            overflow: "visible",
          }}
          onDoubleClick={onResizeEnd}
        ></div>
        <TransResult />
      </div>
    );
  } else {
    return <Box>正在初始化摄像头模块，请稍等</Box>;
  }
};

export default SelectArea;
