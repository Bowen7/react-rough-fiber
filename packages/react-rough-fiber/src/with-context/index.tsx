import {
  useEffect,
  PropsWithChildren,
  useRef,
  useState,
  createElement,
} from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { FiberProvider, type ContextBridge, useContextBridge } from 'its-fine';
import { createRenderer } from '../renderer';
import { ReactRoughFiberProps } from '../types';

const ReactRoughFiberRenderer = ({
  containerType = 'div',
  children,
  roughOptions,
}: ReactRoughFiberProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountNodeRef = useRef<any>(null);
  const Bridge: ContextBridge = useContextBridge();
  const [Renderer] = useState(() => createRenderer(roughOptions));

  useEffect(() => {
    if (containerRef.current && !mountNodeRef.current) {
      mountNodeRef.current = Renderer.createContainer(
        containerRef.current,
        LegacyRoot,
        null,
        false,
        false,
        '',
        () => {},
        null
      );
    }
    if (mountNodeRef.current) {
      Renderer.updateContainer(
        <Bridge>{children}</Bridge>,
        mountNodeRef.current,
        null
      );
    }
  }, [children, Bridge, Renderer]);

  useEffect(() => {
    return () => {
      Renderer.updateContainer(null, mountNodeRef.current, null);
    };
  }, [Renderer]);

  return createElement(containerType, { ref: containerRef });
};

export const ReactRoughFiber = ({ children }: PropsWithChildren<{}>) => (
  <FiberProvider>
    <ReactRoughFiberRenderer>{children}</ReactRoughFiberRenderer>
  </FiberProvider>
);
