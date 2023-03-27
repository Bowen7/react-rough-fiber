import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FakeCore } from './fake';
import { ReactFreehandProps } from './types';

export const ReactFreehand = (props: ReactFreehandProps) => {
  const {
    children,
    containerTag = 'div',
    options,
    shouldForceOptionsChange = false,
    ...restProps
  } = props;
  const ref = useRef<Element>();
  const shouldForceOptionsChangeRef = useRef(shouldForceOptionsChange);
  const [fakeCore, setFakeCore] = useState<FakeCore | null>(null);
  const fakeCoreRef = useRef(fakeCore);
  const roughOptionsRef = useRef(options);

  useEffect(() => {
    if (fakeCoreRef.current) {
      fakeCoreRef.current.updateRoughOptions(options);
    }
  }, [options]);

  useEffect(() => {
    if (ref.current) {
      const fakeCore = new FakeCore(
        ref.current,
        shouldForceOptionsChangeRef.current,
        roughOptionsRef.current
      );
      setFakeCore(fakeCore);
      fakeCoreRef.current = fakeCore;
    }
  }, []);

  return React.createElement(
    containerTag,
    { ref, ...restProps },
    fakeCore && createPortal(children, fakeCore.fakeContainer)
  );
};

export default ReactFreehand;
