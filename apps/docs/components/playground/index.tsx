import type { PropsWithChildren } from 'react'
import type { RoughOptions } from 'react-rough-fiber'
import { javascript } from '@codemirror/lang-javascript'
import { xml } from '@codemirror/lang-xml'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import CodeMirror from '@uiw/react-codemirror'
import { useTheme } from 'nextra-theme-docs'
import { Component, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button } from './button'
import { OptionsForm } from './optionsForm'
import { Preview } from './preview'
import { Select } from './select'

const jsxExtension = [javascript({ jsx: true })]
const xmlExtension = [xml()]
const basicSetup = {
  lineNumbers: false,
}

const JSX_INITIAL_VALUE = /* jsx */ `
<svg xmlns="http://www.w3.org/2000/svg" width={120} height={120} fill="currentColor" stroke="currentColor">
  <path d="M46.575 37.92c14.4-18.505 36.9-30.42 62.175-30.42a3.75 3.75 0 0 1 3.75 3.75c0 25.28-11.915 47.775-30.42 62.18a33.75 33.75 0 0 1-33.33 39.07 3.75 3.75 0 0 1-3.75-3.75V88.095A79.19 79.19 0 0 1 31.91 75H11.25a3.75 3.75 0 0 1-3.75-3.75 33.75 33.75 0 0 1 39.075-33.33ZM75 33.75a11.25 11.25 0 1 0 0 22.5 11.25 11.25 0 0 0 0-22.5z" />
  <path d="M26.299 86.216a3.752 3.755 0 1 0-4.485-6.02 26.215 26.24 0 0 0-10.25 25.133 3.75 3.754 0 0 0 3.125 3.138 26.215 26.24 0 0 0 25.11-10.265 3.75 3.754 0 1 0-6.01-4.489 18.72 18.738 0 0 1-15.04 7.557c0-6.156 2.96-11.626 7.55-15.054z" />
</svg>
`.trim()

const SVG_INITIAL_VALUE = /* xml */ `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" stroke="currentColor">
  <path d="M46.575 37.92c14.4-18.505 36.9-30.42 62.175-30.42a3.75 3.75 0 0 1 3.75 3.75c0 25.28-11.915 47.775-30.42 62.18a33.75 33.75 0 0 1-33.33 39.07 3.75 3.75 0 0 1-3.75-3.75V88.095A79.19 79.19 0 0 1 31.91 75H11.25a3.75 3.75 0 0 1-3.75-3.75 33.75 33.75 0 0 1 39.075-33.33ZM75 33.75a11.25 11.25 0 1 0 0 22.5 11.25 11.25 0 0 0 0-22.5z" />
  <path d="M26.299 86.216a3.752 3.755 0 1 0-4.485-6.02 26.215 26.24 0 0 0-10.25 25.133 3.75 3.754 0 0 0 3.125 3.138 26.215 26.24 0 0 0 25.11-10.265 3.75 3.754 0 1 0-6.01-4.489 18.72 18.738 0 0 1-15.04 7.557c0-6.156 2.96-11.626 7.55-15.054z" />
</svg>
`.trim()

type ErrorBoundaryProps = PropsWithChildren<{
  value: string
}>
class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>): void {
    if (prevProps.value !== this.props.value) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>
    }

    return this.props.children
  }
}

const DEFAULT_OPTIONS: RoughOptions = {
  roughness: 1,
  bowing: 1,
  seed: 0,
  fillStyle: 'hachure',
  fillWeight: 1,
  hachureAngle: -41,
  hachureGap: 4,
  curveStepCount: 9,
  curveFitting: 0.95,
  disableMultiStroke: false,
  disableMultiStrokeFill: false,
  simplification: 0,
  dashOffset: 4,
  dashGap: 4,
  zigzagOffset: 4,
  preserveVertices: false,
}

export function Playground() {
  const [lang, setLang] = useState<'jsx' | 'svg'>('svg')
  const [value, setValue] = useState(
    lang === 'jsx' ? JSX_INITIAL_VALUE : SVG_INITIAL_VALUE,
  )

  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === 'dark' ? githubDark : githubLight

  const onLangChange = (value: string) => {
    const lang = value as 'jsx' | 'svg'
    setLang(lang)
    setValue(lang === 'jsx' ? JSX_INITIAL_VALUE : SVG_INITIAL_VALUE)
  }

  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const optionsText = useMemo(
    () => JSON.stringify(options, null, 2),
    [options],
  )

  return (
    <div className="mt-4">
      <OptionsForm options={options} onChange={setOptions} />
      <div className="flex gap-4 flex-wrap my-4 justify-end">
        <CopyToClipboard text={optionsText}>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Copy Options
          </Button>
        </CopyToClipboard>
        <Button
          className="hover:bg-accent hover:text-accent-foreground"
          onClick={() => setOptions(DEFAULT_OPTIONS)}
        >
          Reset
        </Button>
      </div>
      <Select
        value={lang}
        onChange={onLangChange}
        options={['svg', 'jsx']}
        className="mb-4 w-24"
        valueClassName="uppercase"
      />
      {lang === 'jsx'
        ? (
            <CodeMirror
              value={value}
              height="400px"
              theme={theme}
              extensions={jsxExtension}
              basicSetup={basicSetup}
              onChange={value => setValue(value)}
            />
          )
        : (
            <CodeMirror
              value={value}
              height="400px"
              theme={theme}
              extensions={xmlExtension}
              basicSetup={basicSetup}
              onChange={value => setValue(value)}
            />
          )}
      <ErrorBoundary value={value}>
        <Preview lang={lang} value={value} theme={theme} options={options} />
      </ErrorBoundary>
    </div>
  )
}
