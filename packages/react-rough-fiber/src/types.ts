import { PropsWithChildren, HTMLAttributes } from 'react';
import type { Options as RoughOptions } from './rough/core';

export { RoughOptions };
export type Options = RoughOptions | ((shape: SVGShape) => RoughOptions);

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
  _rrf_listeners: { [name: string]: (e: Event) => void };
};

export type SVGShape =
  | {
      type: 'path';
      d: string;
    }
  | {
      type: 'circle';
      cx: number;
      cy: number;
      r: number;
    }
  | {
      type: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }
  | {
      type: 'rect';
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: 'ellipse';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
    }
  | {
      type: 'polygon';
      points: string;
    }
  | {
      type: 'polyline';
      points: string;
    };
export type SVGShapeType = SVGShape['type'];
export type SVGShapeProps = SVGShape & {
  fill?: string;
  stroke?: string;
};

export type RoughSVGProps = PropsWithChildren<
  {
    containerType?: string;
    options?: Options;
  } & HTMLAttributes<HTMLOrSVGElement>
>;
