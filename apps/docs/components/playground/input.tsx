import { ChangeEvent } from 'react';
import clsx from 'clsx';
type Props = {
  value: number;
  className?: string;
  label: string;
  onChange: (value: number) => void;
};

export const Input = (props: Props) => {
  const { value, label, className, onChange } = props;
  return (
    <div className={clsx('form-control', className)}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="number"
        className="input input-xs input-bordered w-full max-w-xs"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(Number(e.target.value));
        }}
      />
    </div>
  );
};
