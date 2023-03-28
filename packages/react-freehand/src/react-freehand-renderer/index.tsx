import { useEffect, PropsWithChildren, useRef } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { FiberProvider } from 'its-fine';
import { Renderer } from './renderer';

const ReactFreehandRenderer = ({ children }: PropsWithChildren<{}>) => {
  const parentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mountNode: any;
    if (parentRef.current) {
      mountNode = Renderer.createContainer(
        parentRef.current,
        LegacyRoot,
        null,
        false,
        false,
        '',
        () => {},
        null
      );
      Renderer.updateContainer(children, mountNode, null);
    }
    return () => {
      Renderer.updateContainer(null, mountNode, null);
    };
  }, []);
  return <div ref={parentRef} />;
};

export const ReactFreehand = ({ children }: PropsWithChildren<{}>) => (
  <FiberProvider>
    <ReactFreehandRenderer>{children}</ReactFreehandRenderer>
  </FiberProvider>
);
