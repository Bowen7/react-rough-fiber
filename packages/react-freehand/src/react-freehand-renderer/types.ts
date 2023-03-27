export type InstanceProps = {
  [name: string]: unknown;
};
export type Instance = HTMLElement | SVGElement;
export type TextInstance = void;

export type HostContext = string;

export interface HostConfig {
  type: string;
  props: InstanceProps;
  container: Instance;
  instance: Instance;
  textInstance: TextInstance;
  suspenseInstance: Instance;
  hydratableInstance: Instance;
  publicInstance: Instance;
  hostContext: HostContext;
  updatePayload: string;
  childSet: never;
  timeoutHandle: number | undefined;
  noTimeout: -1;
}

export type Style = { [name: string]: string | number };

export type InstanceWithListeners = Instance & {
  _listeners: { [name: string]: (e: Event) => void };
};
