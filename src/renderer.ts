import React from "react";
import Reconciler, { HostConfig } from "react-reconciler";
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
    // @ts-ignore
    parentInstance.appendChild(child);
  },

  // @ts-ignore
  createInstance(type, props, rootContainerInstance) {
    return document.createElementNS("http://www.w3.org/2000/svg", type);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return text;
  },

  finalizeInitialChildren(domElement, type, props) {
    Object.keys(props).forEach((propName) => {
      const propValue = props[propName];

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

  now: () => {},

  supportsMutation: true,

  useSyncScheduling: true,

  appendChild(parentInstance, child) {
    // @ts-ignore
    parentInstance.appendChild(child);
  },

  appendChildToContainer(parentInstance, child) {
    // @ts-ignore
    parentInstance.appendChild(child);
  },

  removeChild(parentInstance, child) {
    // @ts-ignore
    parentInstance.removeChild(child);
  },

  removeChildFromContainer(parentInstance, child) {
    // @ts-ignore
    parentInstance.removeChild(child);
  },

  insertBefore(parentInstance, child, beforeChild) {
    // @ts-ignore
    parentInstance.insertBefore(child, beforeChild);
  },

  insertInContainerBefore(parentInstance, child, beforeChild) {
    // @ts-ignore
    parentInstance.insertBefore(child, beforeChild);
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
};

export const FreehandRenderer = Reconciler(hostConfig);
