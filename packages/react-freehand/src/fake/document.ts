import { FakeElement, createFakeElement } from './element';
import { FakeContainer } from './container';
import { SVG_PATH_TAG, SVG_D, SVG_PROPS_MAP } from '../constants';

export type FakeDocument = {
  createElementNS: (ns: string, type: string) => FakeElement;
  createElement: (type: string) => FakeElement;
  _setFakeContainer: (container: FakeContainer) => void;
  _getFakeContainer: () => FakeContainer;
};

export const createFakeDocument = (container: Element) => {
  const realOwnerDocument = container.ownerDocument;
  let fakeContainer: FakeContainer;

  const doc: FakeDocument = {
    createElementNS: (ns: string, type: string) => {
      if (type.toLowerCase() in SVG_PROPS_MAP) {
        const el = realOwnerDocument.createElementNS(ns, SVG_PATH_TAG);
        const fakeElement = createFakeElement(el, fakeDocument, type);
        fakeContainer._addFakeElement(fakeElement);
        return fakeElement;
      } else {
        return createFakeElement(
          realOwnerDocument.createElementNS(ns, type),
          fakeDocument,
          type
        );
      }
    },
    createElement: (type: string) => {
      const el = realOwnerDocument.createElement(type);
      return createFakeElement(el, fakeDocument);
    },
    _setFakeContainer: (fContainer: FakeContainer) => {
      fakeContainer = fContainer;
    },
    _getFakeContainer() {
      return fakeContainer;
    },
  };

  const fakeDocument = new Proxy(doc, {
    get(target: FakeDocument, prop: string) {
      const value =
        prop in target
          ? target[prop as keyof FakeDocument]
          : realOwnerDocument[prop as keyof typeof realOwnerDocument];

      if (typeof value === 'function') {
        return prop in target
          ? value.bind(target)
          : value.bind(realOwnerDocument);
      }
      return value;
    },
  });
  return fakeDocument;
};
