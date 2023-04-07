import { useMemo } from 'react';
import { Sandpack, SandpackSetup } from '@codesandbox/sandpack-react';

type Dependencies = SandpackSetup['dependencies'];
type Props = {
  code: string;
  dependencies?: Dependencies;
  editorHeight?: number;
  tailwind?: boolean;
  css?: boolean;
};

const baseDependencies: Dependencies = {
  'react-rough-fiber': 'latest',
  'react-reconciler': '^0.29.0',
};

const cssCode = /* css */ `
  @font-face {
    font-family: HandDrawnFont;
    src: url(${
      typeof location === 'undefined' ? '' : location.origin
    }/GloriaHallelujah-Regular.ttf);
  }
`;

export const Sandbox = ({
  code,
  dependencies,
  editorHeight = 300,
  tailwind = false,
  css = false,
}: Props) => {
  const files = useMemo(() => {
    return css ? { 'App.js': code, 'style.css': cssCode } : { 'App.js': code };
  }, [code, css]);
  return (
    <Sandpack
      theme="auto"
      template="react"
      options={{
        editorHeight,
        externalResources: tailwind ? ['https://cdn.tailwindcss.com'] : [],
      }}
      files={files}
      customSetup={{
        dependencies: {
          ...baseDependencies,
          ...dependencies,
        },
      }}
    />
  );
};
