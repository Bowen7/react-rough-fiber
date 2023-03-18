import { SVG_PATH_TAG, SVG_D, SVG_PROPS_MAP } from '../constants';
import { shape2path } from '../shape2path';
import { FakeDocument } from './document';

export class FakeElement {
  _element: Element;
  _fakeDocument: FakeDocument;
  _appended: boolean = false;
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
    let propsChange = false;
    const type = this._tagName;
    if (type in SVG_PROPS_MAP) {
      const props = SVG_PROPS_MAP[type as keyof typeof SVG_PROPS_MAP];
      if (props.has(name)) {
        propsChange = true;
        this._props[name] = value;
      }
    }
    if (propsChange) {
      if (name === 'fill') {
        this._element.setAttribute(name, value);
      }
      if (!this._appended) {
        return;
      }
      this._applyProps();
    } else {
      this._element.setAttribute(name, value);
    }
  }
  removeAttribute(name: string) {
    let propsChanged = false;

    if (propsChanged) {
      if (!this._appended) {
        return;
      }
      this._applyProps();
    } else {
      this._element.removeAttribute(name);
    }
  }
  _applyProps() {
    const d = shape2path(
      this._tagName,
      this._props,
      this._fakeContainer._roughOptions
    );
    this._element.setAttribute(SVG_D, d);
  }
}

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

      if (typeof value === 'function') {
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
