import * as RadixSlider from '@radix-ui/react-slider'
import { useId } from 'react'

interface Props {
  value: number
  min?: number
  max?: number
  className?: string
  label: string
  onChange: (value: number) => void
}

function getStep(min: number, max: number) {
  const range = max - min
  if (range <= 1) {
    return 0.05
  }
  if (range <= 5) {
    return 0.25
  }
  return 0.5
}

export function Slider(props: Props) {
  const { value, min = 0, max = 10, label, onChange } = props
  const id = useId()
  const step = getStep(min, max)
  const onValueChange = (value: number[]) => {
    onChange(value[0])
  }
  return (
    <div className="flex flex-col w-36">
      <label className="flex justify-between mb-2 pr-1" htmlFor={id}>
        <span className="text-sm">{label}</span>
        <span className="text-xs">{value}</span>
      </label>
      <RadixSlider.Root
        className="relative flex touch-none select-none items-center w-full"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
        aria-label={label}
        id={id}
      >
        <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary dark:bg-zinc-800">
          <RadixSlider.Range className="absolute h-full bg-primary" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </RadixSlider.Root>
    </div>
  )
}
