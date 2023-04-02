import { InstanceProps } from './types';
export const isFun = (val: any) => typeof val === 'function';

export const shallowEqual = (
  options1: InstanceProps | undefined | null,
  options2: InstanceProps | undefined | null
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

  return keys1.every((key) => options1[key] === options2[key]);
};
