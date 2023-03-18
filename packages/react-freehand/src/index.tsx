import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createFakeContainer, FakeContainer } from './fake';
import { shallowEqual } from './utils';
import { ReactFreehandProps } from './types';

export const ReactFreehand = (props: ReactFreehandProps) => {
  const {
    children,
    containerTag = 'div',
    roughOptions,
    shouldForceUpdateOnRoughOptionsChange = false,
    ...restProps
  } = props;
  const ref = useRef<Element>();
  const roughOptionsRef = useRef(roughOptions);
  const shouldForceUpdateOnRoughOptionsChangeRef = useRef(
    shouldForceUpdateOnRoughOptionsChange
  );
  const [fakeContainer, setFakeContainer] = useState<FakeContainer | null>(
    null
  );
  const fakeContainerRef = useRef(fakeContainer);

  useEffect(() => {
    if (shallowEqual(roughOptionsRef.current, roughOptions)) {
      fakeContainerRef.current &&
        fakeContainerRef.current._changeRoughOptions();
    }
    roughOptionsRef.current = roughOptions;
  }, [roughOptions]);

  useEffect(() => {
    if (ref.current) {
      const fakeContainer = createFakeContainer(
        ref.current,
        shouldForceUpdateOnRoughOptionsChangeRef.current
      );
      setFakeContainer(fakeContainer);
      fakeContainerRef.current = fakeContainer;
    }
  }, []);

  return React.createElement(
    containerTag,
    { ref, ...restProps },
    fakeContainer && createPortal(children, fakeContainer as unknown as Element)
  );
};

export default ReactFreehand;
