import type { githubDark } from '@uiw/codemirror-theme-github'
import type { RoughOptions } from 'react-rough-fiber'
import { xml } from '@codemirror/lang-xml'
import { EditorState } from '@codemirror/state'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useMemo, useRef, useState } from 'react'
import SVG from 'react-inlinesvg'
import JSXParser from 'react-jsx-parser'
import { RoughSVG } from 'react-rough-fiber'
import hash from 'stable-hash'
import xmlFormat from 'xml-formatter'

type Extension = typeof githubDark
const readOnlyExtension = [xml(), EditorState.readOnly.of(true)]
const basicSetup = {
  lineNumbers: false,
}

interface PreviewProps {
  lang: 'jsx' | 'svg'
  value: string
  theme: Extension
  options: RoughOptions
}
export function Preview({ lang, value, theme, options }: PreviewProps) {
  const [output, setOutput] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const optionsID = useMemo(() => hash(options), [options])

  useEffect(() => {
    if (previewRef.current) {
      const preview = previewRef.current
      try {
        if (lang === 'jsx') {
          setOutput(
            xmlFormat(preview.children[0].innerHTML, { indentation: '  ' }),
          )
        }
        else {
          setOutput(xmlFormat(preview.innerHTML, { indentation: '  ' }))
        }
      }
      catch (error) {
        console.error(error)
      }
    }
  }, [value, lang])
  return (
    <>
      <div className="flex px-4">
        <div className="flex-1">
          <p className="my-4">Input Preview:</p>
          {/* @ts-expect-error react version */}
          {lang === 'jsx' ? <JSXParser jsx={value} /> : <SVG src={value} />}
        </div>
        <RoughSVG className="flex-1" options={options}>
          <p className="my-4">Output Preview:</p>
          <div ref={previewRef}>
            {lang === 'jsx' ? (
              // @ts-expect-error react version
              <JSXParser jsx={value} />
            ) : (
              <SVG src={value} key={optionsID} />
            )}
          </div>
        </RoughSVG>
      </div>
      <p className="my-4">Output:</p>
      <CodeMirror
        value={output}
        height="400px"
        theme={theme}
        extensions={readOnlyExtension}
        basicSetup={basicSetup}
      />
    </>
  )
}
