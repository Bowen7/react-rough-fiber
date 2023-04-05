import { PropsWithChildren, HTMLAttributes } from 'react';
export type InstanceProps = {
  [name: string]: any;
};
export type Instance = HTMLElement | SVGElement;
export type TextInstance = void;

export type HostContext = { namespace: string; props: InstanceProps };

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
  updatePayload: {};
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

export type PathInfo = {
  d: string;
  stroke: string;
  strokeWidth: number;
  fill?: string;
};

export type RoughOptions = {
  roughness?: number;
  bowing?: number;
  seed?: number;
  fillStyle?:
    | 'hachure'
    | 'solid'
    | 'zigzag'
    | 'cross-hatch'
    | 'dots'
    | 'dashed'
    | 'zigzag-line';
  fillWeight?: number;
  hachureAngle?: number;
  hachureGap?: number;
  curveStepCount?: number;
  curveFitting?: number;
  fillLineDash?: number[];
  fillLineDashOffset?: number;
  disableMultiStroke?: boolean;
  disableMultiStrokeFill?: boolean;
  simplification?: number;
  dashOffset?: number;
  dashGap?: number;
  zigzagOffset?: number;
  preserveVertices?: boolean;
};

export type RoughSVGProps = PropsWithChildren<
  {
    containerType?: string;
    roughOptions?: RoughOptions;
  } & HTMLAttributes<HTMLOrSVGElement>
>;
