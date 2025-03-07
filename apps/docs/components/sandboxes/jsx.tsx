import { CAVEAT_FONT_URL } from '../constants'
import { Sandbox } from './sandbox'

const jsxCode = /* js */ `
import { useState, useEffect } from 'react';
import satori from 'satori/dist';
import SVG from 'react-inlinesvg';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

const markup = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontFamily: "'Caveat'",
      padding: '24px 36px',
      border: '1px solid #13c2c2',
      borderRadius: '6px',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        <span
          style={{
            border: '1px solid #eb2f96',
            padding: '5px 10px',
            borderRadius: '6px',
          }}
        >
          React Rough Fiber
        </span>
      </div>
      <p>A React renderer for rendering hand-drawn SVGs</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span
        style={{
          backgroundColor: '#ffa39e',
          color: '#000',
          padding: '6px 36px',
          borderRadius: '6px',
        }}
      >
        Go
      </span>
    </div>
  </div>
);

export default function App() {
  const [svg, setSVG] = useState('');
  useEffect(() => {
    let ignore = false;

    const loadSVG = async () => {
      const res = await fetch('${CAVEAT_FONT_URL}');
      const font = await res.arrayBuffer();
      const svg = await satori(markup, {
        width: 500,
        height: 300,
        fonts: [
          {
            name: "'Caveat'",
            data: font,
            weight: 400,
            style: 'normal',
          },
        ],
        embedFont: false,
      });
      if (ignore) return;
      setSVG(svg);
    }
    loadSVG();
    return () => {
      ignore = true;
    }
  }, [])
  return (
    <RoughSVG>
      <SVG src={svg} />
    </RoughSVG>
  )
}
`.trim()

export function JSXSandbox() {
  return (
    <Sandbox
      code={jsxCode}
      editorHeight={500}
      previewHeight={400}
      dependencies={{
        'satori': '0.4.7',
        'react-inlinesvg': '^3.0.2',
      }}
      direction="vertical"
      font
    />
  )
}
