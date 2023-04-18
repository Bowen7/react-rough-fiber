import { useState } from 'react';
import { RoughOptions } from 'react-rough-fiber';
import { Range } from './range';
import { Select } from './select';
import { Toggle } from './toggle';
import { Input } from './input';

type RangeField = {
  key: keyof RoughOptions;
  min: number;
  max: number;
};

type SelectField = {
  key: keyof RoughOptions;
  options: string[];
};

type ToggleField = {
  key: keyof RoughOptions;
};

type InputField = {
  key: keyof RoughOptions;
};

type OptionFields = {
  ranges: RangeField[];
  selects: SelectField[];
  toggles: ToggleField[];
  inputs: InputField[];
};

const optionFields: OptionFields = {
  ranges: [
    {
      key: 'roughness',
      min: 0,
      max: 10,
    },
    { key: 'bowing', min: 0, max: 10 },
    { key: 'fillWeight', min: 0, max: 10 },
    { key: 'hachureGap', min: 0, max: 10 },
    { key: 'curveStepCount', min: 0, max: 30 },
    { key: 'curveFitting', min: 0, max: 1 },
    { key: 'simplification', min: 0, max: 1 },
    { key: 'dashOffset', min: 0, max: 10 },
    { key: 'dashGap', min: 0, max: 10 },
    { key: 'zigzagOffset', min: 0, max: 10 },
  ],
  selects: [
    {
      key: 'fillStyle',
      options: [
        'hachure',
        'solid',
        'zigzag',
        'cross-hatch',
        'dots',
        'dashed',
        'zigzag-line',
      ],
    },
  ],
  toggles: [
    {
      key: 'disableMultiStroke',
    },
    { key: 'disableMultiStrokeFill' },
    { key: 'preserveVertices' },
  ],
  inputs: [{ key: 'hachureAngle' }, { key: 'seed' }],
};

type Props = {
  options: RoughOptions;
  onChange: (options: RoughOptions) => void;
};
export const OptionsForm = (props: Props) => {
  const { options, onChange } = props;
  const handleChange = (
    key: keyof RoughOptions,
    value: string | number | boolean
  ) => {
    onChange({ ...options, [key]: value });
  };

  const { ranges, selects, inputs, toggles } = optionFields;

  return (
    <>
      <div className="flex gap-4 flex-wrap">
        {ranges.map(({ key, min, max }) => (
          <Range
            key={key}
            min={min}
            max={max}
            value={options[key] as number}
            label={key}
            onChange={(v) => {
              handleChange(key, v);
            }}
          />
        ))}
      </div>
      <div className="flex gap-4 flex-wrap mt-4">
        {selects.map(({ key, options: opts }) => (
          <Select
            key={key}
            label={key}
            value={options[key] as string}
            options={opts}
            onChange={(v) => {
              handleChange(key, v);
            }}
          />
        ))}
        {inputs.map(({ key }) => (
          <Input
            key={key}
            label={key}
            value={options[key] as number}
            onChange={(v) => {
              handleChange(key, v);
            }}
          />
        ))}
      </div>
      <div className="flex gap-4 flex-wrap mt-4">
        {toggles.map(({ key }) => (
          <Toggle
            key={key}
            label={key}
            value={options[key] as boolean}
            onChange={(v) => {
              handleChange(key, v);
            }}
          />
        ))}
      </div>
    </>
  );
};
