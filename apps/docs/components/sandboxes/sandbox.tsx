import { useMemo } from 'react';
import { Sandpack, SandpackSetup, Classes } from '@codesandbox/sandpack-react';
import { useTheme } from 'nextra-theme-docs';
import { FONT_URL } from '../constants';

type Dependencies = SandpackSetup['dependencies'];
type Props = {
  code: string;
  dependencies?: Dependencies;
  editorHeight?: number;
  tailwind?: boolean;
  font?: boolean;
  direction?: 'horizontal' | 'vertical';
};

const baseDependencies: Dependencies = {
  'react-rough-fiber': '0.0.2-alpha.2',
  'react-reconciler': '^0.29.0',
};

const cssCode = /* css */ `
  @font-face {
    font-family: HandDrawnFont;
    src: url(${FONT_URL});
  }
`.trim();

export const Sandbox = ({
  code,
  dependencies,
  editorHeight = 300,
  font = false,
  direction = 'horizontal',
}: Props) => {
  const { resolvedTheme } = useTheme();
  const files = useMemo(() => {
    return font ? { 'App.js': code, 'style.css': cssCode } : { 'App.js': code };
  }, [code, font]);

  const options = useMemo(() => {
    const classes: Classes =
      direction === 'vertical'
        ? {
            'sp-layout': '!block divide-y mt-6',
            'sp-stack': '!w-full',
            'sp-preview-container': 'pt-6',
          }
        : {
            'sp-layout': 'mt-6',
          };
    return {
      editorHeight,
      resizablePanels: direction === 'horizontal',
      classes,
    };
  }, [direction, editorHeight]);
  return (
    <Sandpack
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      template="react"
      options={options}
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
