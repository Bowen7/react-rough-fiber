import { ReactNode, Suspense } from 'react';
import { RoughSVG } from 'react-rough-fiber';
import satori, { SatoriOptions } from 'satori';
import SVG from 'react-inlinesvg';
import { suspend } from 'suspend-react';
import { useTheme } from 'nextra-theme-docs';

const useFont = (url: string) =>
  suspend(() => fetch(url).then((res) => res.arrayBuffer()), [url]);

const useSatori = (markup: ReactNode, options: SatoriOptions, theme: string) =>
  suspend(() => satori(markup, options), [theme]);

const JSXSuspend = () => {
  const font = useFont('/GloriaHallelujah-Regular.ttf');
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';
  const svg = useSatori(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontFamily: "'Caveat'",
        padding: '24px 36px',
        border: '1px solid #13c2c2',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <span
            style={{
              border: '1px solid #eb2f96',
              padding: '5px 10px',
              borderRadius: '6px',
            }}
          >
            React Rough Fiber
          </span>
        </div>
        <p>A React renderer for rendering hand-drawn SVGs</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            backgroundColor: isDark ? '#fa541c' : '#ffa39e',
            color: isDark ? '#fff' : '#000',
            padding: '6px 36px',
            borderRadius: '6px',
          }}
        >
          Go
        </span>
      </div>
    </div>,
    {
      width: 500,
      height: 300,
      fonts: [
        {
          name: "'Caveat'",
          data: font as ArrayBuffer,
          weight: 400,
          style: 'normal',
        },
      ],
      embedFont: false,
    },
    theme
  );

  return (
    <RoughSVG
      style={{ color: 'currentColor' }}
      options={{ roughness: 1, simplification: 1 }}
    >
      <SVG src={svg} />
    </RoughSVG>
  );
};

const JSXDemo = () => (
  <Suspense fallback={<div>loading...</div>}>
    <JSXSuspend />
  </Suspense>
);

export default JSXDemo;
