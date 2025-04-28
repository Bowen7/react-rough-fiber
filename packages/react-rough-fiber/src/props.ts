// The MIT License (MIT)

// Copyright (c) 2015-present Jason Miller

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// almost all code is from preact, modified for react-rough-fiber
import type {
  InstanceProps,
  InstanceWithRRF,
  Options,
  RRFEvent,
  SVGShape,
  SVGShapeProps,
  SVGShapeType,
} from './types'
import {
  CAMEL_PROPS,
  CAMEL_REPLACE,
  FILL_CSS_VARIABLE,
  FILL_OPACITY_CSS_VARIABLE,
  IS_NON_DIMENSIONAL,
  ON_ANI,
  SVG_SHAPE_MAP,
} from './constants'
import { diffShape } from './shape'

export function normalizeProps(
  type: string,
  props: InstanceProps,
  inDefs: boolean,
): [InstanceProps, SVGShapeProps | null] {
  const normalizedProps: InstanceProps = {}
  const isShapeType = type in SVG_SHAPE_MAP
  const shapeProps: SVGShapeProps | null = isShapeType
    ? {
        fill: `var(${FILL_CSS_VARIABLE})`,
        ...SVG_SHAPE_MAP[type as SVGShapeType],
      }
    : null

  for (let propName in props) {
    let value: any = props[propName as keyof typeof props]

    if (!inDefs && shapeProps) {
      if (
        propName !== 'type'
        && propName in SVG_SHAPE_MAP[type as SVGShapeType]
      ) {
        const propValue
          = propName === 'd' || propName === 'points'
            ? value
            : Number(value) || 0
        shapeProps[propName as keyof SVGShape] = propValue
        continue
      }
      if (
        propName === 'fill'
        || propName === 'stroke'
        || propName === 'fillOpacity'
      ) {
        shapeProps[propName] = value
      }
    }

    if (
      (propName === 'value' && 'defaultValue' in props && value == null)
      // Emulate React's behavior of not rendering the contents of noscript tags on the client.
      || (propName === 'children' && type === 'noscript')
      || propName === 'class'
      || propName === 'className'
    ) {
      // Skip applying value if it is null/undefined and we already set
      // a default value
      continue
    }

    const lowerCased = propName.toLowerCase()
    if (
      propName === 'defaultValue'
      && 'value' in props
      && props.value == null
    ) {
      // `defaultValue` is treated as a fallback `value` when a value prop is present but null/undefined.
      // `defaultValue` for Elements with no value prop is the same as the DOM defaultValue property.
      propName = 'value'
    }
    else if (propName === 'download' && value === true) {
      // Calling `setAttribute` with a truthy value will lead to it being
      // passed as a stringified value, e.g. `download="true"`. React
      // converts it to an empty string instead, otherwise the attribute
      // value will be used as the file name and the file will be called
      // "true" upon downloading it.
      value = ''
    }
    else if (lowerCased === 'ondoubleclick') {
      propName = 'ondblclick'
    }
    else if (lowerCased === 'onfocus') {
      propName = 'onfocusin'
    }
    else if (lowerCased === 'onblur') {
      propName = 'onfocusout'
    }
    else if (ON_ANI.test(propName)) {
      propName = lowerCased
    }
    else if (!type.includes('-') && CAMEL_PROPS.test(propName)) {
      propName = propName.replace(CAMEL_REPLACE, '-$&').toLowerCase()
    }
    else if (value === null) {
      value = undefined
    }

    normalizedProps[propName] = value
  }

  if (
    props['class' as keyof typeof props]
    && !props['className' as keyof typeof props]
  ) {
    normalizedProps.class = props['class' as keyof typeof props]
    Object.defineProperty(normalizedProps, 'className', {
      enumerable: false,
      configurable: true,
      get() {
        return this.class
      },
    })
  }
  else if (
    props['className' as keyof typeof props]
    && !props['class' as keyof typeof props]
  ) {
    normalizedProps.class = normalizedProps['className' as keyof typeof props]
      = props['className' as keyof typeof props]
  }
  else if (
    props['class' as keyof typeof props]
    && props['className' as keyof typeof props]
  ) {
    normalizedProps.class = normalizedProps.className
      = props['className' as keyof typeof props]
  }

  // a trick for roughjs to set fill
  // when fillStyle !== solid, roughjs will use stroke to draw the shape fill content
  // In this situation, we need to set the fill color to be the same as the stroke color.
  // we use CSS variable to set the fill color
  // if an svg/g element has a fill color, we set it to css variable FILL_CSS_VARIABLE
  let fill = normalizedProps.fill
  let fillOpacity = normalizedProps['fill-opacity']
  if ('style' in normalizedProps) {
    const style = normalizedProps.style
    if (style) {
      if ('fill' in style) {
        fill = style.fill
        if (shapeProps) {
          shapeProps.fill = style.fill
        }
      }
      if ('fillOpacity' in style) {
        fillOpacity = style.fillOpacity
        if (shapeProps) {
          shapeProps.fillOpacity = style.fillOpacity
        }
      }
    }
  }
  // the default value for "fill" is black
  if (!fill && type === 'svg') {
    fill = '#000'
  }
  if (!fillOpacity && type === 'svg') {
    fillOpacity = 1
  }
  if (!isShapeType) {
    normalizedProps.style = {
      ...normalizedProps.style,
    }
    if (fill) {
      normalizedProps.style[FILL_CSS_VARIABLE] = fill
    }
    if (fillOpacity) {
      normalizedProps.style[FILL_OPACITY_CSS_VARIABLE] = fillOpacity
    }
  }

  return [normalizedProps, shapeProps]
}

export function diffNormalizedProps(
  domElement: InstanceWithRRF,
  prevProps: InstanceProps,
  nextProps: InstanceProps,
) {
  for (const propName in prevProps) {
    if (
      propName !== 'children'
      && propName !== 'key'
      && !(propName in nextProps)
    ) {
      setProperty(
        domElement,
        propName,
        null,
        prevProps[propName as keyof typeof prevProps],
      )
    }
  }

  for (const propName in nextProps) {
    const prevProp = prevProps[propName as keyof typeof prevProps]
    const nextProp = nextProps[propName as keyof typeof nextProps]
    if (propName === 'children') {
      if (typeof nextProp === 'number' || typeof nextProp === 'string') {
        domElement.textContent = nextProp.toString()
      }
    }
    else if (
      propName !== 'key'
      && propName !== 'value'
      && propName !== 'checked'
      && prevProp !== nextProp
    ) {
      setProperty(domElement, propName, nextProp, prevProp)
    }
  }
}

export function diffProps(
  type: string,
  domElement: InstanceWithRRF,
  newProps: InstanceProps,
  oldProps: InstanceProps | null,
  options: Options,
) {
  const inDefs = domElement._rrf_inDefs
  type = type.toLowerCase()
  const [nextProps, nextShapeProps] = normalizeProps(type, newProps, inDefs)
  const [prevProps, prevShapeProps] = oldProps
    ? normalizeProps(type, oldProps, inDefs)
    : [{}, null]

  if (!inDefs && type in SVG_SHAPE_MAP) {
    diffShape(
      domElement as SVGElement,
      prevShapeProps,
      nextShapeProps!,
      newProps,
      options,
    )
  }

  diffNormalizedProps(domElement, prevProps, nextProps)
}

function setStyle(style: CSSStyleDeclaration, key: string, value: any) {
  if (key[0] === '-') {
    style.setProperty(key, value == null ? '' : value)
  }
  else if (value == null) {
    (<any>style)[key] = ''
  }
  else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
    (<any>style)[key] = value
  }
  else {
    (<any>style)[key] = `${value}px`
  }
}

export function setProperty(
  domElement: InstanceWithRRF,
  name: string,
  value: any,
  oldValue: any,
) {
  let useCapture

  if (name === 'style') {
    if (typeof value == 'string') {
      domElement.style.cssText = value
    }
    else {
      if (typeof oldValue == 'string') {
        domElement.style.cssText = oldValue = ''
      }

      if (oldValue) {
        for (name in oldValue) {
          if (!(value && name in value)) {
            setStyle(domElement.style, name, '')
          }
        }
      }

      if (value) {
        for (name in value) {
          if (!oldValue || value[name] !== oldValue[name]) {
            setStyle(domElement.style, name, value[name])
          }
        }
      }
    }
  }
  // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
  else if (name[0] === 'o' && name[1] === 'n') {
    useCapture = name !== (name = name.replace(/Capture$/, ''))

    // Infer correct casing for DOM built-in events:
    if (name.toLowerCase() in domElement)
      name = name.toLowerCase().slice(2)
    else name = name.slice(2)

    if (!domElement._rrf_listeners)
      domElement._rrf_listeners = {}
    domElement._rrf_listeners[name + useCapture] = value

    if (value) {
      if (!oldValue) {
        const handler = useCapture ? eventProxyCapture : eventProxy
        domElement.addEventListener(name, handler, useCapture)
      }
    }
    else {
      const handler = useCapture ? eventProxyCapture : eventProxy
      domElement.removeEventListener(name, handler, useCapture)
    }
  }
  else if (name !== 'dangerouslySetInnerHTML') {
    if (
      name !== 'width'
      && name !== 'height'
      && name !== 'href'
      && name !== 'list'
      && name !== 'form'
      // Default value in browsers is `-1` and an empty string is
      // cast to `0` instead
      && name !== 'tabIndex'
      && name !== 'download'
      && name in domElement
    ) {
      try {
        (<any>domElement)[name] = value == null ? '' : value
        return
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
      catch (e) {
      }
    }

    // aria- and data- attributes have no boolean representation.
    // A `false` value is different from the attribute not being
    // present, so we can't remove it. For non-boolean aria
    // attributes we could treat false as a removal, but the
    // amount of exceptions would cost too many bytes. On top of
    // that other frameworks generally stringify `false`.

    if (typeof value === 'function') {
      // never serialize functions as attribute values
    }
    else if (value != null && (value !== false || name[4] === '-')) {
      domElement.setAttribute(name, value)
    }
    else {
      domElement.removeAttribute(name)
    }
  }
}

function eventProxy(this: InstanceWithRRF, e: Event) {
  const event = e as RRFEvent
  event.persist = () => {}
  return this._rrf_listeners[e.type + false](event)
}

function eventProxyCapture(this: InstanceWithRRF, e: Event) {
  const event = e as RRFEvent
  event.persist = () => {}
  return this._rrf_listeners[e.type + true](event)
}
