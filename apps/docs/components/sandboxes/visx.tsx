import { Sandbox } from './sandbox'

const visxCode = /* js */ `
import { useState, useEffect } from 'react';
import { RoughSVG } from 'react-rough-fiber';
import { AlbersUsa } from '@visx/geo';
import * as topojson from 'topojson-client';

const colors = ['#f4d35e', '#f5cac3', '#a8dadc', '#457b9d'];
const fillStyles = ['solid', 'hachure', 'zigzag', 'cross-hatch', 'dashed', 'zigzag-line']
const topoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
const width = 800;
const height = 500;

const random = (candidates) =>
  candidates[Math.floor(Math.random() * candidates.length)];

const options = () => {
  return {
    hachureGap: 4,
    hachureAngle: Math.random() * 360,
    fillStyle: random(fillStyles),
  }
}

export default function App() {
  const [unitedStates, setUnitedStates] = useState([]);

  useEffect(() => {
    let ignore = false;
    const loadUnitedStates = async () => {
      const res = await fetch(topoUrl);
      const topology = await res.json();
      if (ignore) return;
      const { features: unitedStates } = topojson.feature(topology, topology.objects.states);
      setUnitedStates(unitedStates);
    }
    loadUnitedStates();
    return () => {
      ignore = true;
    }
  }, [])

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width + height) / 1.55;

  return (
    <RoughSVG options={options}>
      <svg viewBox={\`0 0 \${width} \${height}\`} width="100%">
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
                  stroke={'#666'}
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
`.trim()

export function VisxSandbox() {
  return (
    <Sandbox
      code={visxCode}
      editorHeight={600}
      dependencies={{
        'topojson-client': '3.1.0',
        '@visx/geo': '3.0.0',
      }}
      direction="vertical"
    />
  )
}
