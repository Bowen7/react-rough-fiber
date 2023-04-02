export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

export const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
export const ON_ANI = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
export const CAMEL_REPLACE = /[A-Z0-9]/g;
export const CAMEL_PROPS =
  /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;

export const SVG_PATH_TAG = 'path';
export const SVG_CIRCLE_TAG = 'circle';
export const SVG_LINE_TAG = 'line';
export const SVG_RECT_TAG = 'rect';
export const SVG_ELLIPSE_TAG = 'ellipse';
export const SVG_POLYGON_TAG = 'polygon';

export const SVG_PATH_PROPS = {
  d: '',
};
export const SVG_CIRCLE_PROPS = { cx: 0, cy: 0, r: 0 };
export const SVG_LINE_PROPS = { x1: 0, y1: 0, x2: 0, y2: 0 };
export const SVG_RECT_PROPS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
export const SVG_ELLIPSE_PROPS = {
  cx: 0,
  cy: 0,
  rx: 0,
  ry: 0,
};
export const SVG_POLYGON_PROPS = { points: '' };

export const SVG_SHAPE_PROPS = {
  [SVG_PATH_TAG]: SVG_PATH_PROPS,
  [SVG_CIRCLE_TAG]: SVG_CIRCLE_PROPS,
  [SVG_LINE_TAG]: SVG_LINE_PROPS,
  [SVG_RECT_TAG]: SVG_RECT_PROPS,
  [SVG_ELLIPSE_TAG]: SVG_ELLIPSE_PROPS,
  [SVG_POLYGON_TAG]: SVG_POLYGON_PROPS,
};

export const FILL_PLACEHOLDER = 'fill-placeholder';
export const STROKE_PLACEHOLDER = 'stroke-placeholder';
