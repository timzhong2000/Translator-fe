import { Component } from "../../../model/connector";

export interface FloatLayerContainerProps extends Style {}

// 基于左上角定位, 单位为px
export interface Style {
  zIndex: number;
  minimized: boolean;
  closed: boolean;
  top: number;
  left: number;
  width: number;
  height: number;
}

export type FloatLayerContainer = Component<FloatLayerContainerProps>;

export interface FloatLayerMeta {
  id: string;
  resizable: boolean;
  alwaysTop: boolean;
  alwaysBottom: boolean;
  dragable: boolean;
  Element: Component<{}>;
}

export type MapType = {
  [key: string]: FloatLayerContainerProps & { isActive: boolean };
};
