import { HTMLAttributes } from 'react';
import { RoughOptions, RoughSVG, SVGShape } from 'react-rough-fiber';
import { textPaths } from '../demos/text';

const options = (
  { type }: SVGShape,
  props: HTMLAttributes<SVGElement>
): RoughOptions => {
  switch (type) {
    case 'rect':
      return {
        roughness: 0,
        fillStyle: 'dots',
        hachureGap: 20,
      };
    case 'path': {
      const dataIndex = props['data-index' as keyof HTMLAttributes<SVGElement>];
      if (dataIndex === undefined) {
        return {
          seed: 4,
          disableMultiStroke: true,
          roughness: 5,
        };
      }
      if (dataIndex >= 5 && dataIndex < 10) {
        return {
          roughness: 0,
          fillStyle: 'solid',
        };
      }
      return {
        roughness: 0,
        hachureGap: 4,
        fillWeight: 2,
      };
    }
    default:
      return {};
  }
};

export const OG = () => {
  return (
    <>
      <RoughSVG
        options={options}
        style={{
          transform: 'scale(0.5)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 760 315"
          width="1300"
          height="630"
          fill="#82ca9d"
          stroke="currentColor"
          strokeOpacity={0.5}
        >
          <rect width={760} height={315} stroke="none" fill="currentColor" />
          <g transform="translate(0, 35)">
            <g transform="translate(60, 25)">
              {textPaths.map((d, i) => (
                <path d={d} key={i} data-index={i} />
              ))}
            </g>
            <path
              d="M 275 150 L 505 150"
              stroke="#82ca9d"
              fill="none"
              strokeOpacity={1}
              strokeWidth={4}
            />
            <path
              d="M 505 150 L 275 150"
              stroke="#82ca9d"
              fill="none"
              strokeOpacity={1}
              strokeWidth={4}
            />
            <text
              stroke="#82ca9d"
              strokeOpacity={1}
              x={110}
              y={200}
              fontSize={24}
            >
              A React renderer for rendering hand-drawn SVGs
            </text>
          </g>
        </svg>
      </RoughSVG>
    </>
  );
};
