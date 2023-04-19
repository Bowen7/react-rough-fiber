import { useEffect, useRef, useState, useMemo } from 'react';
import hash from 'stable-hash';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { materialDark } from '@uiw/codemirror-theme-material';
import { RoughSVG, RoughOptions } from 'react-rough-fiber';
import SVG from 'react-inlinesvg';
import JSXParser from 'react-jsx-parser';
import xmlFormat from 'xml-formatter';
import { EditorState } from '@codemirror/state';

type Extension = typeof materialDark;
const readOnlyExtension = [xml(), EditorState.readOnly.of(true)];

type PreviewProps = {
  lang: 'jsx' | 'svg';
  value: string;
  theme: Extension;
  options: RoughOptions;
};
export const Preview = ({ lang, value, theme, options }: PreviewProps) => {
  const [output, setOutput] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const optionsID = useMemo(() => hash(options), [options]);

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
    <>
      <div className="flex px-4">
        <div className="flex-1">
          <p className="my-4">Input Preview:</p>
          {/* @ts-ignore */}
          {lang === 'jsx' ? <JSXParser jsx={value} /> : <SVG src={value} />}
        </div>
        <RoughSVG className="flex-1" options={options}>
          <p className="my-4">Output Preview:</p>
          <div ref={previewRef}>
            {lang === 'jsx' ? (
              // @ts-ignore
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
      />
    </>
  );
};
