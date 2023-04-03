const commonConfig = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './test/.babelrc.js' }],
  },
  setupFilesAfterEnv: ['./test/setup.ts'],
};

const react18Config = {
  displayName: 'react 18',
  testRegex: '.*-18\\.test\\.(j|t)sx?$',
  ...commonConfig,
};

const react17Config = {
  displayName: 'react 17',
  testRegex: '.*-17\\.test\\.(j|t)sx?$',
  ...commonConfig,
  moduleNameMapper: {
    '^react$': 'react-17',
    '^react-dom$': 'react-dom-17',
    '^react-dom/test-utils$': 'react-dom-17/test-utils',
    '^@testing-library/react$': '@testing-library/react-12',
    '^react-test-renderer$': 'react-test-renderer-17',
  },
};

const normalConfig = {
  displayName: 'normal tests',
  testRegex: '.*(?<!(-16)|(-17)|(-18))\\.test\\.(j|t)sx?$',
  ...commonConfig,
};

module.exports = {
  projects: [react18Config, react17Config, normalConfig],
};
