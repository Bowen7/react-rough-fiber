import { SVG_D } from './constants';
import { RoughOptions } from './types';
import { SVG_INTERCEPT_ATTRIBUTE, SVG_PATH_TAG, SVG_FILL } from './constants';
import { shape2path } from './shape2path';
import { shallowEqual } from './utils';

// see https://github.com/facebook/react/blob/3554c8852fe209ad02380ebd24d32f56d6399906/packages/react-dom-bindings/src/client/ReactDOMComponentTree.js#L44
const REACT_INTERNAL_PROPS_KEY_START = '__reactProps$';
//https://github.com/facebook/react/blob/da834083cccb6ef942f701c6b6cecc78213196a8/packages/react-dom/src/client/ReactDOMComponentTree.js#L22
// react 16.x
const OLD_REACT_INTERNAL_PROPS_KEY_START = '__reactEventHandlers$';
type InterceptProps = {
  [name: string]: string;
};

// Create a proxy handler
// get: if the property exists in target, return the value of target
// else return the value of fallback
// set: likewise
const createProxyHandler = <Target extends object, Fallback extends object>(
  fallback: Fallback,
  callback?: (name: string, props: unknown) => void
) => ({
  get(target: Target, name: string) {
    const value =
      name in target
        ? target[name as keyof Target]
        : fallback[name as keyof Fallback];

    if (typeof value === 'function') {
      return name in target ? value.bind(target) : value.bind(fallback);
    }
    return value;
  },
  set(target: Target, name: string, value: any) {
    if (Object.prototype.hasOwnProperty.call(target, name)) {
      target[name as keyof Target] = value;
      return true;
    }
    fallback[name as keyof Fallback] = value;
    callback && callback(name, value);
    return true;
  },
});

const shouldInterceptAttribute = (type: string, name: string) =>
  type in SVG_INTERCEPT_ATTRIBUTE &&
  name in SVG_INTERCEPT_ATTRIBUTE[type as keyof typeof SVG_INTERCEPT_ATTRIBUTE];

const fakeSet = {
  size: 0,
  delete() {},
  add() {},
  forEach() {},
};

export class FakeCore {
  realContainer: Element;
  fakeContainer: Element;
  fakeDocument: Document;
  fakeSVGElementSet: Set<Element>;
  roughOptions: RoughOptions | undefined;
  shouldForceOptionsChange: boolean;
  couldMergeUpdate = false;
  constructor(
    domElement: Element,
    shouldForceOptionsChange = false,
    roughOptions?: RoughOptions
  ) {
    this.realContainer = domElement;
    // How to force update after rough options change:
    // collect all relevant elements in advance.
    // and update them after rough options change.
    this.shouldForceOptionsChange = shouldForceOptionsChange;
    this.fakeSVGElementSet = shouldForceOptionsChange
      ? new Set()
      : (fakeSet as any as Set<Element>);
    this.roughOptions = roughOptions;
    this.fakeDocument = this.createFakeDocument() as Document;

    // Detect if we could merge update.
    // How to merge update:
    // react will set a prop to the element with the prefix `__reactProps$` .
    // we can use proxy to know when `__reactProps$` is set.
    // we calculate the path using `shape2path` and set it to `d` attribute when `__reactProps$` is set.
    // if we could merge update, we should skip `setAttribute` and `removeAttribute` for keys of SVG_INTERCEPT_ATTRIBUTE[type].
    // How to detect if we could merge update:
    // try to get `__reactProps$` prefix key from domElement, if it exists, we could merge update.
    Object.keys(domElement).forEach((key) => {
      if (
        key.startsWith(REACT_INTERNAL_PROPS_KEY_START) ||
        key.startsWith(OLD_REACT_INTERNAL_PROPS_KEY_START)
      ) {
        this.couldMergeUpdate = true;
      }
    });

    this.fakeContainer = this.createFakeElement(domElement) as Element;
  }

  createFakeDocument() {
    const realOwnerDocument = this.realContainer.ownerDocument;
    const doc = {
      createElementNS: (ns: string, type: string) => {
        if (type.toLowerCase() in SVG_INTERCEPT_ATTRIBUTE) {
          const el = realOwnerDocument.createElementNS(ns, SVG_PATH_TAG);
          const fakeElement = this.createFakeElement(el, type);
          // collect svg elements in order to update them later(shouldForceOptionsChange = true).
          this.fakeSVGElementSet.add(fakeElement as Element);
          return fakeElement;
        } else {
          return this.createFakeElement(
            realOwnerDocument.createElementNS(ns, type)
          );
        }
      },
      createElement: (type: string) => {
        const el = realOwnerDocument.createElement(type);
        return this.createFakeElement(el);
      },
    };
    const handler = createProxyHandler(realOwnerDocument);
    return new Proxy(doc, handler);
  }

  createFakeElement(element: Element, _type?: string) {
    const type = _type || element.tagName;
    const { fakeSVGElementSet, couldMergeUpdate } = this;
    let interceptedAttrs: InterceptProps | null = null;
    const el = {
      __originalType: type,
      __realElement: element,
      __commitUpdate: () => {
        element.setAttribute(
          SVG_D,
          shape2path(type, interceptedAttrs || {}, this.roughOptions)
        );
      },
      // react use the ownerDocument to create elements, so we need to override it.
      ownerDocument: this.fakeDocument,
      appendChild: (child: Element) => {
        if ('__realElement' in child && '__originalType' in child) {
          element.appendChild(child.__realElement as Element);
          if (
            (child.__originalType as string).toLowerCase() in
            SVG_INTERCEPT_ATTRIBUTE
          ) {
            fakeSVGElementSet.add(child);
          }
          !couldMergeUpdate && (child as any).__commitUpdate();
        } else {
          element.appendChild(child);
        }
      },
      removeChild(child: Element) {
        if ('__realElement' in child) {
          element.removeChild(child.__realElement as Element);
          fakeSVGElementSet.delete(child);
        } else {
          element.removeChild(child);
        }
      },
      insertBefore: (child: Element, before: Element) => {
        if ('__realElement' in child && '__originalType' in child) {
          if ('__realElement' in before && '__originalType' in before) {
            element.insertBefore(
              child.__realElement as Element,
              before.__realElement as Element
            );
          } else {
            element.insertBefore(child.__realElement as Element, before);
          }
          !couldMergeUpdate && (child as any).__commitUpdate();
        } else {
          if ('__realElement' in before && '__originalType' in before) {
            element.insertBefore(child, before.__realElement as Element);
          } else {
            element.insertBefore(child, before);
          }
        }
      },
      setAttribute(name: string, value: string) {
        if (!shouldInterceptAttribute(type, name)) {
          element.setAttribute(name, value);
        } else {
          // `fill` attribute should be set to the element directly.
          if (name === SVG_FILL) {
            element.setAttribute(name, value);
          }
          if (!couldMergeUpdate) {
            if (!interceptedAttrs) {
              interceptedAttrs = {};
            }
            interceptedAttrs[name] = value;
            // If the element has not been appended to the parent, do not need to update it.
            element.parentNode && this.__commitUpdate();
          }
        }
      },
      removeAttribute(name: string) {
        if (!shouldInterceptAttribute(type, name)) {
          element.removeAttribute(name);
        } else {
          if (name === SVG_FILL) {
            element.removeAttribute(name);
          }
          if (!couldMergeUpdate) {
            delete interceptedAttrs![name];
            // The node has been appended to parent
            this.__commitUpdate();
          }
        }
      },
    };

    const setCallback = (name: string, value: any) => {
      if (
        name.startsWith(REACT_INTERNAL_PROPS_KEY_START) ||
        name.startsWith(OLD_REACT_INTERNAL_PROPS_KEY_START)
      ) {
        const nextAttrs: InterceptProps = {};
        Object.keys(
          SVG_INTERCEPT_ATTRIBUTE[type as keyof typeof SVG_INTERCEPT_ATTRIBUTE]
        ).forEach((attr) => {
          if (Object.prototype.hasOwnProperty.call(value, attr)) {
            nextAttrs[attr] = value[attr as keyof typeof value];
          }
        });
        if (!shallowEqual(nextAttrs, interceptedAttrs)) {
          interceptedAttrs = nextAttrs;
          el.__commitUpdate();
        }
      }
    };

    const handler = createProxyHandler(
      element,
      couldMergeUpdate && type in SVG_INTERCEPT_ATTRIBUTE
        ? setCallback
        : undefined
    );
    return new Proxy(el, handler);
  }

  forceUpdate() {
    this.fakeSVGElementSet.forEach((el) => {
      (el as any).__commitUpdate();
    });
  }

  updateRoughOptions(roughOptions: RoughOptions | undefined) {
    this.roughOptions = roughOptions;
    if (this.shouldForceOptionsChange) {
      this.forceUpdate();
    }
  }
}
