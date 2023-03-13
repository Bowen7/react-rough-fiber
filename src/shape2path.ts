import { SVGAttributes } from "react";
import rough from "roughjs";
import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_RECT_TAG,
  SVG_LINE_TAG,
  SVG_ELLIPSE_TAG,
  SVG_POLYGON_TAG,
} from "./constants";

type RoughConfig = Parameters<ReturnType<typeof rough["generator"]>["path"]>[1];
type Drawable = ReturnType<ReturnType<typeof rough["generator"]>["path"]>;

export const shape2path = (
  type: string,
  props: { [name: string]: string },
  config?: RoughConfig
): string => {
  const generator = rough.generator();
  let drawable: Drawable | null = null;
  const { fill } = props;

  switch (type) {
    case SVG_PATH_TAG: {
      const { d = "", fill } = props;
      if (!d) {
        break;
      }
      console.log(d);
      drawable = generator.path(d, {
        fill,
        ...config,
      });
      break;
    }
    case SVG_CIRCLE_TAG: {
      const { cx = 0, cy = 0, r = 0 } = props;
      drawable = generator.circle(+cx, +cy, +r, {
        fill,
        ...config,
      });
      break;
    }
    case SVG_LINE_TAG: {
      const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = props;
      drawable = generator.line(+x1, +y1, +x2, +y2, config);
      break;
    }
    case SVG_RECT_TAG: {
      const { x = 0, y = 0, width = 0, height = 0 } = props;
      drawable = generator.rectangle(+x, +y, +width, +height, {
        fill,
        ...config,
      });
      break;
    }
    case SVG_ELLIPSE_TAG: {
      const { cx = 0, cy = 0, rx = 0, ry = 0 } = props;
      drawable = generator.ellipse(+cx, +cy, +rx, +ry, {
        fill,
        ...config,
      });
      break;
    }
    case SVG_POLYGON_TAG: {
      const { points = "" } = props;
      const pts = points.split(" ").map((v) => v.split(",").map((v) => +v)) as [
        number,
        number
      ][];
      drawable = generator.polygon(pts, {
        fill,
        ...config,
      });
      break;
    }
    default:
      break;
  }
  if (drawable) {
    return drawable.sets.map((set) => generator.opsToPath(set)).join(" ");
  }
  return "";
};
