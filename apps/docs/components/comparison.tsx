import { ComponentProps, PropsWithChildren } from 'react';
import { RoughSVG, Options } from 'react-rough-fiber';
import { ChevronsDown } from 'react-feather';

type Props = PropsWithChildren<{ options?: Options } & ComponentProps<'div'>>;
export const Comparison = (props: Props) => {
  const { options, children, ...restProps } = props;
  return (
    <div className="flex gap-4 my-4 flex-col items-center" {...restProps}>
      <div className="flex gap-4">{children}</div>
      <ChevronsDown size={32} />
      <RoughSVG className="flex gap-4" options={options}>
        {children}
      </RoughSVG>
    </div>
  );
};
