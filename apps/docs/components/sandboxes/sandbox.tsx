import type {
  SandpackFiles,
  SandpackSetup,
} from '@codesandbox/sandpack-react'
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import { useTheme } from 'nextra-theme-docs'
import { useMemo } from 'react'
import { CAVEAT_FONT_URL } from '../constants'

type Dependencies = SandpackSetup['dependencies']
interface Props {
  code: string
  dependencies?: Dependencies
  editorHeight?: number
  previewHeight?: number
  font?: boolean
  direction?: 'horizontal' | 'vertical'
  cssCode?: string
}

const baseDependencies: Dependencies = {
  'react-rough-fiber': 'latest',
  'react-reconciler': '^0.29.0',
}

const fontCode = /* css */ `
@font-face {
  font-family: 'Caveat';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(${CAVEAT_FONT_URL}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`.trimStart()

export function Sandbox({
  code,
  dependencies,
  editorHeight = 300,
  previewHeight,
  font = false,
  direction = 'horizontal',
  cssCode,
}: Props) {
  const { resolvedTheme } = useTheme()
  const files = useMemo(() => {
    let css = font ? fontCode : ''
    css += cssCode || ''
    return css ? { 'App.js': code, 'style.css': css } : { 'App.js': code }
  }, [code, font, cssCode])

  const options = useMemo(() => {
    const classes: Record<string, string>
      = direction === 'vertical'
        ? {
            'sp-layout': '!block divide-y mt-6',
            'sp-stack': '!w-full',
            'sp-preview-container': 'pt-6',
          }
        : {
            'sp-layout': 'mt-6',
          }
    return {
      resizablePanels: direction === 'horizontal',
      classes,
    }
  }, [direction])
  return (
    <SandpackProvider
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      template="react"
      options={options}
      files={files as SandpackFiles}
      customSetup={{
        dependencies: {
          ...baseDependencies,
          ...dependencies,
        },
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor style={{ height: editorHeight }} />
        <SandpackPreview style={{ height: previewHeight || editorHeight }} />
      </SandpackLayout>
    </SandpackProvider>
  )
}
