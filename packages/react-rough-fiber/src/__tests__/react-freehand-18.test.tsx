import { version as reactVersion, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import rough from '@bowen7/roughjs';
import { act } from 'react-dom/test-utils';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('react version should be 18', () => {
  expect(reactVersion.slice(0, 2)).toBe('18');
});

describe('render html element', () => {
  it('render text content', async () => {
    render(<RoughSVG>123</RoughSVG>);
    expect(screen.getByText('123')).toBeDefined();
  });

  it('render html content', async () => {
    render(
      <RoughSVG>
        <span>123</span>
      </RoughSVG>
    );
    expect(screen.getByText('123').tagName).toBe('SPAN');
    cleanup();

    render(
      <RoughSVG>
        <h1>123</h1>
      </RoughSVG>
    );
    expect(screen.getByText('123').tagName).toBe('H1');
  });

  it('render nested html element', async () => {
    render(
      <RoughSVG>
        <div data-testid="div">
          <span>123</span>
        </div>
      </RoughSVG>
    );
    const ele = screen.getByTestId('div');
    expect(ele.children[0].textContent).toBe('123');
  });
});

describe('render svg element', () => {
  it('render path', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" data-testid="path"></path>
        </svg>
      </RoughSVG>
    );
    const path = screen.getByTestId('path');
    expect(path.tagName).toBe('g');
  });

  it('render circle', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle cx={10} cy={10} r={5} data-testid="circle"></circle>
        </svg>
      </RoughSVG>
    );
    const circle = screen.getByTestId('circle');
    expect(circle.tagName).toBe('g');
  });

  it('render line', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
        </svg>
      </RoughSVG>
    );
    const line = screen.getByTestId('line');
    expect(line.tagName).toBe('g');
  });

  it('render rect', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <rect width={10} height={10} data-testid="rect"></rect>
        </svg>
      </RoughSVG>
    );
    const rect = screen.getByTestId('rect');
    expect(rect.tagName).toBe('g');
  });

  it('render ellipse', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <ellipse cx="5" cy="5" rx="10" ry="5" data-testid="ellipse"></ellipse>
        </svg>
      </RoughSVG>
    );
    const ellipse = screen.getByTestId('ellipse');
    expect(ellipse.tagName).toBe('g');
  });

  it('render polygon', async () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <polygon points="0,10 5,20 5,15 10,0" data-testid="polygon"></polygon>
        </svg>
      </RoughSVG>
    );
    const polygon = screen.getByTestId('polygon');
    expect(polygon.tagName).toBe('g');
  });
});

// describe('props', () => {
//   it('containerTag', () => {
//     render(<ReactFreehand data-testid="container" />);
//     expect(screen.getByTestId('container').tagName).toBe('DIV');
//     cleanup();

//     render(<ReactFreehand containerTag="span" data-testid="container" />);
//     expect(screen.getByTestId('container').tagName).toBe('SPAN');
//   });

//   it('rough options', () => {
//     render(
//       <ReactFreehand options={{ seed: 1 }}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//         >
//           <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
//         </svg>
//       </ReactFreehand>
//     );
//     const d = screen.getByTestId('line').getAttribute('d');
//     cleanup();

//     render(
//       <ReactFreehand options={{ seed: 1 }}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//         >
//           <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
//         </svg>
//       </ReactFreehand>
//     );
//     expect(screen.getByTestId('line').getAttribute('d')).toBe(d);
//   });

//   describe('shouldForceOptionsChange', () => {
//     it('false(default)', () => {
//       const spy = jest.spyOn(rough, 'generator');
//       const ChangeSeedDemo = () => {
//         const [seed, setSeed] = useState(1);
//         const onClick = () => {
//           setSeed(seed + 1);
//         };
//         return (
//           <>
//             <button onClick={onClick}>Change</button>
//             <ReactFreehand options={{ seed }}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//               >
//                 <line x1={0} y1={0} x2={24} y2={24}></line>
//               </svg>
//             </ReactFreehand>
//           </>
//         );
//       };
//       render(<ChangeSeedDemo />);

//       act(() => {
//         const button = screen.getByText('Change');
//         button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
//       });

//       expect(spy).toBeCalledTimes(1);
//     });

//     it('true', () => {
//       const spy = jest.spyOn(rough, 'generator');
//       const ChangeSeedDemo = () => {
//         const [seed, setSeed] = useState(1);
//         const onClick = () => {
//           setSeed(seed + 1);
//         };
//         return (
//           <>
//             <button onClick={onClick}>Change</button>
//             <ReactFreehand shouldForceOptionsChange options={{ seed }}>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//               >
//                 <line x1={0} y1={0} x2={24} y2={24}></line>
//               </svg>
//             </ReactFreehand>
//           </>
//         );
//       };
//       render(<ChangeSeedDemo />);

//       act(() => {
//         const button = screen.getByText('Change');
//         button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
//       });

//       expect(spy).toBeCalledTimes(2);
//     });
//   });

//   it('rest props', () => {
//     render(
//       <ReactFreehand data-testid="container" className="react-rough-fiber" />
//     );
//     expect(screen.getByTestId('container').getAttribute('class')).toBe(
//       'react-rough-fiber'
//     );
//   });
// });

// it('should merge multiple attribute updates', async () => {
//   const spy = jest.spyOn(rough, 'generator');

//   const ChangeCircleParamsDemo = () => {
//     const [params, setParams] = useState([10, 10, 5]);
//     const onClick = () => {
//       setParams([5, 5, 10]);
//     };
//     return (
//       <>
//         <button onClick={onClick}>Change</button>
//         <ReactFreehand>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//           >
//             <circle cx={params[0]} cy={params[1]} r={params[2]}></circle>
//           </svg>
//         </ReactFreehand>
//       </>
//     );
//   };
//   render(<ChangeCircleParamsDemo />);

//   act(() => {
//     const button = screen.getByText('Change');
//     button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
//   });

//   expect(spy).toBeCalledTimes(2);
// });
