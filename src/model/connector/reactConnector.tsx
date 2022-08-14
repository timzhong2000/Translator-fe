import {
  Context,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { filter } from "rxjs";
import { ModelBase } from "../base";
import { Component } from "./types";

export function reactConnector<
  ModelType extends ModelBase<EventType>,
  SelectedType,
  PropsType,
  ActionsType,
  EventType
>(
  modelContext: Context<ModelType>,
  mapModelToProps: (model: ModelType) => SelectedType,
  mapPropsToActions: (model: ModelType, props: PropsType) => ActionsType,
  listenEvent: EventType[] | Set<EventType>
) {
  const isEventSet = listenEvent instanceof Set;

  return function connector(
    Component: Component<PropsType & SelectedType & ActionsType>
  ) {
    const MemoComponent = Component as Component<
      PropsType & SelectedType & ActionsType
    >;
    const model = useContext(modelContext);
    const [, reRender] = useState(null);
    const selected = mapModelToProps(model);

    useEffect(() => {
      const subscription = model.eventBus
        .pipe(
          filter((ev) =>
            isEventSet
              ? listenEvent.has(ev)
              : listenEvent.some((listenEv) => listenEv === ev)
          )
        )
        .subscribe(() => reRender(null));
      return () => subscription.unsubscribe();
    }, [reRender]);

    return (props: PropsType & { children?: ReactNode }) => {
      const actions = mapPropsToActions(model, props);
      return (
        <MemoComponent {...selected} {...actions} {...props}>
          {props.children}
        </MemoComponent>
      );
    };
  };
}

export function connect<
  ModelType extends ModelBase<EventType>,
  SelectedType,
  PropsType,
  ActionsType,
  EventType
>(
  modelContext: Context<ModelType>,
  mapModelToProps: (model: ModelType) => SelectedType,
  mapPropsToActions: (model: ModelType, props: PropsType) => ActionsType,
  listenEvent: EventType[] | Set<EventType>
) {
  return function (
    Component: Component<PropsType & SelectedType & ActionsType>
  ) {
    return reactConnector(
      modelContext,
      mapModelToProps,
      mapPropsToActions,
      listenEvent
    )(Component);
  };
}
