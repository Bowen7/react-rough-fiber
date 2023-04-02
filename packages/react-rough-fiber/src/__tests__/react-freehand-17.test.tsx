import { version as reactVersion, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import rough from 'roughjs';
import { act } from 'react-dom/test-utils';
import { ReactFreehand } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

it('react version should be 17', () => {
  expect(reactVersion.slice(0, 2)).toBe('17');
});

describe('render html element', () => {
  it('render text content', async () => {
    render(<ReactFreehand>123</ReactFreehand>);
    expect(screen.getByText('123')).toBeDefined();
  });

  it('render html content', async () => {
    render(
      <ReactFreehand>
        <span>123</span>
      </ReactFreehand>
    );
    expect(screen.getByText('123').tagName).toBe('SPAN');
    cleanup();

    render(
      <ReactFreehand>
        <h1>123</h1>
      </ReactFreehand>
    );
    expect(screen.getByText('123').tagName).toBe('H1');
  });

  it('render nested html element', async () => {
    render(
      <ReactFreehand>
        <div data-testid="div">
          <span>123</span>
        </div>
      </ReactFreehand>
    );
    const ele = screen.getByTestId('div');
    expect(ele.children[0].textContent).toBe('123');
  });
});

describe('render svg element', () => {
  it('render path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" data-testid="path"></path>
        </svg>
      </ReactFreehand>
    );
    const path = screen.getByTestId('path');
    expect(path.tagName).toBe('path');
    expect(path.getAttribute('d')).not.toBe('M0 0 L 10 10');
  });

  it('render circle to path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle cx={10} cy={10} r={5} data-testid="circle"></circle>
        </svg>
      </ReactFreehand>
    );
    const circle = screen.getByTestId('circle');
    expect(circle.tagName).toBe('path');
  });

  it('render line to path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
        </svg>
      </ReactFreehand>
    );
    const line = screen.getByTestId('line');
    expect(line.tagName).toBe('path');
  });

  it('render rect to path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <rect width={10} height={10} data-testid="rect"></rect>
        </svg>
      </ReactFreehand>
    );
    const rect = screen.getByTestId('rect');
    expect(rect.tagName).toBe('path');
  });

  it('render ellipse to path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <ellipse cx="5" cy="5" rx="10" ry="5" data-testid="ellipse"></ellipse>
        </svg>
      </ReactFreehand>
    );
    const ellipse = screen.getByTestId('ellipse');
    expect(ellipse.tagName).toBe('path');
  });

  it('render polygon to path', async () => {
    render(
      <ReactFreehand>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <polygon points="0,10 5,20 5,15 10,0" data-testid="polygon"></polygon>
        </svg>
      </ReactFreehand>
    );
    const polygon = screen.getByTestId('polygon');
    expect(polygon.tagName).toBe('path');
  });
});

describe('props', () => {
  it('containerTag', () => {
    render(<ReactFreehand data-testid="container" />);
    expect(screen.getByTestId('container').tagName).toBe('DIV');
    cleanup();

    render(<ReactFreehand containerTag="span" data-testid="container" />);
    expect(screen.getByTestId('container').tagName).toBe('SPAN');
  });

  it('rough options', () => {
    render(
      <ReactFreehand options={{ seed: 1 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
        </svg>
      </ReactFreehand>
    );
    const d = screen.getByTestId('line').getAttribute('d');
    cleanup();

    render(
      <ReactFreehand options={{ seed: 1 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1={0} y1={0} x2={10} y2={10} data-testid="line"></line>
        </svg>
      </ReactFreehand>
    );
    expect(screen.getByTestId('line').getAttribute('d')).toBe(d);
  });

  describe('shouldForceOptionsChange', () => {
    it('false(default)', () => {
      const spy = jest.spyOn(rough, 'generator');
      const ChangeSeedDemo = () => {
        const [seed, setSeed] = useState(1);
        const onClick = () => {
          setSeed(seed + 1);
        };
        return (
          <>
            <button onClick={onClick}>Change</button>
            <ReactFreehand options={{ seed }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <line x1={0} y1={0} x2={24} y2={24}></line>
              </svg>
            </ReactFreehand>
          </>
        );
      };
      render(<ChangeSeedDemo />);

      act(() => {
        const button = screen.getByText('Change');
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(spy).toBeCalledTimes(1);
    });

    it('true', () => {
      const spy = jest.spyOn(rough, 'generator');
      const ChangeSeedDemo = () => {
        const [seed, setSeed] = useState(1);
        const onClick = () => {
          setSeed(seed + 1);
        };
        return (
          <>
            <button onClick={onClick}>Change</button>
            <ReactFreehand shouldForceOptionsChange options={{ seed }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <line x1={0} y1={0} x2={24} y2={24}></line>
              </svg>
            </ReactFreehand>
          </>
        );
      };
      render(<ChangeSeedDemo />);

      act(() => {
        const button = screen.getByText('Change');
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(spy).toBeCalledTimes(2);
    });
  });

  it('rest props', () => {
    render(
      <ReactFreehand data-testid="container" className="react-rough-fiber" />
    );
    expect(screen.getByTestId('container').getAttribute('class')).toBe(
      'react-rough-fiber'
    );
  });
});

it('should merge multiple attribute updates', async () => {
  const spy = jest.spyOn(rough, 'generator');

  const ChangeCircleParamsDemo = () => {
    const [params, setParams] = useState([10, 10, 5]);
    const onClick = () => {
      setParams([5, 5, 10]);
    };
    return (
      <>
        <button onClick={onClick}>Change</button>
        <ReactFreehand>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle cx={params[0]} cy={params[1]} r={params[2]}></circle>
          </svg>
        </ReactFreehand>
      </>
    );
  };
  render(<ChangeCircleParamsDemo />);

  act(() => {
    const button = screen.getByText('Change');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(spy).toBeCalledTimes(2);
});
