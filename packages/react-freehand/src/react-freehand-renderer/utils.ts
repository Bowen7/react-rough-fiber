import { INTERNAL_PROPS_KEY } from './constants';
import { Instance, InstanceProps } from './types';
export const updateFiberProps = (node: Instance, props: InstanceProps) => {
  (node as any)[INTERNAL_PROPS_KEY] = props;
};

export const isFun = (val: any) => typeof val === 'function';
