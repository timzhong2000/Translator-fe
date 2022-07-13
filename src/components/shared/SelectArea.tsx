import React, { useCallback, useContext, useRef, useState } from "react";
import Box from "@mui/material/Box";

import { configContext } from "@/context/config";
import { videoContext } from "@/context/video";
import { cutAreaParser } from "@/utils/cutAreaParser";
import { useTranslation } from "react-i18next";
import PreProcessCanvas from "./PreProcessCanvas";
import { useEffect } from "react";

const defaultOpacity = 0.3;

const SelectArea: React.FC = (props) => {
  const { mediaDevicesConfig, cutArea, setCutArea, filterConfig } =
    useContext(configContext);
  const { stream } = useContext(videoContext);
  const cutAreaEl = useRef<HTMLDivElement>(null);
  const areaConfig = cutAreaParser(cutArea);
  const [isResizing, setIsResizing] = useState(false);
  const [opacity, setOpacity] = useState(defaultOpacity);
  const startAbsolutePos = useRef({ x: 0, y: 0 });
  const { t } = useTranslation();

  const onResizeStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing === true) return;
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
      setIsResizing(true);
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
    [isResizing]
  );

  const onResize = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing) {
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
          setCutArea({
            ...cutArea,
            x2: cutArea.x1 + (clientX - startAbsolutePos.current.x),
            y2: cutArea.y1 + (clientY - startAbsolutePos.current.y),
          });
        });
      }
    },
    [cutArea, isResizing]
  );

  const onResizeEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing == false) return;
      setIsResizing(false);
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
    [cutArea, isResizing]
  );

  useEffect(() => {
    setOpacity(1);
    const timeout = setTimeout(() => setOpacity(defaultOpacity), 8000);
    return () => clearTimeout(timeout);
  }, [filterConfig, isResizing]);

  if (stream && stream?.getTracks().length > 0) {
    return (
      <div
        id={String(Math.random())}
        style={{
          position: "relative",
          width: mediaDevicesConfig.video.width,
          height: mediaDevicesConfig.video.height,
          cursor: "crosshair"
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
            borderStyle: isResizing || opacity === 1 ? "solid" : "none",
            borderColor: "red",
            borderWidth: "2px",
            top: areaConfig.startY,
            left: areaConfig.startX,
            overflow: "visible",
            cursor: "not-allowed"
          }}
          onDoubleClick={onResizeEnd}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ opacity: opacity }}>
            {isResizing ? null : <PreProcessCanvas />}
          </div>
        </div>
      </div>
    );
  } else {
    return <Box>{t("selectArea.waitingStream")}</Box>;
  }
};

export default SelectArea;
