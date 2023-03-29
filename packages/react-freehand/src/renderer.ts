import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import {
  Instance,
  InstanceProps,
  HostContext,
  HostConfig,
  InstanceWithListeners,
} from './types';
import { SVG_NAMESPACE, HTML_NAMESPACE, SVG_SHAPE_PROPS } from './constants';
import { isFun } from './utils';
import { diffProps } from './props';

const createInstance = (
  type: string,
  _props: InstanceProps,
  root: Element,
  hostContext: HostContext
) => {
  const ownerDocument = root.ownerDocument;
  const namespace = hostContext;
  let domElement: Instance;
  if (namespace === SVG_NAMESPACE || type === 'svg') {
    if (SVG_SHAPE_PROPS.hasOwnProperty(type)) {
      type = 'g';
    }
    domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type);
  } else {
    domElement = ownerDocument.createElement(type);
  }
  return domElement;
};

const removeChild = (parent: Instance, child: Instance) =>
  parent.removeChild(child);

const appendChild = (parent: Instance, child: Instance) =>
  child && parent.appendChild(child);

const insertBefore = (
  parent: Instance,
  child: Instance,
  beforeChild: Instance
) => parent.insertBefore(child, beforeChild);

export const Renderer = Reconciler<
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
    diffProps(type, instance as InstanceWithListeners, props, {});
    return false;
  },
  prepareUpdate() {
    return null;
  },
  commitUpdate(instance, _updatePayload, type, oldProps, newProps) {
    diffProps(type, instance as InstanceWithListeners, newProps, oldProps);
  },
  commitMount() {},
  getPublicInstance: (instance) => instance!,
  prepareForCommit: () => null,
  preparePortalMount: () => {},
  resetAfterCommit: () => {},
  shouldSetTextContent: () => false,
  clearContainer: () => false,
  hideInstance() {},
  unhideInstance() {},
  createTextInstance: (text, container) =>
    container.ownerDocument.createTextNode(text),
  hideTextInstance: () => {},
  unhideTextInstance: () => {},
  getCurrentEventPriority: () => DefaultEventPriority,
  beforeActiveInstanceBlur: () => {},
  afterActiveInstanceBlur: () => {},
  detachDeletedInstance: () => {},
  scheduleTimeout: (isFun(setTimeout) ? setTimeout : undefined) as any,
  cancelTimeout: (isFun(clearTimeout) ? clearTimeout : undefined) as any,
  getInstanceFromNode: () => null,
  prepareScopeUpdate: () => {},
  getInstanceFromScope: () => null,
});
