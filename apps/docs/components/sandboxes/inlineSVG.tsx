import { Sandbox } from './sandbox'

const remoteSVGCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import SVG from 'react-inlinesvg';
export default function App() {
  return (
    <RoughSVG options={{seed: 2, fillStyle: 'dashed', dashOffset: 5, dashGap: 5, hachureGap: 5}}>
      <SVG
        src="https://cdn.svgporn.com/logos/react.svg"
        width={256}
        height="auto"
        title="React"
      />
    </RoughSVG>
  )
}
`.trim()
export function RemoteSVGSandbox() {
  return (
    <Sandbox
      code={remoteSVGCode}
      dependencies={{
        'react-inlinesvg': '3.0.2',
      }}
      direction="vertical"
    />
  )
}

const inlineSVGCode = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import SVG from 'react-inlinesvg';
const markup = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
export default function App() {
  return (
    <RoughSVG options={{roughness: 0.5, bowing: 15}}>
      <SVG
        src={markup}
        width={126}
        height="auto"
      />
    </RoughSVG>
  )
}
`.trim()
export function InlineSVGSandbox() {
  return (
    <Sandbox
      code={inlineSVGCode}
      previewHeight={200}
      dependencies={{
        'react-inlinesvg': '3.0.2',
      }}
      direction="vertical"
    />
  )
}
