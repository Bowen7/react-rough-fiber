import type { MutableRefObject } from 'react'
import type {
  HostConfig,
  HostContext,
  Instance,
  InstanceProps,
  InstanceWithRRF,
  Options,
} from './types'
import Reconciler from 'react-reconciler'
import * as ReactReconcilerConstants from 'react-reconciler/constants'
import {
  DATA_RRF_GROUP,
  HTML_NAMESPACE,
  SVG_NAMESPACE,
  SVG_SHAPE_MAP,
} from './constants'
import { diffProps } from './props'
import { isFun, isReact19 } from './utils'

const UPDATE_SIGNAL = {}

// @ts-expect-error for React 19
let currentUpdatePriority: number = ReactReconcilerConstants.NoEventPriority

function createInstance(type: string, _props: InstanceProps, root: Element, hostContext: HostContext) {
  const ownerDocument = root.ownerDocument
  const { namespace, inDefs } = hostContext
  let domElement: Instance
  if (namespace === SVG_NAMESPACE || type === 'svg') {
    // roughjs renders a shape as a fill path(if fill is not none) and a stroke path(if stroke is not none)
    // so we need to wrap the shape in a g element
    if (!inDefs && type in SVG_SHAPE_MAP) {
      domElement = ownerDocument.createElementNS(SVG_NAMESPACE, 'g')
      domElement.setAttribute(DATA_RRF_GROUP, '')
    }
    else {
      domElement = ownerDocument.createElementNS(SVG_NAMESPACE, type)
    }
  }
  else {
    domElement = ownerDocument.createElement(type)
  }
  (domElement as InstanceWithRRF)._rrf_inDefs = inDefs
  return domElement
}

function removeChild(parent: Instance, child: Instance) {
  return parent.removeChild(child)
}

function appendChild(parent: Instance, child: Instance) {
  return child && parent.appendChild(child)
}

function insertBefore(parent: Instance, child: Instance, beforeChild: Instance) {
  return parent.insertBefore(child, beforeChild)
}

export function createReconciler(optionsRef: MutableRefObject<Options>): Reconciler.Reconciler<Instance, Instance, void, Instance, Instance> {
  return Reconciler<
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
      container.appendChild(child as Instance)
    },
    removeChildFromContainer: (container, child) => {
      container.removeChild(child as Instance)
    },
    insertInContainerBefore: (container, child, beforeChild) => {
      container.insertBefore(child as Instance, beforeChild as Instance)
    },
    getRootHostContext: root => ({
      namespace: root.namespaceURI || '',
      inDefs: false,
    }),
    getChildHostContext: (parentHostContext, type) => {
      const { namespace, inDefs } = parentHostContext
      if (type === 'svg') {
        return { namespace: SVG_NAMESPACE, inDefs }
      }
      if (namespace === SVG_NAMESPACE && type === 'foreignObject') {
        return { namespace: HTML_NAMESPACE, inDefs }
      }
      if (type === 'defs') {
        return { namespace, inDefs: true }
      }
      return parentHostContext
    },
    finalizeInitialChildren(instance, type, props) {
      diffProps(
        type,
        instance as InstanceWithRRF,
        props,
        null,
        optionsRef.current,
      )
      return false
    },
    prepareUpdate(_instance, _type, _oldProps, _newProps, _rootContainer) {
      return UPDATE_SIGNAL
    },
    commitUpdate(...args) {
      let instance
      let type
      let oldProps
      let newProps
      let _
      if (isReact19()) {
        [instance, type, oldProps, newProps] = args
      }
      else {
        [instance, _, type, oldProps, newProps] = args
      }
      diffProps(
        type as string,
        instance as InstanceWithRRF,
        newProps,
        oldProps as InstanceProps | null,
        optionsRef.current,
      )
    },
    commitTextUpdate(textInstance, _oldText: string, newText: string): void {
      (<any>textInstance).nodeValue = newText
    },
    commitMount() {},
    getPublicInstance: (instance) => {
      if (instance?.hasAttribute(DATA_RRF_GROUP)) {
        const firstChild = instance.children[0]
        if (firstChild?.tagName === 'path') {
          return firstChild as SVGElement
        }
      }
      return instance!
    },
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
    getCurrentEventPriority: () => {
      return typeof currentUpdatePriority === 'number'
        ? currentUpdatePriority
        : ReactReconcilerConstants.DefaultEventPriority
    },
    beforeActiveInstanceBlur: () => {},
    afterActiveInstanceBlur: () => {},
    detachDeletedInstance: () => {},
    scheduleTimeout: (isFun(setTimeout) ? setTimeout : undefined) as any,
    cancelTimeout: (isFun(clearTimeout) ? clearTimeout : undefined) as any,
    getInstanceFromNode: () => null,
    prepareScopeUpdate: () => {},
    getInstanceFromScope: () => null,
    // @ts-expect-error these hooks are undocumented, remove @ts-ignore in the future
    setCurrentUpdatePriority: (newPriority: number) => {
      currentUpdatePriority = newPriority
    },
    getCurrentUpdatePriority: () => {
      return currentUpdatePriority
    },
    resolveUpdatePriority: () => {
      return (
        currentUpdatePriority || ReactReconcilerConstants.DefaultEventPriority
      )
    },
    shouldAttemptEagerTransition: () => false,
    requestPostPaintCallback: () => {},
    maySuspendCommit: () => false,
    preloadInstance: () => true,
    startSuspendingCommit: () => {},
    suspendInstance: () => {},
    waitForCommitToBeReady: () => null,
    NotPendingTransition: null,
    resetFormInstance: () => {},
  })
}
