import { RoughGenerator } from 'roughjs/bin/generator';
import { PathInfo } from 'roughjs/bin/core';
import {
  SVG_NAMESPACE,
  FILL_OPACITY_CSS_VARIABLE,
  FILL_CSS_VARIABLE,
} from './constants';
import {
  SVGShapeProps,
  InstanceWithListeners,
  RoughOptions,
  Options,
  InstanceProps,
} from './types';
import { shallowEqual, parsePoints } from './utils';
import { diffNormalizedProps } from './props';

type Drawable = ReturnType<RoughGenerator['path']>;

const getDrawable = (
  generator: RoughGenerator,
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
        fill,
        stroke,
        ...options,
      });
    }
    case 'circle': {
      const { cx, cy, r, fill, stroke } = props;
      return generator.circle(cx, cy, r * 2, {
        fill,
        stroke,
        ...options,
      });
    }
    case 'line': {
      const { x1, y1, x2, y2, stroke } = props;
      return generator.line(x1, y1, x2, y2, {
        stroke,
        ...options,
      });
    }
    case 'rect': {
      const { x, y, width, height, fill, stroke } = props;
      return generator.rectangle(x, y, width, height, {
        fill,
        stroke,
        ...options,
      });
    }
    case 'ellipse': {
      const { cx, cy, rx, ry, fill, stroke } = props;
      return generator.ellipse(cx, cy, rx * 2, ry * 2, {
        fill,
        stroke,
        ...options,
      });
    }
    case 'polygon': {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points);
      return generator.polygon(pts, {
        fill,
        stroke,
        ...options,
      });
    }
    case 'polyline': {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points);
      return generator.linearPath(pts, {
        fill,
        stroke,
        ...options,
      });
    }
    default:
      return null;
  }
};

const getRoughOptions = (
  options: Options,
  shapeProps: SVGShapeProps,
  props: InstanceProps
): RoughOptions => {
  if (typeof options === 'function') {
    const { stroke, fill, fillOpacity, ...shape } = shapeProps;
    return options(shape, props);
  }
  return options;
};

const normalizePathInfo = (
  pathInfo: PathInfo,
  shapeProps: SVGShapeProps,
  options: RoughOptions
) => {
  const { type, strokeWidth, fill, ...rest } = pathInfo;
  const pathProps: InstanceProps = rest;
  if (type === 'fillSketch') {
    const { fillOpacity } = shapeProps;
    pathProps['stroke-opacity'] = fillOpacity
      ? fillOpacity
      : `var(${FILL_OPACITY_CSS_VARIABLE})`;
    pathProps['stroke-width'] = strokeWidth;
    pathProps['fill'] = fill;
  } else {
    if (type === 'path') {
      const { strokeLineDash, strokeLineDashOffset } = options;
      if (strokeLineDash) {
        pathProps['stroke-dasharray'] = strokeLineDash.join(' ');
      }
      if (strokeLineDashOffset) {
        pathProps['stroke-dashoffset'] = strokeLineDashOffset;
      }
    }
    if (fill !== `var(${FILL_CSS_VARIABLE})`) {
      pathProps['fill'] = fill;
    }
  }
  return pathProps;
};

export const diffShape = (
  domElement: SVGElement,
  prevShapeProps: SVGShapeProps | null,
  nextShapeProps: SVGShapeProps,
  props: InstanceProps,
  options: Options
) => {
  const roughOptions = getRoughOptions(options, nextShapeProps, props);
  const prevRoughOptions = (<any>domElement)._rrf_options;
  if (
    shallowEqual(prevShapeProps, nextShapeProps) &&
    shallowEqual(prevRoughOptions, roughOptions)
  ) {
    return;
  }
  (<any>domElement)._rrf_options = roughOptions;
  const generator = new RoughGenerator();
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
    const pathProps = normalizePathInfo(
      pathInfos[i],
      nextShapeProps,
      roughOptions
    );
    diffNormalizedProps(
      child as InstanceWithListeners,
      (child as any)._pathProps || {},
      pathProps
    );
    (child as any)._pathProps = pathProps;
  }
};
