import { roughGenerator } from './rough';
import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_LINE_TAG,
  SVG_RECT_TAG,
  SVG_ELLIPSE_TAG,
  SVG_POLYGON_TAG,
  SVG_POLYLINE_TAG,
  SVG_SHAPE_PROPS,
  FILL_CSS_VARIABLE,
  SVG_NAMESPACE,
} from './constants';
import {
  SVGShapeProps,
  InstanceWithListeners,
  InstanceProps,
  RoughOptions,
} from './types';
import { shallowEqual, parsePoints } from './utils';
import { diffNormalizedProps } from './props';
import { PathInfo } from './rough/core';

type Generator = ReturnType<typeof roughGenerator>;
type Drawable = ReturnType<Generator['path']>;

const getDrawable = (
  generator: Generator,
  type: string,
  props: SVGShapeProps,
  roughOptions: RoughOptions
): Drawable | null => {
  switch (type) {
    case SVG_PATH_TAG: {
      const { d, fill, stroke } = props;
      if (!d) {
        return null;
      }
      return generator.path(d, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    case SVG_CIRCLE_TAG: {
      const { cx, cy, r, fill, stroke } = props;
      return generator.circle(+cx!, +cy!, +r!, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    case SVG_LINE_TAG: {
      const { x1, y1, x2, y2, stroke } = props;
      return generator.line(+x1!, +y1!, +x2!, +y2!, {
        ...roughOptions,
        stroke,
      });
    }
    case SVG_RECT_TAG: {
      const { x, y, width, height, fill, stroke } = props;
      return generator.rectangle(+x!, +y!, +width!, +height!, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    case SVG_ELLIPSE_TAG: {
      const { cx, cy, rx, ry, fill, stroke } = props;
      return generator.ellipse(+cx!, +cy!, +rx!, +ry!, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    case SVG_POLYGON_TAG: {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points!);
      return generator.polygon(pts, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    case SVG_POLYLINE_TAG: {
      const { points, fill, stroke } = props;
      const pts = parsePoints(points!);
      return generator.linearPath(pts, {
        ...roughOptions,
        fill,
        stroke,
      });
    }
    default:
      return null;
  }
};

export const diffShape = (
  type: string,
  domElement: SVGElement,
  props: SVGShapeProps,
  roughOptions: RoughOptions
) => {
  props = {
    fill: `var(${FILL_CSS_VARIABLE})`,
    ...SVG_SHAPE_PROPS[type as keyof typeof SVG_SHAPE_PROPS],
    ...props,
  };
  const prevProps = (<any>domElement)._svgProps;
  const prevRoughOptions = (<any>domElement)._roughOptions;
  if (
    shallowEqual(prevProps, props) &&
    shallowEqual(prevRoughOptions, roughOptions)
  ) {
    return;
  }
  (<any>domElement)._svgProps = props;
  (<any>domElement)._roughOptions = roughOptions;
  const generator = roughGenerator();
  const drawable = getDrawable(generator, type, props, roughOptions);
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
    const pathInfo = pathInfos[i];
    diffNormalizedProps(
      child as InstanceWithListeners,
      (child as any)._pathProps || {},
      pathInfo
    );
    (child as any)._pathProps = pathInfo;
  }
};
