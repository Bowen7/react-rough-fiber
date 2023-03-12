import React from "react";
import Reconciler, { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { pointsOnPath } from "points-on-path";
import { getStroke } from "perfect-freehand";
import {
  Type,
  Props,
  Instance,
  Container,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
} from "./types";

const NO_CONTEXT = {};
const UPDATE_SIGNAL = {};

const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

function setStyles(domElement: SVGElement, styles: React.CSSProperties) {
  Object.keys(styles).forEach((name) => {
    const rawValue = styles[name as keyof React.CSSProperties];
    const isEmpty =
      rawValue === null || typeof rawValue === "boolean" || rawValue === "";

    if (isEmpty) {
      domElement.setAttribute("style", "");
    } else {
      domElement.setAttribute("style", rawValue as string);
    }
  });
}

function isEventName(propName: string) {
  return (
    propName.startsWith("on") && window.hasOwnProperty(propName.toLowerCase())
  );
}

const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout
> = {
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child as SVGElement);
  },

  createInstance(type, props, rootContainerInstance) {
    const instance = document.createElementNS(
      "http://www.w3.org/2000/svg",
      type
    );
    return instance;
  },

  createTextInstance(text: string) {
    return text;
  },

  finalizeInitialChildren(domElement, type, props) {
    Object.keys(props).forEach((propName) => {
      let propValue = props[propName];
      if (propName === "d") {
        const points = pointsOnPath(propValue)[0];
        const stroke = getStroke(points as any as number[][], {
          size: 1,
          thinning: 0.5,
          smoothing: 0.1,
          streamline: 0.15,
        });
        propValue = getSvgPathFromStroke(stroke);
      }
      if (propName === "style") {
        setStyles(domElement, propValue);
      } else if (propName === "children") {
        // Set the textContent only for literal string or number children, whereas
        // nodes will be appended in `appendChild`
        if (typeof propValue === "string" || typeof propValue === "number") {
          // @ts-ignore
          domElement.textContent = propValue;
        }
      } else if (propName === "className") {
        domElement.setAttribute("class", propValue);
      } else if (isEventName(propName)) {
        const eventName = propName.toLowerCase().replace("on", "");
        domElement.addEventListener(eventName, propValue);
      } else {
        domElement.setAttribute(propName, propValue);
      }
    });
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    return null;
  },
  resetAfterCommit() {},

  prepareUpdate(instance, type, oldProps, newProps) {
    return UPDATE_SIGNAL;
  },

  getRootHostContext(rootInstance) {
    return NO_CONTEXT;
  },
  getChildHostContext(parentHostContext, type) {
    return NO_CONTEXT;
  },

  shouldSetTextContent(type, props) {
    return (
      typeof props.children === "string" || typeof props.children === "number"
    );
  },

  supportsMutation: true,

  appendChild(parentInstance, child) {
    if ((child as SVGAElement).parentNode === parentInstance) {
      parentInstance.removeChild(child as SVGElement);
    }
    parentInstance.appendChild(child as SVGElement);
  },

  appendChildToContainer(parentInstance, child) {
    parentInstance.appendChild(child as SVGElement);
  },

  removeChild(parentInstance, child) {
    parentInstance.removeChild(child as SVGElement);
  },

  removeChildFromContainer(parentInstance, child) {
    parentInstance.removeChild(child as SVGElement);
  },

  insertBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child as SVGElement, beforeChild as SVGElement);
  },

  insertInContainerBefore(parentInstance, child, beforeChild) {
    parentInstance.insertBefore(child as SVGElement, beforeChild as SVGElement);
  },

  commitUpdate(
    domElement,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {},

  commitMount(domElement, type, newProps, internalInstanceHandle) {},

  commitTextUpdate(textInstance, oldText, newText) {},

  resetTextContent(domElement) {},

  clearContainer(container) {
    container.innerHTML = "";
  },

  detachDeletedInstance() {},

  supportsPersistence: false,

  preparePortalMount() {},

  scheduleTimeout: setTimeout,

  cancelTimeout: clearTimeout,

  noTimeout: -1,

  isPrimaryRenderer: false,

  getCurrentEventPriority() {
    return DefaultEventPriority;
  },

  getInstanceFromNode() {
    throw new Error("Not implemented.");
  },

  beforeActiveInstanceBlur() {},

  afterActiveInstanceBlur() {},

  prepareScopeUpdate() {},

  getInstanceFromScope() {
    return null;
  },

  supportsHydration: false,
};

export const FreehandRenderer = Reconciler(hostConfig);
