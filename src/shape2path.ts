import rough from "roughjs";
import { SVG_PATH_TAG, SVG_CIRCLE_TAG } from "./constants";

type RoughConfig = Parameters<typeof rough["generator"]>[0];

export const path2path = (d: string) => {
  if (!d) {
    return "";
  }
  const generator = rough.generator();
  const sets = generator.path(d, {
    // disableMultiStroke: true,
    // disableMultiStrokeFill: true,
    // preserveVertices: true,
    fill: "red",
    fillStyle: "solid",
  }).sets;

  return generator.opsToPath(sets[0]) + generator.opsToPath(sets[1]);
};

export const circle2Path = (cx: number, cy: number, r: number) => {
  const generator = rough.generator();
  return generator.opsToPath(
    generator.circle(cx, cy, r, {
      disableMultiStroke: true,
      disableMultiStrokeFill: true,
      preserveVertices: true,
    }).sets[0]
  );
};

export const shape2path = (
  type: string,
  props: React.SVGAttributes<SVGElement>,
  config?: RoughConfig
): string => {
  switch (type) {
    case SVG_PATH_TAG: {
      const { d = "" } = props;
      return path2path(d);
    }
    case SVG_CIRCLE_TAG: {
      const { cx = 0, cy = 0, r = 0 } = props;
      return circle2Path(+cx, +cy, +r);
    }
    default:
      return "";
  }
};
