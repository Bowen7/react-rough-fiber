import type { ContextBridge } from 'its-fine'
import type { RoughSVGProps } from './types'
import { FiberProvider, useContextBridge } from 'its-fine'
import { RoughSVG } from './roughSVG'

function WithBridgeRoughSVG({ children, ...restProps }: RoughSVGProps) {
  const Bridge: ContextBridge = useContextBridge()
  return (
    <RoughSVG {...restProps}>
      <Bridge>{children}</Bridge>
    </RoughSVG>
  )
}

export function WCRoughSVG(props: RoughSVGProps) {
  return (
    <FiberProvider>
      <WithBridgeRoughSVG {...props} />
    </FiberProvider>
  )
}
