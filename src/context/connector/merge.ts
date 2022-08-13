import { FC } from "react";
import { Component, ConnectedPropsType } from "./types";

export function mergeConnector<
  InnerConnector extends (
    component: Component<PT & ConnectedPropsType<InnerConnector>>
  ) => React.MemoExoticComponent<FC<PT>>,
  OuterConnector extends (
    component: Component<
      PT &
        ConnectedPropsType<OuterConnector> &
        ConnectedPropsType<InnerConnector>
    >
  ) => React.MemoExoticComponent<FC<PT & ConnectedPropsType<InnerConnector>>>,
  PT = {}
>(innerConnector: OuterConnector, outerConnector: InnerConnector) {
  return function mergedConnector(
    Component: Component<
      PT &
        ConnectedPropsType<OuterConnector> &
        ConnectedPropsType<InnerConnector>
    >
  ) {
    return outerConnector(
      innerConnector(Component) as unknown as FC<
        PT & ConnectedPropsType<InnerConnector>
      >
    );
  };
}
