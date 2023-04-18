import clsx from 'clsx';
type Props = {
  value: number;
  min?: number;
  max?: number;
  className?: string;
  label: string;
  onChange: (value: number) => void;
};

const getStep = (min: number, max: number) => {
  const range = max - min;
  if (range <= 1) {
    return 0.05;
  }
  if (range <= 5) {
    return 0.25;
  }
  return 0.5;
};

export const Range = (props: Props) => {
  const { value, min = 0, max = 10, label, className, onChange } = props;
  const step = getStep(min, max);
  return (
    <div className={clsx('form-control', className)}>
      <label className="label">
        <span className="label-text">{label}</span>
        <span className="label-text-alt">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range range-xs"
      />
    </div>
  );
};
