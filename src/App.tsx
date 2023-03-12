import { useState, useRef, useEffect, createElement } from "react";
import { createPortal } from "react-dom";
import { Camera } from "react-feather";
import { ReactFreehand } from "./react-freehand";

const createFakeElement = (element: Element) => {
  const fakeElement = new FakeElement(element);
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
  };
  return new Proxy(fakeElement, handler);
};

const getFakeDocument = (ownerDocument: Document) => ({
  createElementNS: (ns: string, type: string) => {
    const el = ownerDocument.createElementNS(ns, type);
    return createFakeElement(el);
  },
  addEventListener(event: string, callback: () => void) {
    ownerDocument.addEventListener(event, callback);
  },
});

class FakeElement {
  _fake_element: Element;
  constructor(el: Element) {
    this._fake_element = el;
  }
  get ownerDocument() {
    return getFakeDocument(this._fake_element.ownerDocument);
  }
  appendChild(child: Element | FakeElement) {
    if (child instanceof FakeElement) {
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
}

const fakeElement = createFakeElement(document.createElement("div"));

// console.log(person.addEventListener);
function App() {
  const ref = useRef<SVGPathElement>(null);
  const onRef = (ref: HTMLDivElement) => {
    if (ref) {
      ref.appendChild(fakeElement._fake_element);
    }
  };

  useEffect(() => {
    console.log(ref.current?.getBoundingClientRect());
  });
  return (
    <div>
      {/* <ReactFreehand> */}
      {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg> */}
      <div ref={onRef}></div>
      {fakeElement &&
        createPortal(
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              ref={ref}
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            ></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>,
          fakeElement as any as Element
        )}
      {/* </ReactFreehand> */}
    </div>
  );
}

export default App;
