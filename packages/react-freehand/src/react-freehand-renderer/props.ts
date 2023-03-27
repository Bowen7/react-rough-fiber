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
import { isFun } from './utils';
import { InstanceWithListeners } from './types';
import { IS_NON_DIMENSIONAL } from './constants';

export function diffProps(
  domElement: InstanceWithListeners,
  newProps: object,
  oldProps: object,
  isSvg: boolean
) {
  let i;

  for (i in oldProps) {
    if (i !== 'children' && i !== 'key' && !(i in newProps)) {
      setProperty(
        domElement,
        i,
        null,
        oldProps[i as keyof typeof oldProps],
        isSvg
      );
    }
  }

  for (i in newProps) {
    const oldProp = oldProps[i as keyof typeof oldProps];
    const newProp = newProps[i as keyof typeof newProps];
    if (
      isFun(newProps[i as keyof typeof newProps]) &&
      i !== 'children' &&
      i !== 'key' &&
      i !== 'value' &&
      i !== 'checked' &&
      oldProp !== newProp
    ) {
      setProperty(domElement, i, newProp, oldProp, isSvg);
    }
  }
}

function setStyle(style: CSSStyleDeclaration, key: string, value: any) {
  if (key[0] === '-') {
    style.setProperty(key, value == null ? '' : value);
  } else if (value == null) {
    (<any>style)[key] = '';
  } else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
    (<any>style)[key] = value;
  } else {
    (<any>style)[key] = value + 'px';
  }
}

export function setProperty(
  domElement: InstanceWithListeners,
  name: string,
  value: any,
  oldValue: any,
  isSvg: boolean
) {
  let useCapture;

  if (name === 'style') {
    if (typeof value == 'string') {
      domElement.style.cssText = value;
    } else {
      if (typeof oldValue == 'string') {
        domElement.style.cssText = oldValue = '';
      }

      if (oldValue) {
        for (name in oldValue) {
          if (!(value && name in value)) {
            setStyle(domElement.style, name, '');
          }
        }
      }

      if (value) {
        for (name in value) {
          if (!oldValue || value[name] !== oldValue[name]) {
            setStyle(domElement.style, name, value[name]);
          }
        }
      }
    }
  }
  // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
  else if (name[0] === 'o' && name[1] === 'n') {
    useCapture = name !== (name = name.replace(/Capture$/, ''));

    // Infer correct casing for DOM built-in events:
    if (name.toLowerCase() in domElement) name = name.toLowerCase().slice(2);
    else name = name.slice(2);

    if (!domElement._listeners) domElement._listeners = {};
    domElement._listeners[name + useCapture] = value;

    if (value) {
      if (!oldValue) {
        const handler = useCapture ? eventProxyCapture : eventProxy;
        domElement.addEventListener(name, handler, useCapture);
      }
    } else {
      const handler = useCapture ? eventProxyCapture : eventProxy;
      domElement.removeEventListener(name, handler, useCapture);
    }
  } else if (name !== 'dangerouslySetInnerHTML') {
    if (isSvg) {
      // Normalize incorrect prop usage for SVG:
      // - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
      // - className --> class
      name = name.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's');
    } else if (
      name !== 'width' &&
      name !== 'height' &&
      name !== 'href' &&
      name !== 'list' &&
      name !== 'form' &&
      // Default value in browsers is `-1` and an empty string is
      // cast to `0` instead
      name !== 'tabIndex' &&
      name !== 'download' &&
      name in domElement
    ) {
      try {
        // @ts-ignore
        domElement[name] = value == null ? '' : value;
        return;
      } catch (e) {}
    }

    // aria- and data- attributes have no boolean representation.
    // A `false` value is different from the attribute not being
    // present, so we can't remove it. For non-boolean aria
    // attributes we could treat false as a removal, but the
    // amount of exceptions would cost too many bytes. On top of
    // that other frameworks generally stringify `false`.

    if (typeof value === 'function') {
      // never serialize functions as attribute values
    } else if (value != null && (value !== false || name[4] === '-')) {
      domElement.setAttribute(name, value);
    } else {
      domElement.removeAttribute(name);
    }
  }
}

function eventProxy(this: InstanceWithListeners, e: Event) {
  return this._listeners[e.type + false](e);
}

function eventProxyCapture(this: InstanceWithListeners, e: Event) {
  return this._listeners[e.type + true](e);
}
