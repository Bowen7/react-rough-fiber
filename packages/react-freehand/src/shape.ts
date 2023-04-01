import rough from 'roughjs/bin/rough';
import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_LINE_TAG,
  SVG_RECT_TAG,
  SVG_ELLIPSE_TAG,
  SVG_POLYGON_TAG,
  SVG_SHAPE_PROPS,
  SVG_NAMESPACE,
  FILL_PATTERN_ID,
} from './constants';
import { SVGShapeProps, PathInfo, InstanceWithListeners } from './types';
import { shallowEqual } from './utils';
import { diffNormalizedProps, normalizeProps } from './props';
type RoughConfig = Parameters<
  ReturnType<(typeof rough)['generator']>['path']
>[1];
type Drawable = ReturnType<ReturnType<(typeof rough)['generator']>['path']>;
type OpSets = Drawable['sets'];
type Generator = ReturnType<(typeof rough)['generator']>;

const getDrawable = (
  generator: Generator,
  type: string,
  props: SVGShapeProps
): Drawable | null => {
  switch (type) {
    case SVG_PATH_TAG: {
      const { d, fill } = props;
      if (!d) {
        return null;
      }
      return generator.path(d, {
        fill,
      });
    }
    case SVG_CIRCLE_TAG: {
      const { cx, cy, r, fill } = props;
      return generator.circle(+cx!, +cy!, +r!, {
        fill,
      });
    }
    case SVG_LINE_TAG: {
      const { x1, y1, x2, y2 } = props;
      return generator.line(+x1!, +y1!, +x2!, +y2!);
    }
    case SVG_RECT_TAG: {
      const { x, y, width, height, fill } = props;
      return generator.rectangle(+x!, +y!, +width!, +height!, {
        fill,
      });
    }
    case SVG_ELLIPSE_TAG: {
      const { cx, cy, rx, ry, fill } = props;
      return generator.ellipse(+cx!, +cy!, +rx!, +ry!, {
        fill,
      });
    }
    case SVG_POLYGON_TAG: {
      const { points, fill } = props;
      const pts = points!
        .split(' ')
        .map((v) => v.split(',').map((v) => +v)) as [number, number][];
      return generator.polygon(pts, {
        fill,
      });
    }
    default:
      return null;
  }
};

export const diffShape = (
  type: string,
  domElement: SVGElement,
  props: SVGShapeProps
) => {
  props = {
    fill: FILL_PATTERN_ID,
    ...SVG_SHAPE_PROPS[type as keyof typeof SVG_SHAPE_PROPS],
    ...props,
  };
  const prevProps = (<any>domElement)._svgProps;
  if (shallowEqual(prevProps, props)) {
    return;
  }

  (<any>domElement)._svgProps = props;
  const generator = rough.generator();
  const drawable = getDrawable(generator, type, props);
  let opSets: OpSets = [];
  let pathInfos: PathInfo[] = [];
  if (drawable) {
    opSets = drawable.sets;
    pathInfos = generator.toPaths(drawable);
  }

  const shouldAppendDefs = opSets.some(
    (opSet) => opSet.type === 'fillSketch' && props.fill === FILL_PATTERN_ID
  );

  const { children } = domElement;
  // a trick set correct fill sketch color
  const firstChild = children[0];
  if (shouldAppendDefs) {
    if (firstChild?.tagName !== 'defs') {
      const defs = domElement.ownerDocument.createElementNS(
        SVG_NAMESPACE,
        'defs'
      );
      defs.innerHTML = `<pattern id="${FILL_PATTERN_ID}" patternUnits="userSpaceOnUse" width="10" height="10"><rect x="0" y="0" width="10" height="10" stroke="none"></rect></pattern>`;
      domElement.insertBefore(defs, firstChild);
    }
  } else {
    if (firstChild?.tagName === 'defs') {
      domElement.removeChild(firstChild);
    }
  }

  const start = shouldAppendDefs ? 1 : 0;
  const end =
    Math.max(pathInfos.length, domElement.children.length - start) + start;
  for (let i = start; i < end; i++) {
    // ii = pathInfo index, i = children index
    const ii = i - start;
    if (ii >= pathInfos.length) {
      domElement.removeChild(domElement.lastElementChild!);
      continue;
    }
    if (i >= children.length) {
      domElement.appendChild(
        domElement.ownerDocument.createElementNS(SVG_NAMESPACE, 'path')
      );
    }
    const child = children[i];
    let pathInfo = normalizeProps('', pathInfos[ii])[0];
    diffNormalizedProps(
      child as InstanceWithListeners,
      (child as any)._pathProps || {},
      pathInfo
    );
    (child as any)._pathProps = pathInfo;
  }
};
