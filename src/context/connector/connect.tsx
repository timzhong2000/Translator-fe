import { useContext, memo, FC, Context, useMemo, ReactNode } from "react";
import { SelectorType, ConnectorType, Component } from "./types";

/**
 * CT: type of context
 * PT: type of parent props
 * ST: type of selected context
 * AT: type of actions
 */
export function createConnector<
  PT,
  ST extends Object,
  CT extends ST,
  AT extends Object
>(
  context: Context<CT>,
  mapContextToProps: SelectorType<CT, ST>,
  mapPropsToAction: ConnectorType<CT, PT, AT> = () => ({} as AT)
) {
  return function (Component: Component<PT & ST & AT>) {
    Component = memo(Component) as unknown as Component<PT & ST & AT>;
    const Selector: Component<PT> = (props: PT) => {
      const ctx = useContext(context);
      const selected = mapContextToProps(ctx);
      const actions = useMemo(
        () => mapPropsToAction(ctx, props),
        [(ctx as any).reset]
      ); // 只有selected变化才更新

      return <Component {...props} {...selected} {...actions} />;
    };
    return memo(((props: PT & { children?: ReactNode }) => {
      return <Selector {...props} />;
    }) as FC<PT>);
  };
}
