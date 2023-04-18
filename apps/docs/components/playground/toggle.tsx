import clsx from 'clsx';
import { ChangeEvent } from 'react';
type Props = {
  value: boolean;
  className?: string;
  label: string;
  onChange: (value: boolean) => void;
};

export const Toggle = (props: Props) => {
  const { value, className, label, onChange } = props;
  return (
    <div className={clsx('form-control', className)}>
      <label className="label cursor-pointer">
        <span className="label-text mr-2">{label}</span>
        <input
          type="checkbox"
          className="toggle"
          checked={value}
          onChange={() => onChange(!value)}
        />
      </label>
    </div>
  );
};
