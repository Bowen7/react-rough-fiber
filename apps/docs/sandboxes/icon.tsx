import { Sandbox } from '../components/sandbox';

const reactFeatherCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import { Bell, Battery, Coffee, Twitter, Camera, Edit, Image } from "react-feather"
export default function App() {
  return (
    <RoughSVG roughOptions={{roughness: 0.6, seed: 2, bowing: 15}}>
      <Image size={48} />
    </RoughSVG>
  )
}
`.trim();
export const ReactFeatherSandbox = () => {
  return (
    <Sandbox
      code={reactFeatherCode}
      dependencies={{ 'react-feather': '^2.0.10' }}
      editorHeight={200}
    />
  );
};

// TODO
const antdCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import SmileFilled from '@ant-design/icons/SmileFilled';
export default function App() {
  return (
    <RoughSVG roughOptions={{roughness: 0.6, seed: 2, bowing: 15}}>
      <SmileFilled size={48} />
    </RoughSVG>
  )
}
`.trim();
export const AntdSandbox = () => {
  return (
    <Sandbox
      code={antdCode}
      dependencies={{ '@ant-design/icons': '4.2.1' }}
      editorHeight={200}
    />
  );
};

const heroiconsCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import { BeakerIcon } from '@heroicons/react/24/solid'
export default function App() {
  return (
    <RoughSVG roughOptions={{roughness: 0.6, seed: 2, bowing: 15}}>
      <BeakerIcon className="h-16 w-16" />
    </RoughSVG>
  )
}
`.trim();
export const HeroiconsSandbox = () => {
  return (
    <Sandbox
      code={heroiconsCode}
      dependencies={{ '@heroicons/react': '2.0.17' }}
      editorHeight={200}
      tailwind
    />
  );
};
