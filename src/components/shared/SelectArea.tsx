import React, { useCallback, useContext, useRef } from "react";
import Box from "@mui/material/Box";

import { configContext } from "@/context/config";
import { videoContext } from "@/context/videoProcessor";
import { cutAreaParser } from "@/utils/cutAreaParser";
import { useTranslation } from "react-i18next";

const SelectArea: React.FC = (props) => {
  const { mediaDevicesConfig, cutArea, setCutArea } = useContext(configContext);
  const { stream } = useContext(videoContext);
  const cutAreaEl = useRef<HTMLDivElement>(null);
  const areaConfig = cutAreaParser(cutArea);
  const isResizing = useRef(false);
  const startAbsolutePos = useRef({ x: 0, y: 0 });
  const { t } = useTranslation();

  const onResizeStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing.current === true) return;
      if (e.nativeEvent.target === cutAreaEl.current) return;
      let clientX = 0,
        clientY = 0,
        offsetX = 0,
        offsetY = 0;
      if (e.nativeEvent instanceof MouseEvent) {
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
        onClick={onResizeStart}
      >
        {props.children}
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

      </div>
    );
  } else {
    return <Box>{t("selectArea.waitingStream")}</Box>;
  }
};

export default SelectArea;
