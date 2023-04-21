import { RoughOptions } from 'react-rough-fiber';
import { Select } from './select';
import { Switch } from './switch';
import { Input } from './input';
import { Slider } from './slider';

type SliderField = {
  key: keyof RoughOptions;
  min: number;
  max: number;
};

type SelectField = {
  key: keyof RoughOptions;
  options: string[];
};

type SwitchField = {
  key: keyof RoughOptions;
};

type InputField = {
  key: keyof RoughOptions;
};

type OptionFields = {
  sliders: SliderField[];
  selects: SelectField[];
  switches: SwitchField[];
  inputs: InputField[];
};

const optionFields: OptionFields = {
  sliders: [
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
  switches: [
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

  const { sliders, selects, inputs, switches } = optionFields;

  return (
    <>
      <div className="flex gap-x-4 gap-y-6 flex-wrap">
        {sliders.map(({ key, min, max }) => (
          <Slider
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
      <div className="flex gap-x-4 gap-y-6 flex-wrap mt-6">
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
      <div className="flex gap-x-4 gap-y-6 flex-wrap mt-6">
        {switches.map(({ key }) => (
          <Switch
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
