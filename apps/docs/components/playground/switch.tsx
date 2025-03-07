import * as SwitchPrimitives from '@radix-ui/react-switch'
import { useId } from 'react'

interface Props {
  value: boolean
  label: string
  onChange: (value: boolean) => void
}

export function Switch(props: Props) {
  const { value, label, onChange } = props
  const id = useId()
  return (
    <div className="flex flex-col w-36">
      <label className="flex justify-between mb-2 pr-1" htmlFor={id}>
        <span className="text-sm">{label}</span>
      </label>
      <SwitchPrimitives.Root
        checked={value}
        onCheckedChange={onChange}
        className="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        id={id}
      >
        <SwitchPrimitives.Thumb
          className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
      </SwitchPrimitives.Root>
    </div>
  )
}
Switch.displayName = SwitchPrimitives.Root.displayName
