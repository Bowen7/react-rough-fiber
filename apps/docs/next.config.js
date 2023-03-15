const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra({
  reactStrictMode: true,
  transpilePackages: ['react-freehand'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      roughjs: 'roughjs/bundled/rough.cjs.js',
    };
    return config;
  },
});
