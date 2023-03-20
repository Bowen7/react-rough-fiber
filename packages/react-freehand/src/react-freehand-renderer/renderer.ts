import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import { Instance, InstanceProps, HostContext, HostConfig } from './types';
import { SVG_NAMESPACE, HTML_NAMESPACE, INTERNAL_PROPS_KEY } from './constants';
import { updateFiberProps, getFiberProps } from './utils';
import { setInitialDOMProperties } from './properties';

export const createRenderer = () => {
  const createInstance = (
    type: string,
    props: InstanceProps,
    root: Element,
    hostContext: HostContext
  ) => {
    const ownerDocument = root.ownerDocument;
    const namespace = hostContext;
    let domElement: Instance;
    if (namespace === SVG_NAMESPACE || type === 'svg') {
      domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
    } else {
      domElement = ownerDocument.createElement(type);
    }
    updateFiberProps(domElement, props);
    return domElement;
  };

  const removeChild = (parent: Instance, child: Instance) =>
    parent.removeChild(child);

  const appendChild = (parent: Instance, child: Instance) =>
    parent.appendChild(child);

  const insertBefore = (
    parent: Instance,
    child: Instance,
    beforeChild: Instance
  ) => parent.insertBefore(child, beforeChild);

  const handleTextInstance = () =>
    console.warn('Text is not allowed in the react-freehand tree!');

  const reconciler = Reconciler<
    HostConfig['type'],
    HostConfig['props'],
    HostConfig['container'],
    HostConfig['instance'],
    HostConfig['textInstance'],
    HostConfig['suspenseInstance'],
    HostConfig['hydratableInstance'],
    HostConfig['publicInstance'],
    HostConfig['hostContext'],
    HostConfig['updatePayload'],
    HostConfig['childSet'],
    HostConfig['timeoutHandle'],
    HostConfig['noTimeout']
  >({
    createInstance,
    removeChild,
    appendChild,
    appendInitialChild: appendChild,
    insertBefore,
    supportsMutation: true,
    isPrimaryRenderer: false,
    supportsPersistence: false,
    supportsHydration: false,
    noTimeout: -1,
    appendChildToContainer: (container, child) => {
      container.appendChild(child as Instance);
    },
    removeChildFromContainer: (container, child) => {
      container.removeChild(child as Instance);
    },
    insertInContainerBefore: (container, child, beforeChild) => {
      container.insertBefore(child as Instance, beforeChild as Instance);
    },
    getRootHostContext: (root) => root.namespaceURI,
    getChildHostContext: (parentHostContext, type) => {
      if (type === 'svg') {
        return SVG_NAMESPACE;
      }
      if (parentHostContext === SVG_NAMESPACE && type === 'foreignObject') {
        return HTML_NAMESPACE;
      }
      return parentHostContext;
    },
    finalizeInitialChildren(instance, type, props) {
      setInitialDOMProperties(instance, props);
      return false;
    },
    // TODO
    prepareUpdate(instance, type, oldProps, newProps) {
      return null;
    },
    // TODO
    commitUpdate(instance, updatePayload, type, oldProps, newProps, fiber) {},
    commitMount(instance, _type, _props, _int) {},
    getPublicInstance: (instance) => instance!,
    prepareForCommit: () => null,
    preparePortalMount: () => {},
    resetAfterCommit: () => {},
    shouldSetTextContent: () => false,
    clearContainer: () => false,
    hideInstance() {},
    unhideInstance() {},
    createTextInstance: handleTextInstance,
    hideTextInstance: handleTextInstance,
    unhideTextInstance: handleTextInstance,
    getCurrentEventPriority: () => DefaultEventPriority,
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    detachDeletedInstance: (node) => {
      delete (node as any)[INTERNAL_PROPS_KEY];
    },
    scheduleTimeout: (typeof setTimeout === 'function'
      ? setTimeout
      : undefined) as any,
    cancelTimeout: (typeof clearTimeout === 'function'
      ? clearTimeout
      : undefined) as any,
    getInstanceFromNode: () => null,
    prepareScopeUpdate: () => {},
    getInstanceFromScope: () => null,
  });

  return reconciler;
};
