import { Sandbox } from './sandbox';
import { TWEMOJI_URL } from '../constants';

const code = /* js */ `
import { RoughSVG } from 'react-rough-fiber';
import SVG from 'react-inlinesvg';

const U200D = String.fromCharCode(0x200d)
const UFE0Fg = /\uFE0F/g
function toCodePoint(unicodeSurrogates, sep) {
  let r = [];
  let c = 0;
  let p = 0;
  let i = 0;
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
      p = 0;
    } else if (0xD800 <= c && c <= 0xDBFF) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join(sep || '-');
}

const Emoji = ({ emoji }) => {
  const HEXCodePoint = toCodePoint(
    emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji
  )
  const url = '${TWEMOJI_URL}' + '/' + HEXCodePoint + '.svg'
  return (
    <SVG src={url} width={128} />
  )
}

export default function App() {
  return (
    <RoughSVG options={{ seed: 2, hachureGap: 1, fillWeight: 0.5 }}>
      <Emoji emoji="😊" />
    </RoughSVG>
  );
}
`.trim();
export const EmojiSandbox = () => {
  return (
    <Sandbox
      code={code}
      dependencies={{
        'react-inlinesvg': '3.0.2',
      }}
      direction="vertical"
    />
  );
};
