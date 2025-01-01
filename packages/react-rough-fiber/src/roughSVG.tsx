import { useEffect, useRef, useState, createElement } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { createReconciler } from './renderer';
import { RoughSVGProps, Options } from './types';

export const RoughSVG = ({
  containerType = 'div',
  children,
  options = {},
  ...restProps
}: RoughSVGProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountNodeRef = useRef<any>(null);
  const optionsRef = useRef<Options>(options);
  const [reconciler] = useState(() => createReconciler(optionsRef));

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
        null,
      );
    }
    optionsRef.current = options || {};
    if (mountNodeRef.current) {
      reconciler.updateContainer(children, mountNodeRef.current, null);
    }
  }, [children, reconciler, options]);

  useEffect(() => {
    return () => {
      reconciler.updateContainer(null, mountNodeRef.current, null);
    };
  }, [reconciler]);

  return createElement(containerType, { ref: containerRef, ...restProps });
};
