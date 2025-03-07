import type { ComponentProps, PropsWithChildren } from 'react'
import type { Options } from 'react-rough-fiber'
import { ChevronsDown } from 'react-feather'
import { RoughSVG } from 'react-rough-fiber'

type Props = PropsWithChildren<{ options?: Options } & ComponentProps<'div'>>
export function Comparison(props: Props) {
  const { options, children, ...restProps } = props
  return (
    <div className="flex gap-4 my-4 flex-col items-center" {...restProps}>
      <div className="flex gap-4">{children}</div>
      <ChevronsDown size={32} />
      <RoughSVG className="flex gap-4" options={options}>
        {children}
      </RoughSVG>
    </div>
  )
}
