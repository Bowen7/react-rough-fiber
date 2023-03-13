import React, { PropsWithChildren, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createFakeElement } from "./fake";

export const ReactFreehand = ({ children }: PropsWithChildren) => {
  const ref = useRef<HTMLDivElement>(null);
  const [fakeContainer, setFakeContainer] = useState<HTMLDivElement | null>(
    null
  );
  useEffect(() => {
    if (ref.current) {
      setFakeContainer(
        createFakeElement(ref.current, ref.current) as any as HTMLDivElement
      );
    }
  }, []);

  return (
    <span ref={ref}>
      {fakeContainer && createPortal(children, fakeContainer)}
    </span>
  );
};
