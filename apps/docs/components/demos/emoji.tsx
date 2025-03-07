import SVG from 'react-inlinesvg'
import { TWEMOJI_URL } from '../constants'
import { Comparison } from './comparison'

const U200D = String.fromCharCode(0x200D)
const UFE0Fg = /\uFE0F/g
function toCodePoint(unicodeSurrogates: string, sep?: string) {
  const r = []
  let c = 0
  let p = 0
  let i = 0
  while (i < unicodeSurrogates.length) {
    c = unicodeSurrogates.charCodeAt(i++)
    if (p) {
      r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16))
      p = 0
    }
    else if (c >= 0xD800 && c <= 0xDBFF) {
      p = c
    }
    else {
      r.push(c.toString(16))
    }
  }
  return r.join(sep || '-')
}

interface EmojiProps {
  emoji: string
  width?: number
}
export function Emoji({ emoji, width = 48 }: EmojiProps) {
  const HEXCodePoint = toCodePoint(
    !emoji.includes(U200D) ? emoji.replace(UFE0Fg, '') : emoji,
  )
  const url = `${TWEMOJI_URL}/${HEXCodePoint}.svg`
  return (
    <SVG src={url} width={width} loader={<img src={url} width={48} />}></SVG>
  )
}

export function EmojiDemo() {
  return (
    <Comparison options={{ seed: 2, hachureGap: 1, fillWeight: 0.5 }}>
      <Emoji emoji="😊" />
      <Emoji emoji="😜" />
      <Emoji emoji="😈" />
    </Comparison>
  )
}
