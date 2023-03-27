import { Options } from './types';
import { SVG_INTERCEPT_ATTRIBUTE } from './constants';
export const shallowEqual = (
  options1: Options | undefined | null,
  options2: Options | undefined | null
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
      options1[key as keyof Options] === options2[key as keyof Options]
    );
  });
};

// Create a proxy handler
// get: if the property exists in target, return the value of target
// else return the value of fallback
// set: likewise
export const createProxyHandler = <
  Target extends object,
  Fallback extends object
>(
  fallback: Fallback,
  callback?: (name: string, props: unknown) => void
) => ({
  get(target: Target, name: string) {
    const value =
      name in target
        ? target[name as keyof Target]
        : fallback[name as keyof Fallback];

    if (typeof value === 'function') {
      return name in target ? value.bind(target) : value.bind(fallback);
    }
    return value;
  },
  set(target: Target, name: string, value: any) {
    if (Object.prototype.hasOwnProperty.call(target, name)) {
      target[name as keyof Target] = value;
      return true;
    }
    fallback[name as keyof Fallback] = value;
    callback && callback(name, value);
    return true;
  },
});

export const shouldInterceptAttribute = (type: string, name: string) =>
  type in SVG_INTERCEPT_ATTRIBUTE &&
  name in SVG_INTERCEPT_ATTRIBUTE[type as keyof typeof SVG_INTERCEPT_ATTRIBUTE];

// create a fake to do nothing
export const fakeSet = {
  size: 0,
  delete() {},
  add() {},
  forEach() {},
};
