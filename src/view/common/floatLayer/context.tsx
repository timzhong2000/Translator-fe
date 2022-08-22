import { createContext } from "react";
import { Style } from "./types";

export interface FloatLayerContext {
  updateActiveLayer: (id: string) => void;
  updateLayerStyle: (id: string, newStyle: Partial<Style>) => void;
}

export const layerContext = createContext({} as FloatLayerContext);
