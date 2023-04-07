import { useEffect, useRef, useState, createElement } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { createReconciler } from './renderer';
import { RoughSVGProps } from './types';

export const RoughSVG = ({
  containerType = 'div',
  children,
  roughOptions,
  ...restProps
}: RoughSVGProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountNodeRef = useRef<any>(null);
  const [[reconciler, setRoughOptions]] = useState(() =>
    createReconciler(roughOptions)
  );

  useEffect(() => {
    if (containerRef.current && !mountNodeRef.current) {
      mountNodeRef.current = reconciler.createContainer(
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
    roughOptions && setRoughOptions(roughOptions);
    if (mountNodeRef.current) {
      reconciler.updateContainer(children, mountNodeRef.current, null);
    }
  }, [children, reconciler, roughOptions]);

  useEffect(() => {
    return () => {
      reconciler.updateContainer(null, mountNodeRef.current, null);
    };
  }, [reconciler]);

  return createElement(containerType, { ref: containerRef, ...restProps });
};
