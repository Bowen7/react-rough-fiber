import { ChangeEvent } from 'react';
import clsx from 'clsx';
type Props = {
  value: string;
  options: string[];
  className?: string;
  label: string;
  onChange: (value: string) => void;
};

export const Select = (props: Props) => {
  const { value, options, className, label, onChange } = props;
  return (
    <div className={clsx('form-control', className)}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        className="select select-bordered select-xs"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};
