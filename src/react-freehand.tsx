import React, { PropsWithChildren, useEffect, useRef } from "react";
import { LegacyRoot } from "react-reconciler/constants";
import { FreehandRenderer } from "./renderer";

export const ReactFreehand = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mountNode = FreehandRenderer.createContainer(
      // @ts-ignore
      ref.current,
      LegacyRoot,
      null,
      false,
      false,
      "",
      () => {},
      null
    );
    FreehandRenderer.updateContainer(children, mountNode, null);
    return () => {
      FreehandRenderer.updateContainer(null, mountNode, null);
    };
  }, []);
  return (
    // @ts-ignore
    <div ref={ref}>{children}</div>
  );
};
