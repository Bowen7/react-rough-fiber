import React from 'react';
import { InstanceProps } from './types';
export const isFun = (val: any) => typeof val === 'function';

export const shallowEqual = (
  options1: InstanceProps | undefined | null,
  options2: InstanceProps | undefined | null,
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

const pointSplit = /\s+|\s*,\s*/;
export const parsePoints = (points: string) => {
  const pts: [number, number][] = [];
  const coord = points.split(pointSplit);
  for (let i = 0; i < coord.length; i += 2) {
    pts.push([+coord[i], +coord[i + 1]]);
  }
  return pts;
};

export const isReact19 = () => {
  return React.version.startsWith('19.');
};
