const commonConfig = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './test/.babelrc.js' }],
  },
  setupFilesAfterEnv: ['./test/setup.ts'],
  testRegex: '.*\\.test\\.(j|t)sx?$',
};

const react18Config = {
  displayName: 'react 18',
  ...commonConfig,
};
const react17Config = {
  displayName: 'react 17',
  ...commonConfig,
  moduleNameMapper: {
    '^react$': 'react-17',
    '^react-dom$': 'react-dom-17',
    '^@testing-library/react$': '@testing-library/react-12',
  },
};
const react16Config = {
  displayName: 'react 16',
  ...commonConfig,
  moduleNameMapper: {
    '^react$': 'react-16',
    '^react-dom$': 'react-dom-16',
    '^@testing-library/react$': '@testing-library/react-12',
  },
};
module.exports = {
  projects: [react18Config, react17Config, react16Config],
};
