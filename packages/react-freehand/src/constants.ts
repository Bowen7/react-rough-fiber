export const SVG_PATH_TAG = 'path';
export const SVG_CIRCLE_TAG = 'circle';
export const SVG_LINE_TAG = 'line';
export const SVG_RECT_TAG = 'rect';
export const SVG_ELLIPSE_TAG = 'ellipse';
export const SVG_POLYGON_TAG = 'polygon';

export const SVG_D = 'd';

export const SVG_PATH_PROPS = { d: true, fill: true };
export const SVG_CIRCLE_PROPS = { cx: true, cy: true, r: true, fill: true };
export const SVG_LINE_PROPS = { x1: true, y1: true, x2: true, y2: true };
export const SVG_RECT_PROPS = {
  x: true,
  y: true,
  width: true,
  height: true,
  fill: true,
};
export const SVG_ELLIPSE_PROPS = {
  cx: true,
  cy: true,
  rx: true,
  ry: true,
  fill: true,
};
export const SVG_POLYGON_PROPS = { points: true, fill: true };

export const SVG_INTERCEPT_ATTRIBUTE = {
  [SVG_PATH_TAG]: SVG_PATH_PROPS,
  [SVG_CIRCLE_TAG]: SVG_CIRCLE_PROPS,
  [SVG_LINE_TAG]: SVG_LINE_PROPS,
  [SVG_RECT_TAG]: SVG_RECT_PROPS,
  [SVG_ELLIPSE_TAG]: SVG_ELLIPSE_PROPS,
  [SVG_POLYGON_TAG]: SVG_POLYGON_PROPS,
};

export const SVG_FILL = 'fill';
