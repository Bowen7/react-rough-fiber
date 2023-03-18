import { RoughOptions } from './types';
// For comparing roughOptions
export const shallowEqual = (
  options1: RoughOptions | undefined,
  options2: RoughOptions | undefined
) => {
  if (options1 === options2) {
    return true;
  }
  if (options1 === undefined || options2 === undefined) {
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
