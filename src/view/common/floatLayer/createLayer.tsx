import { memo, useContext, useState } from "react";
import { layerContext } from "./context";
import { LayerResizer } from "./LayerResizer";
import { FloatLayerMeta, FloatLayerContainerProps } from "./types";
import "./style.css";

export const createLayer = (meta: FloatLayerMeta) => {
  const MemoComponent = memo(meta.Element);
  return memo(
    (
      props: FloatLayerMeta & FloatLayerContainerProps & { isActive: boolean }
    ) => {
      const {
        left,
        top,
        height,
        width,
        zIndex,
        isActive,
        closed,
        minimized,
        resizable,
      } = props;
      const { updateActiveLayer, updateLayerStyle } = useContext(layerContext);

      const [isTinyMode, setIsTinyMode] = useState(false);
      const [isResizeMode, setIsResizeMode] = useState(false);
      const shouldShowLayerResizer = isResizeMode && isActive;
      const shouldShowResizerPoint =
        shouldShowLayerResizer && resizable && !isTinyMode;
      const border = isTinyMode
        ? "none"
        : isActive
        ? "solid #1976d2 1px"
        : "solid gray 1px";

      return closed ? (
        <></>
      ) : (
        <div
          className="layer"
          style={{
            display: minimized ? "none" : "block",
            top,
            left: left,
            height: height,
            width,
            zIndex,
            border,
          }}
          {...(isActive
            ? {}
            : { onMouseDown: () => updateActiveLayer(meta.id) })}
        >
          <div
            className={`toolbar ${isTinyMode ? "tiny" : ""}`}
            onDoubleClick={() => setIsResizeMode(true)}
          >
            <button
              className="toolbar-item"
              onClick={() => updateLayerStyle(meta.id, { closed: true })}
            >
              x
            </button>
            <button
              className="toolbar-item"
              onClick={() => updateLayerStyle(meta.id, { minimized: true })}
            >
              -
            </button>
            <button
              className="toolbar-item"
              onClick={() => setIsTinyMode(!isTinyMode)}
            >
              o
            </button>
            <button
              className="toolbar-item"
              onClick={() => setIsResizeMode(true)}
            >
              r
            </button>
            <span>{meta.id}</span>
          </div>
          <div className="component-container" style={{ height: height - 16 }}>
            {<MemoComponent />}
          </div>
          {shouldShowLayerResizer && (
            <LayerResizer
              shouldShowResizerPoint={shouldShowResizerPoint}
              area={{ left, top, width, height }}
              onResizeEnd={(area) => {
                updateLayerStyle(meta.id, area);
                setIsResizeMode(false);
              }}
            />
          )}
        </div>
      );
    }
  );
};
