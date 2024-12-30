const commonConfig = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './test/.babelrc.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*(roughjs|path-data-parser|points-on-curve|points-on-path))',
  ],
};

const react18Config = {
  displayName: 'react 18',
  testRegex: '.*(?<!-(17|19))\\.test\\.(j|t)sx?$',
  ...commonConfig,
};

const react17Config = {
  displayName: 'react 17',
  testRegex: '.*(?<!-(18|19))\\.test\\.(j|t)sx?$',
  ...commonConfig,
  moduleNameMapper: {
    '^react$': 'react-17',
    '^react-dom$': 'react-dom-17',
    '^react-dom/test-utils$': 'react-dom-17/test-utils',
    '^@testing-library/react$': '@testing-library/react-12',
    '^react-reconciler$': 'react-reconciler-26',
  },
};

module.exports = {
  // projects: [react18Config, react17Config],
  projects: [react17Config],
};
