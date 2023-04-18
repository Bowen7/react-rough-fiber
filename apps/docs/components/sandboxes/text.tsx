import { Sandbox } from './sandbox';
import { CAVEAT_FONT_URL } from '../constants';

const code = /* js */ `
import { useEffect, useState } from 'react';
import opentype from 'opentype.js';
import { RoughSVG } from 'react-rough-fiber';
import './style.css';

const TEXT = 'React Rough Fiber';
export default function App() {
  const [paths, setPaths] = useState([]);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let ignore = false;
    const loadSVG = async () => {
      const res = await fetch('${CAVEAT_FONT_URL}');
      const buffer = await res.arrayBuffer();
      if(ignore) return;
      const font = opentype.parse(buffer);
      const paths = font.getPaths(TEXT, 0, 100, 100).map((path) => path.toPathData());
      const width = font.getAdvanceWidth(TEXT, 100);
      setPaths(paths);
      setWidth(width);
    }
    loadSVG();
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <RoughSVG
      style={{ color: 'currentColor' }}
      options={{ roughness: 0 }}
    >
      <svg width="100%" viewBox={\`0 0 \${width + 25} 200\`} fill="#82ca9d" stroke="#8884d8" >
        {paths.map((d, i) => <path d={d} key={i} />)}
      </svg>
    </RoughSVG>
  );
}
`.trim();

export const TextSandbox = () => {
  return (
    <Sandbox
      code={code}
      editorHeight={600}
      previewHeight={200}
      dependencies={{
        'opentype.js': '1.3.4',
      }}
      direction="vertical"
      font
    />
  );
};
