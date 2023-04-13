import { PropsWithChildren, HTMLAttributes } from 'react';
import type { Options as RoughOptions } from './rough/core';

export { RoughOptions };
export type InstanceProps = {
  [name: string]: any;
};
export type Instance = HTMLElement | SVGElement;
export type TextInstance = void;

export type HostContext = { namespace: string; inDefs: boolean };

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
  updatePayload: { inDefs: boolean };
  childSet: never;
  timeoutHandle: number | undefined;
  noTimeout: -1;
}

export type Style = { [name: string]: string | number };

export type InstanceWithListeners = Instance & {
  _listeners: { [name: string]: (e: Event) => void };
};

export type SVGShapeProps = {
  fill?: string;
  stroke?: string;
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  points?: string;
};

export type RoughSVGProps = PropsWithChildren<
  {
    containerType?: string;
    roughOptions?: RoughOptions;
  } & HTMLAttributes<HTMLOrSVGElement>
>;
