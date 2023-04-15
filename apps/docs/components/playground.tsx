import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { xml } from '@codemirror/lang-xml';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useTheme } from 'nextra-theme-docs';
import { RoughSVG } from 'react-rough-fiber';
import SVG from 'react-inlinesvg';
import JSXParser from 'react-jsx-parser';
import xmlFormat from 'xml-formatter';
import { EditorState } from '@codemirror/state';
import { ErrorBoundary } from 'react-error-boundary';

const jsxExtension = [javascript({ jsx: true })];
const xmlExtension = [xml()];
const readOnlyExtension = [xml(), EditorState.readOnly.of(true)];

const JSX_INITIAL_VALUE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24">
  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
  <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
</svg>
`.trim();
const SVG_INITIAL_VALUE = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-24 h-24">
  <path fill-rule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clip-rule="evenodd" />
  <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
</svg>
`.trim();

export const Playground = () => {
  const [lang, setLang] = useState<'jsx' | 'svg'>('svg');
  const [value, setValue] = useState(
    lang === 'jsx' ? JSX_INITIAL_VALUE : SVG_INITIAL_VALUE
  );
  const [output, setOutput] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? githubDark : githubLight;

  const onLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as 'jsx' | 'svg';
    setLang(lang);
    setValue(lang === 'jsx' ? JSX_INITIAL_VALUE : SVG_INITIAL_VALUE);
  };

  useEffect(() => {
    if (previewRef.current) {
      const preview = previewRef.current;
      try {
        if (lang === 'jsx') {
          setOutput(
            xmlFormat(preview.children[0].innerHTML, { indentation: '  ' })
          );
        } else {
          setOutput(xmlFormat(preview.innerHTML, { indentation: '  ' }));
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [value, lang]);

  return (
    <div className="mt-4">
      <select value={lang} onChange={onLangChange} className="mb-4">
        <option value="jsx">JSX</option>
        <option value="svg">SVG</option>
      </select>
      {lang === 'jsx' ? (
        <CodeMirror
          value={value}
          height="400px"
          theme={theme}
          extensions={jsxExtension}
          onChange={(value) => setValue(value)}
        />
      ) : (
        <CodeMirror
          value={value}
          height="400px"
          theme={theme}
          extensions={xmlExtension}
          onChange={(value) => setValue(value)}
        />
      )}
      <ErrorBoundary fallback={<div>Parsing error</div>}>
        <div className="flex px-4">
          <div className="flex-1">
            <p className="my-4">Input Preview:</p>
            {/* @ts-ignore */}
            {lang === 'jsx' ? <JSXParser jsx={value} /> : <SVG src={value} />}
          </div>
          <RoughSVG
            className="flex-1"
            options={{
              preserveVertices: true,
              hachureAngle: -43.50668311367565,
              hachureGap: 2.5,
              fillWeight: 1.2654732452735349,
              disableMultiStrokeFill: true,
              disableMultiStroke: true,
              roughness: 0,
            }}
          >
            <p className="my-4">Output Preview:</p>
            <div ref={previewRef}>
              {/* @ts-ignore */}
              {lang === 'jsx' ? <JSXParser jsx={value} /> : <SVG src={value} />}
            </div>
          </RoughSVG>
        </div>
      </ErrorBoundary>
      <p className="my-4">Output:</p>
      <CodeMirror
        value={output}
        height="400px"
        theme={theme}
        extensions={readOnlyExtension}
      />
    </div>
  );
};
