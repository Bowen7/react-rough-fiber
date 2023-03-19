import { SVG_D, SVG_PROPS_MAP } from '../constants';
import { shape2path } from '../shape2path';
import { FakeDocument } from './document';

const REACT_PROPS_KEY_START = '__reactProps$';

const getPropChanged = (type: string, name: string) => {
  if (type in SVG_PROPS_MAP) {
    const props = SVG_PROPS_MAP[type as keyof typeof SVG_PROPS_MAP];
    if (props.has(name)) {
      return true;
    }
  }
  return false;
};

export class FakeElement {
  _element: Element;
  _fakeDocument: FakeDocument;
  _appended: boolean = false;
  _supportMergeUpdate = false;
  // only for SVG_PROPS_MAP[tagName] props
  _propsChanged: boolean = false;
  _props: { [name: string]: string } = {};
  _tagName: string = '';
  constructor(el: Element, fakeDocument: FakeDocument, type?: string) {
    this._tagName = (type || el.tagName).toLowerCase();
    this._fakeDocument = fakeDocument;
    this._element = el;
  }
  get ownerDocument() {
    return this._fakeDocument;
  }
  get _fakeContainer() {
    return this._fakeDocument._getFakeContainer();
  }

  appendChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child._appended) {
        const childType = child._tagName;
        if (childType in SVG_PROPS_MAP) {
          child._appended = true;
          child._applyProps();
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
      this._fakeContainer._removeFakeElement(child);
    } else {
      this._element.removeChild(child);
    }
  }

  insertBefore(child: Element | FakeElement, before: Element | FakeElement) {
    if (child instanceof FakeElement) {
      if (!child._appended) {
        const childType = child._tagName;
        if (childType in SVG_PROPS_MAP) {
          child._appended = true;
          child._applyProps();
        }
      }
      if (before instanceof FakeElement) {
        this._element.insertBefore(child._element, before._element);
      } else {
        this._element.insertBefore(child._element, before);
      }
    } else {
      if (before instanceof FakeElement) {
        this._element.insertBefore(child, before._element);
      } else {
        this._element.insertBefore(child, before);
      }
    }
  }

  setAttribute(name: string, value: string) {
    const propChanged = getPropChanged(this._tagName, name);
    console.log(this._supportMergeUpdate);
    if (propChanged) {
      this._propsChanged = true;
      this._props[name] = value;
      if (name === 'fill') {
        this._element.setAttribute(name, value);
      }
      if (!this._appended || this._supportMergeUpdate) {
        return;
      }
      this._applyProps();
    } else {
      this._element.setAttribute(name, value);
    }
  }

  removeAttribute(name: string) {
    const propChanged = getPropChanged(this._tagName, name);
    if (propChanged) {
      this._propsChanged = true;
      delete this._props[name];
      if (this._supportMergeUpdate) {
        return;
      }
      this._applyProps();
    } else {
      this._element.removeAttribute(name);
    }
  }

  _applyProps() {
    this._propsChanged = false;
    const d = shape2path(
      this._tagName,
      this._props,
      this._fakeContainer._roughOptions
    );
    this._element.setAttribute(SVG_D, d);
  }

  _commitUpdate() {
    if (this._appended && this._propsChanged) {
      this._applyProps();
    }
  }
}

export const createElementProxyHandler = <T extends FakeElement>(
  element: Element
) => ({
  get(target: T, prop: string) {
    const value =
      prop in target ? target[prop as keyof T] : element[prop as keyof Element];

    if (typeof value === 'function') {
      return prop in target ? value.bind(target) : value.bind(element);
    }
    return value;
  },
  set(target: T, prop: string, value: any) {
    if (Object.prototype.hasOwnProperty.call(target, prop)) {
      // @ts-ignore
      target[prop] = value;
      return true;
    }
    // @ts-ignore
    element[prop] = value;
    if (prop.startsWith(REACT_PROPS_KEY_START)) {
      target._supportMergeUpdate = true;
      target._commitUpdate();
    }
    return true;
  },
});

export const createFakeElement = (
  element: Element,
  fakeDocument: FakeDocument,
  type?: string
) => {
  const fakeElement = new FakeElement(element, fakeDocument, type);

  const handler = createElementProxyHandler<FakeElement>(element);
  return new Proxy(fakeElement, handler);
};
