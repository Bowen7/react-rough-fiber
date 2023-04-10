import { Config } from './core';
import { RoughGenerator } from './generator';

export const roughGenerator = (config?: Config): RoughGenerator => {
  return new RoughGenerator(config);
};
