import Reconciler from 'react-reconciler';
import { DefaultEventPriority } from 'react-reconciler/constants';
import {
  Instance,
  InstanceProps,
  HostContext,
  HostConfig,
  InstanceWithListeners,
  RoughOptions,
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
  const { namespace, inDefs } = hostContext;
  let domElement: Instance;
  if (namespace === SVG_NAMESPACE || type === 'svg') {
    // roughjs renders a shape as a fill path(if fill is not none) and a stroke path(if stroke is not none)
    // so we need to wrap the shape in a g element
    if (!inDefs && SVG_SHAPE_PROPS.hasOwnProperty(type)) {
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

export const createReconciler = (
  roughOptions: RoughOptions = {}
): [
  Reconciler.Reconciler<Instance, Instance, void, Instance, Instance>,
  (options: RoughOptions) => void
] => {
  let _roughOptions = roughOptions;

  const setRoughOptions = (options: RoughOptions) => {
    _roughOptions = options;
  };

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
    getRootHostContext: (root) => ({
      namespace: root.namespaceURI || '',
      inDefs: false,
    }),
    getChildHostContext: (parentHostContext, type) => {
      const { namespace, inDefs } = parentHostContext;
      if (type === 'svg') {
        return { namespace: SVG_NAMESPACE, inDefs };
      }
      if (namespace === SVG_NAMESPACE && type === 'foreignObject') {
        return { namespace: HTML_NAMESPACE, inDefs };
      }
      if (type === 'defs') {
        return { namespace, inDefs: true };
      }
      return parentHostContext;
    },
    finalizeInitialChildren(instance, type, props, rootContainer, { inDefs }) {
      diffProps(
        type,
        instance as InstanceWithListeners,
        props,
        {},
        _roughOptions,
        inDefs
      );
      return false;
    },
    prepareUpdate(
      _instance,
      _type,
      _oldProps,
      _newProps,
      _rootContainer,
      { inDefs }
    ) {
      return { inDefs };
    },
    commitUpdate(instance, { inDefs }, type, oldProps, newProps) {
      diffProps(
        type,
        instance as InstanceWithListeners,
        newProps,
        oldProps,
        _roughOptions,
        inDefs
      );
    },
    commitTextUpdate(textInstance, _oldText: string, newText: string): void {
      (<any>textInstance).nodeValue = newText;
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
  return [reconciler, setRoughOptions];
};
