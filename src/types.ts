export type Type = string;

export type Props = { [key: string]: any };

export type Instance = SVGAElement;

export interface Container extends Instance {}

export type TextInstance = string;

export interface SuspenseInstance extends Instance {}

export type HydratableInstance = any;

export type PublicInstance = Instance | TextInstance;

export type ContextItem = any;

export interface Context {
  [key: string]: ContextItem;
}

export type HostContext = Context;

export type UpdatePayload = any;

export type ChildSet = any;

export type TimeoutHandle = any;

export type NoTimeout = any;
