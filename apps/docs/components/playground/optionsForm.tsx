import type { RoughOptions } from 'react-rough-fiber'
import { Input } from './input'
import { Select } from './select'
import { Slider } from './slider'
import { Switch } from './switch'

interface SliderField {
  key: keyof RoughOptions
  min: number
  max: number
}

interface SelectField {
  key: keyof RoughOptions
  options: string[]
}

interface SwitchField {
  key: keyof RoughOptions
}

interface InputField {
  key: keyof RoughOptions
}

interface OptionFields {
  sliders: SliderField[]
  selects: SelectField[]
  switches: SwitchField[]
  inputs: InputField[]
}

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
}

interface Props {
  options: RoughOptions
  onChange: (options: RoughOptions) => void
}
export function OptionsForm(props: Props) {
  const { options, onChange } = props
  const handleChange = (
    key: keyof RoughOptions,
    value: string | number | boolean,
  ) => {
    onChange({ ...options, [key]: value })
  }

  const { sliders, selects, inputs, switches } = optionFields

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
              handleChange(key, v)
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
              handleChange(key, v)
            }}
          />
        ))}
        {inputs.map(({ key }) => (
          <Input
            key={key}
            label={key}
            value={options[key] as number}
            onChange={(v) => {
              handleChange(key, v)
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
              handleChange(key, v)
            }}
          />
        ))}
      </div>
    </>
  )
}
