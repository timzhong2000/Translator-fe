import React, { useRef, useState } from "react";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { storeContext } from "@/context/store";
import { areaToStyle } from "@/utils/common/cutAreaParser";
import { useTranslation } from "react-i18next";
import PreProcessCanvas from "./PreProcessCanvas";
import { useIsDataChange } from "../../utils/hooks/useIsDataChange";
import { ConnectedComponentType, createConnector } from "@/context/connector";
import { useStreamModel } from "@/context/hook";
import { StreamModelEvent } from "@/model";
import { TtransError } from "@/utils/error";
import { Button, Tooltip, Box } from "@mui/material";
import { FullScreen } from "@/utils/common/FullScreen";

const defaultOpacity = 0.3;

const connector = createConnector(
  storeContext,
  ({ cutArea, filterConfig }) => ({ cutArea, filterConfig }),
  ({ setCutArea }) => ({ setCutArea })
);

const OcrPlayer: ConnectedComponentType<typeof connector> = (props) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const { cutArea, filterConfig, setCutArea } = props;
  const streamModel = useStreamModel([
    StreamModelEvent.ON_STREAM_CHANGED,
    StreamModelEvent.ON_RESOLUTION_CHANGED,
  ]);
  const { t } = useTranslation();
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isResizeingChanged = useIsDataChange(3000)(isResizing);
  const filterConfigChanged = useIsDataChange(6000)(filterConfig);
  const startAbsolutePos = useRef({ x: 0, y: 0 });
  const cutAreaEl = useRef<HTMLDivElement>(null);
  const shouldShowBorder =
    isResizing || isResizeingChanged || filterConfigChanged;
  /* preview 模式下，预处理结果完全不透明显示在页面上，非preview模式下，预处理结果变透明*/
  const isPreviewMode = isResizeingChanged || filterConfigChanged;

  const requestFullscreen: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsFullScreen(true);
    e.stopPropagation();
  };
  try {
    const { resolution } = streamModel; // 调用stream getter检查流状态，如果异常会抛出对应错误
    const onResizeStart = (e: React.TouchEvent | React.MouseEvent) => {
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
    };

    const onResize = (e: React.TouchEvent | React.MouseEvent) => {
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
    };

    const onResizeEnd = (e: React.TouchEvent | React.MouseEvent) => {
      if (isResizing == false) return;
      let clientX = 0,
        clientY = 0;
      if (e.nativeEvent instanceof MouseEvent) {
        clientX = e.nativeEvent.clientX;
        clientY = e.nativeEvent.clientY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        clientX = e.nativeEvent.touches[0].clientX;
        clientY = e.nativeEvent.touches[0].clientY;
      }
      setIsResizing(false);
      setCutArea({
        ...cutArea,
        x2: cutArea.x1 + (clientX - startAbsolutePos.current.x),
        y2: cutArea.y1 + (clientY - startAbsolutePos.current.y),
      });
    };

    return (
      <FullScreen
        fullScreen={isFullScreen}
        onFullScreenChange={(isFullScreen) => setIsFullScreen(isFullScreen)}
      >
        <div
          ref={containerEl}
          id={String(Math.random())}
          className="ocr-player"
          style={{
            position: "relative",
            width: resolution.x,
            height: resolution.y,
            cursor: "crosshair",
          }}
          onMouseMove={isResizing ? onResize : undefined}
          onDoubleClick={onResizeEnd}
          onClick={onResizeStart}
        >
          {props.children}
          <div
            ref={cutAreaEl}
            className="cut-area"
            style={{
              position: "absolute",
              ...areaToStyle(cutArea),
              borderStyle: shouldShowBorder ? "solid" : "none",
              borderColor: "red",
              borderWidth: "2px",
              cursor: "not-allowed",
              opacity: isPreviewMode ? 1 : defaultOpacity,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isResizing && <PreProcessCanvas />}
          </div>
          {!isFullScreen && (
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Button onClick={requestFullscreen}>
                <Tooltip title={t("common.fullscreen") as string}>
                  <FullscreenIcon
                    sx={{ padding: 0 }}
                    fontSize="large"
                    color="info"
                  />
                </Tooltip>
              </Button>
            </div>
          )}
        </div>
      </FullScreen>
    );
  } catch (err) {
    if (err instanceof TtransError) {
      return <Box>{t(err.key)}</Box>;
    }
    return <Box>{t("unknown.error")}</Box>;
  }
};

export default connector(OcrPlayer);
