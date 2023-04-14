import { Sandbox } from './sandbox';

const visxCode = /* js */ `
import { Suspense, useMemo, Fragment } from 'react';
import { RoughSVG } from 'react-rough-fiber';
import { AlbersUsa } from '@visx/geo';
import { suspend } from 'suspend-react';
import * as topojson from 'topojson-client';

const background = '#EBF4F3';
const colors = ['#744DCA', '#3D009C', '#9020FF', '#C630FD'];
const topoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const useTopo = (url) =>
  suspend(() => fetch(url).then((res) => res.json()), [url]);

const RoughMap = ({ width, height }) => {
  const topology = useTopo(topoUrl);
  const { features: unitedStates } = useMemo(() => topojson.feature(topology, topology.objects.states), [topology]);

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width + height) / 1.55;

  return (
    <RoughSVG>
      <svg width={width} height={height} style={{ background, borderRadius: '14px' }}>
        <AlbersUsa
          data={unitedStates}
          scale={scale}
          translate={[centerX, centerY - 25]}
        >
          {({ features }, i) =>
            features.map(({ path }, i) => (
                <path
                  key={'map-feature-' + i}
                  d={path || ''}
                  fill={colors[i % 4]}
                  stroke={background}
                  strokeWidth={0.5}
                />
              )
            )
          }
        </AlbersUsa>
      </svg>
    </RoughSVG>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <RoughMap width={900} height={500} />
    </Suspense>
  )
}
`.trim();

export const VisxSandbox = () => {
  return (
    <Sandbox
      code={visxCode}
      editorHeight={600}
      dependencies={{
        'suspend-react': '0.0.9',
        'topojson-client': '3.1.0',
        '@visx/geo': '3.0.0',
      }}
      direction="vertical"
    />
  );
};
