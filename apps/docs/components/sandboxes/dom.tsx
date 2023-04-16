import { Sandbox } from './sandbox';

const css = /* css */ `
.dom-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 36px;
  border: 1px solid #13c2c2;
  border-radius: 6px;
  height: 150px;
  margin-bottom: 24px;
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
text {
  font-family: 'Caveat'!important;
}
`;

const code = /* js */ `
import { useEffect, useRef, useState } from 'react';
import { elementToSVG } from 'dom-to-svg';
import SVG from 'react-inlinesvg';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

export default function App() {
  const [svg, setSVG] = useState('');
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      const svgDocument = elementToSVG(ref.current);
      const svgString = new XMLSerializer().serializeToString(svgDocument)
      setSVG(svgString);
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
      <RoughSVG options={{seed: 2}}>
        <SVG src={svg} />
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
      editorHeight={550}
      dependencies={{
        'react-inlinesvg': '3.0.2',
        'dom-to-svg': '0.12.2',
      }}
      direction="vertical"
      font
    />
  );
};
