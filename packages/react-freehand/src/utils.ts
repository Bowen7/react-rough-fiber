import { RoughOptions } from './types';
export const shallowEqual = (
  options1: RoughOptions | undefined | null,
  options2: RoughOptions | undefined | null
) => {
  if (options1 === options2) {
    return true;
  }
  if (options1 == null || options2 == null) {
    return false;
  }
  const keys1 = Object.keys(options1);
  const keys2 = Object.keys(options2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    return (
      options1.hasOwnProperty(key) &&
      options1[key as keyof RoughOptions] ===
        options2[key as keyof RoughOptions]
    );
  });
};
