import { SVG_PATH_TAG, SVG_D, SVG_PROPS_MAP } from "./constants";
import { shape2path } from "./shape2path";

type FakeDocument = {
  createElementNS: (ns: string, type: string) => FakeElement;
  createElement: (type: string) => FakeElement;
};

const createFakeDocument = (container: Element) => {
  const realOwnerDocument = container.ownerDocument;

  const doc: FakeDocument = {
    createElementNS: (ns: string, type: string) => {
      let el: Element;
      if (type.toLowerCase() in SVG_PROPS_MAP) {
        el = realOwnerDocument.createElementNS(ns, SVG_PATH_TAG);
      } else {
        el = realOwnerDocument.createElementNS(ns, type);
      }
      return createFakeElement(el, fakeDocument, type);
    },
    createElement: (type: string) => {
      const el = realOwnerDocument.createElement(type);
      return createFakeElement(el, fakeDocument);
    },
  };

  const fakeDocument = new Proxy(doc, {
    get(target: FakeDocument, prop: string) {
      const value =
        prop in target
          ? target[prop as keyof FakeDocument]
          : realOwnerDocument[prop as keyof typeof realOwnerDocument];

      if (typeof value === "function") {
        return prop in target
          ? value.bind(target)
          : value.bind(realOwnerDocument);
      }
      return value;
    },
  });
  return fakeDocument;
};

export const createFakeContainer = (container: Element) => {
  const fakeDocument = createFakeDocument(container);
  const fakeContainer = createFakeElement(container, fakeDocument);
  return fakeContainer;
};

export const createFakeElement = (
  element: Element,
  fakeDocument: FakeDocument,
  type?: string
) => {
  const fakeElement = new FakeElement(element, fakeDocument, type);
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
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
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

class FakeElement {
  __element: Element;
  __fake_document: FakeDocument;
  __appended: boolean = false;
  __props: { [name: string]: string } = {};
  __tagName: string = "";
  constructor(el: Element, fakeDocument: FakeDocument, type?: string) {
    this.__tagName = (type || el.tagName).toLowerCase();
    this.__fake_document = fakeDocument;
    this.__element = el;
  }
  get ownerDocument() {
    return this.__fake_document;
  }
  appendChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child.__appended) {
        const childType = child.__tagName;
        if (childType in SVG_PROPS_MAP) {
          child.__appended = true;
          child.__applyProps();
        }
      }
      this.__element.appendChild(child.__element);
    } else {
      this.__element.appendChild(child);
    }
  }
  removeChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      this.__element.removeChild(child.__element);
    } else {
      this.__element.removeChild(child);
    }
  }
  insertBefore(child: Element | FakeElement, before: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child.__appended) {
        const childType = child.__tagName;
        if (childType in SVG_PROPS_MAP) {
          child.__appended = true;
          child.__applyProps();
        }
      }
      if (before instanceof FakeElement) {
        this.__element.insertBefore(child.__element, before.__element);
      } else {
        this.__element.insertBefore(child.__element, before);
      }
    } else {
      if (before instanceof FakeElement) {
        this.__element.insertBefore(child, before.__element);
      } else {
        this.__element.insertBefore(child, before);
      }
    }
  }
  setAttribute(name: string, value: string) {
    let propsChange = false;
    const type = this.__tagName;
    if (type in SVG_PROPS_MAP) {
      const props = SVG_PROPS_MAP[type as keyof typeof SVG_PROPS_MAP];
      if (props.has(name)) {
        propsChange = true;
        this.__props[name] = value;
      }
    }
    if (propsChange) {
      if (name === "fill") {
        this.__element.setAttribute(name, value);
      }
      if (!this.__appended) {
        return;
      }
      this.__applyProps();
    } else {
      this.__element.setAttribute(name, value);
    }
  }
  removeAttribute(name: string) {
    let propsChanged = false;

    if (propsChanged) {
      if (!this.__appended) {
        return;
      }
      this.__applyProps();
    } else {
      this.__element.removeAttribute(name);
    }
  }
  __applyProps() {
    const d = shape2path(this.__tagName, this.__props);
    this.__element.setAttribute(SVG_D, d);
  }
}
