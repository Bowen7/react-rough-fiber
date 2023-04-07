import { useState } from 'react';
import { RoughSVG, RoughOptions } from 'react-rough-fiber';
const fillStyles = [
  'hachure',
  'solid',
  'zigzag',
  'cross-hatch',
  'dots',
  'dashed',
  'zigzag-line',
];
export const FilStyleDemo = () => {
  const [fillStyle, setFillStyle] =
    useState<RoughOptions['fillStyle']>('hachure');
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFillStyle(e.target.value as RoughOptions['fillStyle']);
  };
  return (
    <>
      <select onChange={onChange} value={fillStyle}>
        {fillStyles.map((style) => (
          <option key={style}>{style}</option>
        ))}
      </select>
      <RoughSVG roughOptions={{ fillStyle }}>
        <svg viewBox="0 0 64 64" width="128" height="128">
          <rect
            x={12}
            y={12}
            width={48}
            height={48}
            stroke="#000"
            fill="#82ca9d"
          />
        </svg>
      </RoughSVG>
    </>
  );
};
