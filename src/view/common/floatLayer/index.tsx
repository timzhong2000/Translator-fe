import { useDrag } from "@use-gesture/react";
import { createContext, FC, memo, useContext, useMemo, useState } from "react";
import { Component } from "../../../model/connector";
import { FloatLayerMeta, FloatLayerContainerProps, Style } from "./types";
import "./style.css";

const defaultProps: FloatLayerContainerProps & { isActive: boolean } = {
  zIndex: 0,
  height: 300,
  width: 300,
  top: 10,
  left: 10,
  minimized: false,
  closed: false,
  isActive: false,
};

const createLayer = (meta: FloatLayerMeta) => {
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
      const { updateActiveLayer, updateLayerStyle } = useContext(context);
      const bind = useDrag((ev: any) => {
        updateLayerStyle(meta.id, { left: ev.offset[0], top: ev.offset[1] });
      });
      const [isTinyMode, setIsTinyMode] = useState(false);
      const shouldShowPoint = isActive && !isTinyMode && resizable;
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
          {shouldShowPoint && (
            <span
              className="point left"
              onClick={() => console.log("click")}
            ></span>
          )}
          {shouldShowPoint && <span className="point left-top"></span>}
          {shouldShowPoint && <span className="point top"></span>}
          {shouldShowPoint && <span className="point right-top"></span>}
          {shouldShowPoint && <span className="point right"></span>}
          {shouldShowPoint && <span className="point right-bottom"></span>}
          {shouldShowPoint && <span className="point bottom"></span>}
          {shouldShowPoint && <span className="point left-bottom"></span>}
          <div
            className={`toolbar ${isTinyMode ? "tiny" : ""}`}
            {...(isActive ? bind() : undefined)}
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
            <span>{meta.id}</span>
          </div>
          <div className="component-container" style={{ height: height - 16 }}>
            {<MemoComponent />}
          </div>
        </div>
      );
    }
  );
};

interface FloatLayerContext {
  updateActiveLayer: (id: string) => void;
  updateLayerStyle: (id: string, newStyle: Partial<Style>) => void;
}

const context = createContext({} as FloatLayerContext);

type MapType = {
  [key: string]: FloatLayerContainerProps & { isActive: boolean };
};

const LayerHub: FC<{ layerMetas: FloatLayerMeta[]; styleMap: MapType }> = ({
  layerMetas,
  styleMap,
}) => {
  const { updateActiveLayer, updateLayerStyle } = useContext(context);
  return (
    <div className="hub">
      {layerMetas.map((meta) => {
        const { isActive, minimized, closed } = styleMap[meta.id];
        return (
          <span
            key={meta.id}
            style={{
              margin: "0 2px",
              userSelect: "none",
              width: "50px",
              height: "20px",
              fontSize: "20px",
              background: closed ? "green" : minimized ? "orange" : "red",
            }}
            onClick={() => {
              if (isActive && !minimized && !closed) {
                updateLayerStyle(meta.id, { minimized: true });
              } else {
                updateActiveLayer(meta.id);
                updateLayerStyle(meta.id, { closed: false, minimized: false });
              }
            }}
          >
            {meta.id}
          </span>
        );
      })}
    </div>
  );
};

export const FloatLayerGroupContainer: Component<{
  layerMetas: FloatLayerMeta[];
}> = ({ layerMetas }) => {
  const [styleMap, _setStyleMap] = useState<MapType>(() =>
    layerMetas.reduce((prev, curr, index) => {
      prev[curr.id] = defaultProps;
      if (curr.alwaysBottom) {
        prev[curr.id].zIndex = -1;
      } else if (curr.alwaysTop) {
        prev[curr.id].zIndex = 2147483647;
      } else {
        prev[curr.id].zIndex = index;
      }
      return { ...prev };
    }, {} as MapType)
  );

  const setStyleMap = (map: MapType) => {
    requestAnimationFrame(() => {
      _setStyleMap(map);
    });
  };

  const updateActiveLayer = (id: string) => {
    const newStyleMap = {} as MapType;
    const style = styleMap[id];
    if (style) {
      Object.keys(styleMap).forEach((key) => {
        newStyleMap[key] = {
          ...styleMap[key],
          isActive: false,
          zIndex: styleMap[key].zIndex - 1,
        };
      });
      newStyleMap[id].zIndex = layerMetas.length;
      newStyleMap[id].isActive = true;
      _setStyleMap(newStyleMap);
    }
  };

  const updateLayerStyle = (id: string, newStyle: Partial<Style>) => {
    styleMap[id] = {
      ...styleMap[id],
      ...newStyle,
    };
    setStyleMap({ ...styleMap });
  };

  const layerComponentList = useMemo(
    () => layerMetas.map((meta) => ({ Layer: createLayer(meta), meta })),
    [...layerMetas]
  );

  return (
    <context.Provider value={{ updateActiveLayer, updateLayerStyle }}>
      <div style={{ position: "relative" }}>
        {layerComponentList.map(({ Layer, meta }) => (
          <Layer
            key={meta.id}
            {...meta}
            {...(styleMap[meta.id] ?? defaultProps)}
          />
        ))}
        <LayerHub layerMetas={layerMetas} styleMap={styleMap} />
      </div>
    </context.Provider>
  );
};
