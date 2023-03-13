import {
  SVG_PATH_TAG,
  SVG_CIRCLE_TAG,
  SVG_D,
  SVG_PROPS_MAP,
} from "./constants";
import { shape2path } from "./shape2path";

export const createFakeElement = (
  element: Element,
  container: Element,
  type?: string
) => {
  const fakeElement = new FakeElement(element, container, type);
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
      if (prop.startsWith("_fake")) {
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

// TODO proxy?
const getFakeDocument = (realOwnerDocument: Document, container: Element) => ({
  createElementNS: (ns: string, type: string) => {
    let el: Element;
    if (type.toLowerCase() in SVG_PROPS_MAP) {
      el = realOwnerDocument.createElementNS(ns, SVG_PATH_TAG);
    } else {
      el = realOwnerDocument.createElementNS(ns, type);
    }
    return createFakeElement(el, container, type);
  },
  createElement: (type: string) => {
    const el = realOwnerDocument.createElement(type);
    return createFakeElement(el, container);
  },
  get documentElement() {
    return realOwnerDocument.documentElement;
  },
});

class FakeElement {
  _fake_element: Element;
  _fake_container: Element;
  _fake_appended: boolean = false;
  _fake_props: { [name: string]: string } = {};
  _fake_tagName: string = "";
  constructor(el: Element, container: Element, type?: string) {
    this._fake_tagName = (type || el.tagName).toLowerCase();
    this._fake_container = container;
    this._fake_element = el;
  }
  get ownerDocument() {
    return getFakeDocument(
      this._fake_element.ownerDocument,
      this._fake_container
    );
  }
  appendChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child._fake_appended) {
        const childType = child._fake_tagName;
        if (childType in SVG_PROPS_MAP) {
          child._fake_appended = true;
          child._fake_applyProps();
        }
      }
      this._fake_element.appendChild(child._fake_element);
    } else {
      this._fake_element.appendChild(child);
    }
  }
  removeChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      this._fake_element.removeChild(child._fake_element);
    } else {
      this._fake_element.removeChild(child);
    }
  }
  insertBefore(child: Element | FakeElement, before: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child._fake_appended) {
        const childType = child._fake_tagName;
        if (childType in SVG_PROPS_MAP) {
          child._fake_appended = true;
          child._fake_applyProps();
        }
      }
      if (before instanceof FakeElement) {
        this._fake_element.insertBefore(
          child._fake_element,
          before._fake_element
        );
      } else {
        this._fake_element.insertBefore(child._fake_element, before);
      }
    } else {
      if (before instanceof FakeElement) {
        this._fake_element.insertBefore(child, before._fake_element);
      } else {
        this._fake_element.insertBefore(child, before);
      }
    }
  }
  setAttribute(name: string, value: string) {
    let propsChange = false;
    const type = this._fake_tagName;
    if (type in SVG_PROPS_MAP) {
      const props = SVG_PROPS_MAP[type as keyof typeof SVG_PROPS_MAP];
      if (props.has(name)) {
        propsChange = true;
        this._fake_props[name] = value;
      }
    }
    if (propsChange) {
      if (name === "fill") {
        this._fake_element.setAttribute(name, value);
      }
      if (!this._fake_appended) {
        return;
      }
      this._fake_applyProps();
    } else {
      this._fake_element.setAttribute(name, value);
    }
  }
  removeAttribute(name: string) {
    let propsChanged = false;

    if (propsChanged) {
      if (!this._fake_appended) {
        return;
      }
      this._fake_applyProps();
    } else {
      this._fake_element.removeAttribute(name);
    }
  }
  _fake_applyProps() {
    const d = shape2path(this._fake_tagName, this._fake_props);
    this._fake_element.setAttribute(SVG_D, d);
  }
}
