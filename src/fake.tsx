import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_D,
  SVG_CIRCLE_PROPS,
} from "./constants";
import { shape2path } from "./shape2path";

type SVGProp = Pick<React.SVGAttributes<SVGElement>, "d" | "cx" | "cy" | "r">;
type SVGPropName = keyof SVGProp;

export const createFakeElement = (element: Element, type?: string) => {
  const fakeElement = new FakeElement(element, type);
  const handler = {
    get(target: FakeElement, prop: string) {
      const value =
        prop in target
          ? target[prop as keyof FakeElement]
          : element[prop as keyof Element];

      if (typeof value === "function") {
        return prop in target ? value.bind(target) : value.bind(element);
      }
      return value;
    },
    set(target: FakeElement, prop: string, value: any) {
      if (prop.startsWith("_")) {
        // @ts-ignore
        target[prop] = value;
        return true;
      }
      // @ts-ignore
      element[prop] = value;
      return true;
    },
  };
  return new Proxy(fakeElement, handler);
};

const getFakeDocument = (ownerDocument: Document) => ({
  createElementNS: (ns: string, type: string) => {
    let el: Element;
    if (type === SVG_PATH_TAG || type === SVG_CIRCLE_TAG) {
      el = ownerDocument.createElementNS(ns, SVG_PATH_TAG);
    } else {
      el = ownerDocument.createElementNS(ns, type);
    }
    return createFakeElement(el, type);
  },
  createElement: (type: string) => {
    const el = ownerDocument.createElement(type);
    return createFakeElement(el);
  },
  addEventListener(event: string, callback: () => void) {
    ownerDocument.addEventListener(event, callback);
  },
});

class FakeElement {
  _element: Element;
  _appended: boolean = false;
  _svgProps: SVGProp = {};
  _tagName: string = "";
  constructor(el: Element, type?: string) {
    this._tagName = type || el.tagName;
    this._element = el;
  }
  get ownerDocument() {
    return getFakeDocument(this._element.ownerDocument);
  }
  appendChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child._appended) {
        const childType = child._tagName;
        if (childType === SVG_PATH_TAG || childType === SVG_CIRCLE_TAG) {
          child._appended = true;
          child._applySvgProps();
        }
      }
      this._element.appendChild(child._element);
    } else {
      this._element.appendChild(child);
    }
  }
  removeChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      this._element.removeChild(child._element);
    } else {
      this._element.removeChild(child);
    }
  }
  setAttribute(name: string, value: string) {
    let svgPropsChange = false;
    switch (this._tagName) {
      case SVG_PATH_TAG: {
        if (name === SVG_D) {
          svgPropsChange = true;
          this._svgProps.d = value;
        }
        break;
      }
      case SVG_CIRCLE_TAG: {
        if (SVG_CIRCLE_PROPS.includes(name)) {
          svgPropsChange = true;
          this._svgProps[name as SVGPropName] = value;
        }
      }
      default:
        break;
    }
    if (svgPropsChange) {
      if (!this._appended) {
        return;
      }
      this._applySvgProps();
    } else {
      this._element.setAttribute(name, value);
    }
  }
  _applySvgProps() {
    const d = shape2path(this._tagName, this._svgProps);
    this._element.setAttribute(SVG_D, d);
  }
}
