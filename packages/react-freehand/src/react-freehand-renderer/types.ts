export type InstanceProps = {
  [name: string]: unknown;
};
export type Instance = Element;
export type TextInstance = void;
export type UpdatePayload = {
  [name: string]: unknown;
};

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
  updatePayload: UpdatePayload;
  childSet: never;
  timeoutHandle: number | undefined;
  noTimeout: -1;
}
