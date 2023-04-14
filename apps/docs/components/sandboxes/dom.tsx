import { Sandbox } from './sandbox';

const css = /* css */ `
.dom-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: HandDrawnFont;
  padding: 24px 36px;
  border: 1px solid #13c2c2;
  border-radius: 6px;
  height: 150px;
}
.title {
  border: 1px solid #eb2f96;
  padding: 5px 10px;
  border-radius: 6px;
}
.button-container {
  text-align: center;
}
.button {
  background-color: #ffa39e;
  color: #000;
  padding: 6px 36px;
  border-radius: 6px;
}
`;

const code = /* js */ `
import { useEffect, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import SVG from 'react-inlinesvg';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

export default function App() {
  const [svg, setSVG] = useState('');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      htmlToImage.toSvg(ref.current).then((dataUrl) => {
        const svg = decodeURIComponent(dataUrl.split(',')[1])
        console.log(svg)
      });
    }
  }, [])
  return (
    <>
      <div className="dom-container" ref={ref}>
        <div>
          <span className="title">
            React Rough Fiber
          </span>
          <p>A React renderer for rendering hand-drawn SVGs</p>
        </div>
        <div className="button-container">
          <span className="button">
            Go
          </span>
        </div>
      </div>
      <RoughSVG
        style={{ color: 'currentColor' }}
        roughOptions={{ roughness: 1, simplification: 1 }}
      >
        <SVG src={""} />
      </RoughSVG>
    </>
  );
}
`.trim();

export const DOMSandbox = () => {
  return (
    <Sandbox
      code={code}
      cssCode={css}
      editorHeight={500}
      dependencies={{
        'react-inlinesvg': '3.0.2',
        'html-to-image': '1.11.11',
      }}
      direction="vertical"
      font
    />
  );
};
