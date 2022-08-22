import { FC, useContext } from "react";
import { layerContext } from "./context";
import { FloatLayerMeta, MapType } from "./types";
import "./style.css";

export const LayerHub: FC<{
  layerMetas: FloatLayerMeta[];
  styleMap: MapType;
}> = ({ layerMetas, styleMap }) => {
  const { updateActiveLayer, updateLayerStyle } = useContext(layerContext);
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
