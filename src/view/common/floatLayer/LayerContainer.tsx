import { Component } from "@/model";
import { useState, useMemo } from "react";
import { layerContext } from "./context";
import { createLayer } from "./createLayer";
import { LayerHub } from "./LayerHub";
import {
  FloatLayerContainerProps,
  FloatLayerMeta,
  MapType,
  Style,
} from "./types";
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
    <layerContext.Provider value={{ updateActiveLayer, updateLayerStyle }}>
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
    </layerContext.Provider>
  );
};
