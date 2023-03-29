import rough from 'roughjs';
import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_LINE_TAG,
  SVG_RECT_TAG,
  SVG_ELLIPSE_TAG,
  SVG_POLYGON_TAG,
  SVG_SHAPE_PROPS,
  SVG_NAMESPACE,
} from './constants';
import { SVGShapeProps, PathInfo, InstanceWithListeners } from './types';
import { shallowEqual } from './utils';
import { diffNormalizedProps } from './props';
type RoughConfig = Parameters<
  ReturnType<(typeof rough)['generator']>['path']
>[1];
type Drawable = ReturnType<ReturnType<(typeof rough)['generator']>['path']>;
type OpSets = Drawable['sets'];

export const diffShape = (
  type: string,
  domElement: SVGElement,
  props: SVGShapeProps
) => {
  props = {
    ...SVG_SHAPE_PROPS[type as keyof typeof SVG_SHAPE_PROPS],
    ...props,
  };
  const prevProps = (<any>domElement)._svgProps;
  if (shallowEqual(prevProps, props)) {
    return;
  }

  (<any>domElement)._svgProps = props;
  const generator = rough.generator();
  let drawable: Drawable | null = null;
  switch (type) {
    case SVG_PATH_TAG: {
      const { d, fill } = props;
      if (!d) {
        break;
      }
      drawable = generator.path(d, {
        fill,
      });
      break;
    }
    case SVG_CIRCLE_TAG: {
      const { cx, cy, r, fill } = props;
      drawable = generator.circle(+cx!, +cy!, +r!, {
        fill,
      });
      break;
    }
    case SVG_LINE_TAG: {
      const { x1, y1, x2, y2 } = props;
      drawable = generator.line(+x1!, +y1!, +x2!, +y2!);
      break;
    }
    case SVG_RECT_TAG: {
      const { x, y, width, height, fill } = props;
      drawable = generator.rectangle(+x!, +y!, +width!, +height!, {
        fill,
      });
      break;
    }
    case SVG_ELLIPSE_TAG: {
      const { cx, cy, rx, ry, fill } = props;
      drawable = generator.ellipse(+cx!, +cy!, +rx!, +ry!, {
        fill,
      });
      break;
    }
    case SVG_POLYGON_TAG: {
      const { points, fill } = props;
      const pts = points!
        .split(' ')
        .map((v) => v.split(',').map((v) => +v)) as [number, number][];
      drawable = generator.polygon(pts, {
        fill,
      });
      break;
    }
    default:
      break;
  }
  let opSets: OpSets = [];
  let pathInfos: PathInfo[] = [];
  if (drawable) {
    opSets = drawable.sets;
    pathInfos = generator.toPaths(drawable);
  }
  const { children } = domElement;
  const end = Math.max(pathInfos.length, domElement.children.length);
  for (let i = 0; i < end; i++) {
    if (i >= pathInfos.length) {
      domElement.removeChild(children[pathInfos.length]);
      continue;
    }
    if (i >= children.length) {
      domElement.appendChild(
        domElement.ownerDocument.createElementNS(SVG_NAMESPACE, 'path')
      );
    }
    const child = children[i];
    // TODO: handle different op type
    const opType = opSets[i].type;
    diffNormalizedProps(
      child as InstanceWithListeners,
      (child as any)._pathProps || {},
      pathInfos[i],
      true
    );
    (child as any)._pathProps = pathInfos[i];
  }
};
