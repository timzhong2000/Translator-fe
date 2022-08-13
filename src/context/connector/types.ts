import { FC, ComponentClass, Context } from "react";

/**
 * usage:
 * ```
 * const connector = createConnector(
 *    reactContext,
 *    (ctx) => ({setVal: ctx.setVal}),
 *    (props, selectedCtx) => ({resetVal: () => setVal(0)})
 * )
 *
 * const ResetButton: ConnectedComponentType<typeof connector> = (props) => {...}
 * ```
 * the props of ResetButton can be infered
 */
export type ConnectedComponentType<T> = T extends (component: infer P) => any
 ? P
 : any;

export type ContextType<T> = T extends Context<infer P> ? P : any;

export type ConnectedPropsType<T> = T extends (
 component: Component<infer P>
) => any
 ? P
 : any;
 
export type SelectorType<CT, ST = any> = (ctx: CT) => ST;

export type ConnectorType<CT, PT, AT> = (ctx: CT, props: PT) => AT;

export type Component<T> = ComponentClass<T> | FC<T>;
