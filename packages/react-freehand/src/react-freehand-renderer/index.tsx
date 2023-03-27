import { useEffect, PropsWithChildren } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { useNearestParent, FiberProvider } from 'its-fine';
import { Renderer } from './renderer';

const ReactFreehandRenderer = ({ children }: PropsWithChildren<{}>) => {
  const parentRef = useNearestParent<HTMLElement>();
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
      console.log(Renderer);
      Renderer.updateContainer(children, mountNode, null);
    }
    return () => {
      Renderer.updateContainer(null, mountNode, null);
    };
  }, []);
  return null;
};

export const ReactFreehand = ({ children }: PropsWithChildren<{}>) => (
  <FiberProvider>
    <ReactFreehandRenderer>{children}</ReactFreehandRenderer>
  </FiberProvider>
);
