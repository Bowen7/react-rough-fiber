import { useEffect, useRef, useState, createElement } from 'react';
import { LegacyRoot } from 'react-reconciler/constants';
import { createRenderer } from './renderer';
import { RoughSVGProps } from './types';

export const RoughSVG = ({
  containerType = 'div',
  children,
  roughOptions,
}: RoughSVGProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountNodeRef = useRef<any>(null);
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
      Renderer.updateContainer(children, mountNodeRef.current, null);
    }
  }, [children, Renderer]);

  useEffect(() => {
    return () => {
      Renderer.updateContainer(null, mountNodeRef.current, null);
    };
  }, [Renderer]);

  return createElement(containerType, { ref: containerRef });
};
