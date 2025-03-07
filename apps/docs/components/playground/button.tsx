import type { ComponentProps, PropsWithChildren } from 'react'
import clsx from 'clsx'

type Props = PropsWithChildren<ComponentProps<'button'>>
export function Button(props: Props) {
  const { className, children, ...rest } = props
  return (
    <button
      {...rest}
      className={clsx(
        className,
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        'h-9 px-3 rounded-md',
      )}
    >
      {children}
    </button>
  )
}
