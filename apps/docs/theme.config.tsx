import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <strong>React Rough Fiber</strong>,
  project: {
    link: 'https://github.com/Bowen7/react-rough-fiber',
  },
  docsRepositoryBase: 'https://github.com/Bowen7/react-rough-fiber',
  footer: {
    text: 'React Rough Fiber Docs',
  },
  chat: {
    link: 'https://ko-fi.com/Q5Q0JBEEF',
    icon: (
      <img
        style={{ height: 36 }}
        src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
        alt="Buy Me a Coffee at ko-fi.com"
      />
    ),
  },
};

export default config;
