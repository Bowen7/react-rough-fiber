import { FakeElement, createElementProxyHandler } from './element';
import { FakeDocument, createFakeDocument } from './document';
import { RoughOptions } from '../types';
export const createFakeContainer = (
  container: Element,
  shouldForceUpdateOnRoughOptionsChange: boolean
) => {
  const fakeDocument = createFakeDocument(container);
  const fakeContainer = new FakeContainer(
    container,
    fakeDocument,
    shouldForceUpdateOnRoughOptionsChange
  );
  fakeDocument._setFakeContainer(fakeContainer);

  const handler = createElementProxyHandler<FakeContainer>(container);
  return new Proxy(fakeContainer, handler);
};

export class FakeContainer extends FakeElement {
  _elementSet: Set<FakeElement> = new Set();
  _roughOptions: RoughOptions = {};
  _shouldForceUpdateOnRoughOptionsChange: boolean;
  constructor(
    el: Element,
    fakeDocument: FakeDocument,
    shouldForceUpdateOnRoughOptionsChange: boolean
  ) {
    super(el, fakeDocument);
    this._shouldForceUpdateOnRoughOptionsChange =
      shouldForceUpdateOnRoughOptionsChange;
  }

  _intiRoughOptions(roughOptions: RoughOptions = {}) {
    this._roughOptions = roughOptions;
  }

  _changeRoughOptions(roughOptions: RoughOptions = {}) {
    this._roughOptions = roughOptions;
    if (this._shouldForceUpdateOnRoughOptionsChange) {
      this._forceUpdate();
    }
  }

  _forceUpdate() {
    this._elementSet.forEach((fakeElement) => {
      fakeElement._applyProps();
    });
  }

  _addFakeElement(fakeElement: FakeElement) {
    if (this._shouldForceUpdateOnRoughOptionsChange) {
      this._elementSet.add(fakeElement);
    }
  }

  _removeFakeElement(fakeElement: FakeElement) {
    if (this._shouldForceUpdateOnRoughOptionsChange) {
      this._elementSet.delete(fakeElement);
    }
  }
}
