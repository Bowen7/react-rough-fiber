import SVG from 'react-inlinesvg';
import { TWEMOJI_URL } from './constants';
import { Comparison } from './comparison';

const U200D = String.fromCharCode(0x200d);
const UFE0Fg = /\uFE0F/g;
function toCodePoint(unicodeSurrogates: string, sep?: string) {
  let r = [];
  let c = 0;
  let p = 0;
  let i = 0;
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++);
    if (p) {
      r.push((0x10000 + ((p - 0xd800) << 10) + (c - 0xdc00)).toString(16));
      p = 0;
    } else if (0xd800 <= c && c <= 0xdbff) {
      p = c;
    } else {
      r.push(c.toString(16));
    }
  }
  return r.join(sep || '-');
}

type EmojiProps = {
  emoji: string;
  width?: number;
};
export const Emoji = ({ emoji, width = 48 }: EmojiProps) => {
  const HEXCodePoint = toCodePoint(
    emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji
  );
  const url = TWEMOJI_URL + '/' + HEXCodePoint + '.svg';
  return (
    <SVG src={url} width={width} loader={<img src={url} width={48} />}></SVG>
  );
};

export const EmojiDemo = () => {
  return (
    <Comparison options={{ seed: 2, hachureGap: 1, fillWeight: 0.5 }}>
      <Emoji emoji="😊" />
      <Emoji emoji="😜" />
      <Emoji emoji="😈" />
    </Comparison>
  );
};
