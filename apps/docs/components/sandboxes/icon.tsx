import { Sandbox } from './sandbox'

const reactFeatherCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import { Bell, Battery, Coffee, Twitter, Camera, Edit, Image } from "react-feather"
export default function App() {
  return (
    <RoughSVG options={{roughness: 0.6, seed: 2, bowing: 15}}>
      <Image size={48} />
    </RoughSVG>
  )
}
`.trim()
export function ReactFeatherSandbox() {
  return (
    <Sandbox
      code={reactFeatherCode}
      dependencies={{
        'react-feather': '^2.0.10',
        'use-animation-frame': '0.1.5',
      }}
      editorHeight={200}
    />
  )
}

const antdCode = /* js */ `
import { useState, useRef } from 'react';
import { RoughSVG } from 'react-rough-fiber';
import AlertOutlined from '@ant-design/icons/AlertOutlined';
import useAnimationFrame from 'use-animation-frame';
export default function App() {
  const [seed, setSeed] = useState(0);
  useAnimationFrame(({ time }) => {
    setSeed(Math.floor(time / 0.5));
  });
  return (
    <RoughSVG options={{roughness: 8, seed, fillStyle: 'solid'}}>
      <AlertOutlined style={{fontSize: '64px'}} />
    </RoughSVG>
  )
}
`.trim()
export function AntdSandbox() {
  return (
    <Sandbox
      code={antdCode}
      dependencies={{
        '@ant-design/icons': '4.2.1',
        'use-animation-frame': '0.1.5',
      }}
      editorHeight={200}
    />
  )
}

const heroiconsCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import { MoonIcon } from '@heroicons/react/24/solid'
export default function App() {
  return (
    <RoughSVG options={{roughness: 0, fillStyle: 'dashed', dashOffset: 1, dashGap: 0.5, hachureGap: 2}}>
      <MoonIcon style={{ width: '64px', height: '64px', color: '#ffa940'}} />
    </RoughSVG>
  )
}
`.trim()
export function HeroiconsSandbox() {
  return (
    <Sandbox
      code={heroiconsCode}
      dependencies={{ '@heroicons/react': '2.0.17' }}
      editorHeight={200}
    />
  )
}
