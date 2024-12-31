module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './test/.babelrc.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*(roughjs|path-data-parser|points-on-curve|points-on-path))',
  ],
};
