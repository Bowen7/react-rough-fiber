import { roughGenerator } from './rough';
import { SVG_NAMESPACE, FILL_OPACITY_CSS_VARIABLE } from './constants';
import {
  SVGShapeProps,
  InstanceWithListeners,
  RoughOptions,
  Options,
  InstanceProps,
} from './types';
import { shallowEqual, parsePoints } from './utils';
import { diffNormalizedProps } from './props';
import { PathInfo } from './rough/core';

type Generator = ReturnType<typeof roughGenerator>;
type Drawable = ReturnType<Generator['path']>;

const getDrawable = (
  generator: Generator,
  props: SVGShapeProps,
  options: RoughOptions
): Drawable | null => {
  switch (props.type) {
    case 'path': {
      const { d, fill, stroke } = props;
      if (!d) {
        return null;
      }
      return generator.path(d, {
        ...options,
        fill,
        stroke,
      });
    }
    case 'circle': {
      const { cx, cy, r, fill, stroke } = props;
      return generator.circle(cx, cy, r, {
        ...options,
        fill,
        stroke,
      });
    }
    case 'line': {
      const { x1, y1, x2, y2, stroke } = props;
      return generator.line(x1, y1, x2, y2, {
        ...options,
        stroke,
      });
    }
    case 'rect': {
      const { x, y, width, height, fill, stroke } = props;
      return generator.rectangle(x, y, width, height, {
        ...options,
        fill,
        stroke,
      });
    }
    case 'ellipse': {
      const { cx, cy, rx, ry, fill, stroke } = props;
      return generator.ellipse(cx, cy, rx, ry, {
        ...options,
        fill,
        stroke,
      });
    }
    case 'polygon': {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points);
      return generator.polygon(pts, {
        ...options,
        fill,
        stroke,
      });
    }
    case 'polyline': {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points);
      return generator.linearPath(pts, {
        ...options,
        fill,
        stroke,
      });
    }
    default:
      return null;
  }
};

const getRoughOptions = (
  options: Options,
  shapeProps: SVGShapeProps
): RoughOptions => {
  if (typeof options === 'function') {
    const { stroke, fill, fillOpacity, ...shape } = shapeProps;
    return options(shape);
  }
  return options;
};

const normalizePathInfo = (pathInfo: PathInfo, shapeProps: SVGShapeProps) => {
  const { type, strokeWidth, ...rest } = pathInfo;
  const pathProps: InstanceProps = rest;
  if (type === 'fillSketch') {
    const { fillOpacity } = shapeProps;
    pathProps['fill-opacity'] = fillOpacity
      ? fillOpacity
      : `var(${FILL_OPACITY_CSS_VARIABLE})`;
    pathProps['stroke-width'] = strokeWidth;
  }
  return pathProps;
};

export const diffShape = (
  domElement: SVGElement,
  prevShapeProps: SVGShapeProps | null,
  nextShapeProps: SVGShapeProps,
  options: Options
) => {
  const roughOptions = getRoughOptions(options, nextShapeProps);
  const prevRoughOptions = (<any>domElement)._rrf_options;
  if (
    shallowEqual(prevShapeProps, nextShapeProps) &&
    shallowEqual(prevRoughOptions, options)
  ) {
    return;
  }
  (<any>domElement)._rrf_options = roughOptions;
  const generator = roughGenerator();
  const drawable = getDrawable(generator, nextShapeProps, roughOptions);
  let pathInfos: PathInfo[] = [];
  if (drawable) {
    pathInfos = generator
      .toPaths(drawable)
      .filter(({ fill, stroke }) => fill !== 'none' || stroke !== 'none');
  }

  const { children } = domElement;

  const end = Math.max(pathInfos.length, domElement.children.length);
  for (let i = 0; i < end; i++) {
    if (i >= pathInfos.length) {
      domElement.removeChild(domElement.lastElementChild!);
      continue;
    }
    if (i >= children.length) {
      domElement.appendChild(
        domElement.ownerDocument.createElementNS(SVG_NAMESPACE, 'path')
      );
    }
    const child = children[i];
    const pathProps = normalizePathInfo(pathInfos[i], nextShapeProps);
    diffNormalizedProps(
      child as InstanceWithListeners,
      (child as any)._pathProps || {},
      pathProps
    );
    (child as any)._pathProps = pathProps;
  }
};
