import type { RoughOptions } from 'react-rough-fiber'
import { useState } from 'react'
import { RoughSVG } from 'react-rough-fiber'
import { Select } from '../playground/select'

const fillStyles = [
  'hachure',
  'solid',
  'zigzag',
  'cross-hatch',
  'dots',
  'dashed',
  'zigzag-line',
]
export function FilStyleDemo() {
  const [fillStyle, setFillStyle]
    = useState<RoughOptions['fillStyle']>('hachure')
  const onChange = (value: string) => {
    setFillStyle(value as RoughOptions['fillStyle'])
  }
  return (
    <>
      <Select
        value={fillStyle!}
        options={fillStyles}
        onChange={onChange}
        className="mt-4"
      />
      <RoughSVG options={{ fillStyle }}>
        <svg viewBox="0 0 64 64" width="128" height="128">
          <rect
            x={12}
            y={12}
            width={48}
            height={48}
            stroke="currentColor"
            fill="#82ca9d"
          />
        </svg>
      </RoughSVG>
    </>
  )
}
