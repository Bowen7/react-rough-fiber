# React Rough Fiber

![banner](https://user-images.githubusercontent.com/27432981/233581368-3b8bb5e1-5d18-48ff-b0ee-89d78abb7796.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![NPM](https://img.shields.io/npm/v/react-rough-fiber)](https://www.npmjs.com/package/react-rough-fiber)
[![Build](https://img.shields.io/github/actions/workflow/status/bowen7/react-rough-fiber/npm-publish.yml)](https://github.com/Bowen7/react-rough-fiber/actions/workflows/npm-publish.yml)


`react-rough-fiber` -- A React renderer for rendering hand-drawn SVGs.

## Installation

``` bash
npm install react-rough-fiber react-reconciler
```

> If you are using React 17, you need to install react-reconciler@0.26.2

## Quick Start

To render the SVG in a hand-drawn style, you only need to add three lines of code:
``` js
import { RoughSVG } from 'react-rough-fiber'
export default function App() {
  return (
    <RoughSVG>
      <svg viewBox="0 0 128 128" width="128" height="128">
        <circle cx={64} cy={64} r={48} stroke="currentColor" fill="#82ca9d" />
      </svg>
    </RoughSVG>
  )
}
```

![simply-circle](https://user-images.githubusercontent.com/27432981/233627411-dcc63b21-317c-4b85-8a55-92d39322df10.png)


## Usage

react-rough-fiber can integrate with many existing SVG-based libraries:

- [Icon](https://react-rough-fiber.vercel.app/examples/icon)
- Chart
  - [recharts](https://react-rough-fiber.vercel.app/examples/chart/recharts)
  - [visx](https://react-rough-fiber.vercel.app/examples/chart/visx)
  - [react-d3-tree](https://react-rough-fiber.vercel.app/examples/chart/react-d3-tree)
- [Text](https://react-rough-fiber.vercel.app/examples/text)
- [SVG string](https://react-rough-fiber.vercel.app/examples/svg-string)
- [Remote SVG](https://react-rough-fiber.vercel.app/examples/remote-svg)
- [Emoji](https://react-rough-fiber.vercel.app/examples/emoji)

![image](https://user-images.githubusercontent.com/27432981/233629588-34c66519-1ae0-45de-beaa-f9dfedf635f3.png)

![image](https://user-images.githubusercontent.com/27432981/233627832-7f7a1a87-485c-4220-a483-17bb6b93f4ea.png)

## API

[Full Documentation](https://react-rough-fiber.vercel.app/apis).

### RoughSVG

``` jsx
import { RoughSVG } from "react-rough-fiber";
// ... your component code
<RoughSVG containerType="div" options={options}>
{/* your SVG */}
</RoughSVG>
```

- containerType = 'div': The type of container to use for the `RoughSVG`. Optional.
- options: RoughOptions | ((shape: SVGShape, props: React.HTMLAttributes<SVGElement>) => RoughOptions = {}. It can be a `RoughOptions` for [Rough.js](https://github.com/rough-stuff/rough/wiki#options). Also support a function that returns `RoughOptions`. Optional.

### WCRoughSVG

> `WCRoughSVG` is only compatible with React version 18.0.0 or later.

``` jsx
import { WCRoughSVG } from "react-rough-fiber";
// ... your component code
<WCRoughSVG containerType="div" options={options}>
{/* your SVG */}
</WCRoughSVG>
```

If you want to use context in `RoughSVG`, you can use `WCRoughSVG` instead of `RoughSVG`. See [FAQ](https://react-rough-fiber.vercel.app/faq) for more details.

All parameters of `WCRoughSVG` are identical to `RoughSVG`.

## Development

This library is a monorepo project. The core package can be found under `/packages/react-rough-fiber`, and the docs are under `/apps/docs`

- clone this repo
- run `pnpm install` to install dependencies
- run `pnpm dev`, and open `localhost:3000` to view the documentation.
- run `pnpm test` to run tests.

PRs are welcome!

## How does it work?

See [my blog](https://www.bowencodes.com/post/react-rough-fiber).

## Showcases

- [Add your project by creating a PR](https://github.com/Bowen7/react-rough-fiber/pulls)

## Credits

react-rough-fiber is powered or inspired by these open source projects:

- [roughjs](https://github.com/rough-stuff/rough)
- [nextra](https://github.com/shuding/nextra)
- [perfect-freehand](https://github.com/steveruizok/perfect-freehand)
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- [preact](https://github.com/preactjs/preact)
- [shadcn/ui](https://github.com/shadcn/ui)

## License

MIT
