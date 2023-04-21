import { ChangeEvent, useId } from 'react';
import clsx from 'clsx';
type Props = {
  value: number;
  label: string;
  onChange: (value: number) => void;
};

export const Input = (props: Props) => {
  const { value, label, onChange } = props;
  const id = useId();
  return (
    <div className="flex flex-col w-36">
      <label htmlFor={id} className="flex justify-between mb-2 pr-1">
        <span className="text-sm">{label}</span>
      </label>
      <input
        id={id}
        type="number"
        className="h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:ring-offset-background dark:focus-visible:ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(Number(e.target.value));
        }}
      />
    </div>
  );
};
