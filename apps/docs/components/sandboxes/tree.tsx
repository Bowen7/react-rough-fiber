import { Sandbox } from './sandbox';

const css = /* css */ `
svg {
  font-family: 'Caveat';
  font-size: 28px;
}
`.trim();

const code = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import Tree from 'react-d3-tree';
import './style.css';

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      children: [
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

const options = ({ type }) => {
  if (type === 'path') {
    return {
      fill: 'none',
      roughness: 3,
      disableMultiStroke: true,
    }
  }
  return {
    hachureGap: 4,
    disableMultiStroke: true,
  }
}

export default function App() {
  return (
    <RoughSVG options={options}>
      <div style={{ width: '100%', height: '500px' }}>
        <Tree data={orgChart} translate={{x: 50, y: 200}} fill="none"/>
      </div>
    </RoughSVG>
  );
}
`.trim();

export const TreeSandbox = () => {
  return (
    <Sandbox
      code={code}
      cssCode={css}
      editorHeight={600}
      previewHeight={500}
      dependencies={{
        'react-d3-tree': '3.5.2',
      }}
      direction="vertical"
      font
    />
  );
};
