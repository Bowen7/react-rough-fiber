import type { HTMLAttributes, PropsWithChildren } from 'react'
import type { Options as RoughOptions } from 'roughjs/bin/core'

export { RoughOptions }
export type Options =
  | RoughOptions
  | ((shape: SVGShape, props: HTMLAttributes<SVGElement>) => RoughOptions)

export interface InstanceProps {
  [name: string]: any
}
export type Instance = HTMLElement | SVGElement
export type TextInstance = void

export interface HostContext { namespace: string, inDefs: boolean }

export interface HostConfig {
  type: string
  props: InstanceProps
  container: Instance
  instance: Instance
  textInstance: TextInstance
  suspenseInstance: Instance
  hydratableInstance: Instance
  publicInstance: Instance
  hostContext: HostContext
  updatePayload: object
  childSet: never
  timeoutHandle: number | undefined
  noTimeout: -1
}

export interface Style { [name: string]: string | number }

export type InstanceWithRRF = Instance & {
  _rrf_listeners: { [name: string]: (e: Event) => void }
  _rrf_inDefs: boolean
}

export type SVGShape =
  | {
    type: 'path'
    d: string
  }
  | {
    type: 'circle'
    cx: number
    cy: number
    r: number
  }
  | {
    type: 'line'
    x1: number
    y1: number
    x2: number
    y2: number
  }
  | {
    type: 'rect'
    x: number
    y: number
    width: number
    height: number
  }
  | {
    type: 'ellipse'
    cx: number
    cy: number
    rx: number
    ry: number
  }
  | {
    type: 'polygon'
    points: string
  }
  | {
    type: 'polyline'
    points: string
  }
export type SVGShapeType = SVGShape['type']
export type SVGShapeProps = SVGShape & {
  fill?: string
  stroke?: string
  fillOpacity?: number
}

export type RoughSVGProps = PropsWithChildren<
  {
    containerType?: string
    options?: Options
  } & HTMLAttributes<HTMLOrSVGElement>
>

// TODO: More synthetic event attributes
export type RRFEvent = Event & {
  persist: () => void
}
