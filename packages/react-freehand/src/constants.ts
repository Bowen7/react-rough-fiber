export const SVG_PATH_TAG = "path";
export const SVG_CIRCLE_TAG = "circle";
export const SVG_LINE_TAG = "line";
export const SVG_RECT_TAG = "rect";
export const SVG_ELLIPSE_TAG = "ellipse";
export const SVG_POLYGON_TAG = "polygon";

export const SVG_D = "d";

export const SVG_PATH_PROPS = new Set(["d", "fill"]);
export const SVG_CIRCLE_PROPS = new Set(["cx", "cy", "r", "fill"]);
export const SVG_LINE_PROPS = new Set(["x1", "y1", "x2", "y2"]);
export const SVG_RECT_PROPS = new Set(["x", "y", "width", "height", "fill"]);
export const SVG_ELLIPSE_PROPS = new Set(["cx", "cy", "rx", "ry", "fill"]);
export const SVG_POLYGON_PROPS = new Set(["points", "fill"]);

export const SVG_PROPS_MAP = {
  [SVG_PATH_TAG]: SVG_PATH_PROPS,
  [SVG_CIRCLE_TAG]: SVG_CIRCLE_PROPS,
  [SVG_LINE_TAG]: SVG_LINE_PROPS,
  [SVG_RECT_TAG]: SVG_RECT_PROPS,
  [SVG_ELLIPSE_TAG]: SVG_ELLIPSE_PROPS,
  [SVG_POLYGON_TAG]: SVG_POLYGON_PROPS,
};
