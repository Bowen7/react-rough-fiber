import React, { useEffect } from 'react';
import { DocsThemeConfig, useTheme } from 'nextra-theme-docs';
import { RoughSVG } from 'react-rough-fiber';

// make daisyui dark mode work
const Head = () => {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    document
      .querySelector('html')!
      .setAttribute('data-theme', resolvedTheme || 'light');
  }, [resolvedTheme]);
  return null;
};

const config: DocsThemeConfig = {
  logo: <strong>React Rough Fiber</strong>,
  project: {
    link: 'https://github.com/Bowen7/react-rough-fiber',
  },
  docsRepositoryBase: 'https://github.com/Bowen7/react-rough-fiber',
  footer: {
    text: 'React Rough Fiber Docs',
  },
  head: Head,
  useNextSeoProps() {
    return {
      titleTemplate: '%s - React Rough Fiber',
    };
  },
  chat: {
    icon: (
      <RoughSVG
        options={{ hachureGap: 1.5, roughness: 0.5, curveFitting: 1 }}
        className="flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={32}
          height={32}
          viewBox="0 0 36 36"
          className="mr-2"
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            fill="#DD2E44"
            stroke="none"
            d="M35.885 11.833c0-5.45-4.418-9.868-9.867-9.868-3.308 0-6.227 1.633-8.018 4.129-1.791-2.496-4.71-4.129-8.017-4.129-5.45 0-9.868 4.417-9.868 9.868 0 .772.098 1.52.266 2.241C1.751 22.587 11.216 31.568 18 34.034c6.783-2.466 16.249-11.447 17.617-19.959.17-.721.268-1.469.268-2.242z"
          />
        </svg>
        Sponsor
      </RoughSVG>
    ),
    link: 'https://github.com/sponsors/bowen7',
  },
};

export default config;
