import { Sandbox } from './sandbox';
import { ROBOTO_FONT_URL } from '../constants';

const code = /* js */ `
import { Suspense, useMemo } from 'react';
import opentype from 'opentype.js';
import { suspend } from 'suspend-react';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

const usePaths = (url, text) =>
  suspend(async () => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const font = opentype.parse(buffer);
    return [
      font.getPaths(text, 0, 100, 100).map((path) => path.toPathData()),
      font.getAdvanceWidth(text, 100),
    ];
  }, [url, text]);

const RoughText = () => {
  const [paths, width] = usePaths('${ROBOTO_FONT_URL}', 'React Rough Fiber');

  return (
    <RoughSVG
      style={{ color: 'currentColor' }}
      options={{ roughness: 1, simplification: 1 }}
    >
      <svg width={width} fill="#82ca9d" stroke="#8884d8" >
        {paths.map((d, i) => <path d={d} key={i} />)}
      </svg>
    </RoughSVG>
  );
};


export default function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RoughText />
    </Suspense>
  )
}
`.trim();

export const TextSandbox = () => {
  return (
    <Sandbox
      code={code}
      editorHeight={600}
      dependencies={{
        'suspend-react': '0.0.9',
        'opentype.js': '1.3.4',
      }}
      direction="vertical"
      font
    />
  );
};
