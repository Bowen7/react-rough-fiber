import { HTMLAttributes, PropsWithChildren } from 'react';

// Not all rough options are supported.
export type RoughOptions = {
  roughness?: number;
  seed?: number;
  bowing?: number;
  fillStyle?:
    | 'hachure'
    | 'solid'
    | 'zigzag'
    | 'cross-hatch'
    | 'dots'
    | 'dashed'
    | 'zigzag-line';
  hachureAngle?: number;
  hachureGap?: number;
  curveStepCount?: number;
  curveFitting?: number;
  disableMultiStroke?: boolean;
  disableMultiStrokeFill?: boolean;
  simplification?: number;
  dashOffset?: number;
  dashGap?: number;
  zigzagOffset?: number;
  preserveVertices?: boolean;
};

export type ReactFreehandProps = PropsWithChildren<
  {
    containerTag?: string;
    roughOptions?: RoughOptions;
    shouldForceUpdateOnRoughOptionsChange?: boolean;
  } & HTMLAttributes<HTMLDivElement>
>;
