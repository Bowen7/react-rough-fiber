import { Sandbox } from './sandbox';
import { CAVEAT_FONT_URL } from '../constants';

const jsxCode = /* js */ `
import { Suspense } from 'react';
import satori from 'satori/dist';
import SVG from 'react-inlinesvg';
import { suspend } from 'suspend-react';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

const useFont = (url) =>
  suspend(() => fetch(url).then((res) => res.arrayBuffer()), [url]);

const useSatori = (markup, options) =>
  suspend(() => satori(markup, options), []);

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


const RoughJSX = () => {
  const font = useFont('${CAVEAT_FONT_URL}');
  const svg = useSatori(
    markup,
    {
      width: 500,
      height: 300,
      fonts: [
        {
          name: ''Caveat'',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
      embedFont: false,
    }
  );

  return (
    <RoughSVG
      style={{ color: 'currentColor' }}
      roughOptions={{ roughness: 1, simplification: 1 }}
    >
      <SVG src={svg} />
    </RoughSVG>
  );
};

export default function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RoughJSX />
    </Suspense>
  )
}
`.trim();

export const JSXSandbox = () => {
  return (
    <Sandbox
      code={jsxCode}
      dependencies={{
        satori: '0.4.7',
        'suspend-react': '0.0.9',
        'react-inlinesvg': '^3.0.2',
      }}
      direction="vertical"
      font
    />
  );
};