import { useEffect, PropsWithChildren, useRef } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { FiberProvider, type ContextBridge, useContextBridge } from 'its-fine';
import { Renderer } from './renderer';

const ReactFreehandRenderer = ({ children }: PropsWithChildren<{}>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const mountNodeRef = useRef<any>(null);
  const Bridge: ContextBridge = useContextBridge();

  useEffect(() => {
    if (parentRef.current && !mountNodeRef.current) {
      mountNodeRef.current = Renderer.createContainer(
        parentRef.current,
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
  }, [children, Bridge]);

  useEffect(() => {
    return () => {
      Renderer.updateContainer(null, mountNodeRef.current, null);
    };
  }, []);
  return <div ref={parentRef} />;
};

export const ReactFreehand = ({ children }: PropsWithChildren<{}>) => (
  <FiberProvider>
    <ReactFreehandRenderer>{children}</ReactFreehandRenderer>
  </FiberProvider>
);
