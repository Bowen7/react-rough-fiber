import { FiberProvider, type ContextBridge, useContextBridge } from 'its-fine';
import { RoughSVGProps } from './types';
import { RoughSVG } from './roughSVG';

const WithBridgeRoughSVG = ({ children, ...restProps }: RoughSVGProps) => {
  const Bridge: ContextBridge = useContextBridge();
  return (
    <RoughSVG {...restProps}>
      <Bridge>{children}</Bridge>
    </RoughSVG>
  );
};

export const WCRoughSVG = (props: RoughSVGProps) => {
  return (
    <FiberProvider>
      <WithBridgeRoughSVG {...props} />
    </FiberProvider>
  );
};
