import { SVGShape } from './types';
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
export const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

export const IS_NON_DIMENSIONAL =
  /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
export const ON_ANI = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
export const CAMEL_REPLACE = /[A-Z0-9]/g;
export const CAMEL_PROPS =
  /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;

export const SVG_PATH_PROPS: SVGShape = {
  type: 'path',
  d: '',
};
export const SVG_CIRCLE_PROPS: SVGShape = {
  type: 'circle',
  cx: 0,
  cy: 0,
  r: 0,
};
export const SVG_LINE_PROPS: SVGShape = {
  type: 'line',
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
};
export const SVG_RECT_PROPS: SVGShape = {
  type: 'rect',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};
export const SVG_ELLIPSE_PROPS: SVGShape = {
  type: 'ellipse',
  cx: 0,
  cy: 0,
  rx: 0,
  ry: 0,
};
export const SVG_POLYGON_PROPS: SVGShape = {
  type: 'polygon',
  points: '',
};
export const SVG_POLYLINE_PROPS: SVGShape = {
  type: 'polyline',
  points: '',
};

export const SVG_SHAPE_MAP: { [key in SVGShape['type']]: SVGShape } = {
  path: SVG_PATH_PROPS,
  circle: SVG_CIRCLE_PROPS,
  line: SVG_LINE_PROPS,
  rect: SVG_RECT_PROPS,
  ellipse: SVG_ELLIPSE_PROPS,
  polygon: SVG_POLYGON_PROPS,
  polyline: SVG_POLYLINE_PROPS,
};

export const FILL_CSS_VARIABLE = '--rrf-fill-color';
