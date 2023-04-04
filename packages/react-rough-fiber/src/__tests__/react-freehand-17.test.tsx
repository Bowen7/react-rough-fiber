import { version as reactVersion, useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import rough from '@bowen7/roughjs';
import { act } from 'react-dom/test-utils';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

it('react version should be 17', () => {
  expect(reactVersion.slice(0, 2)).toBe('17');
});

describe('render html element', () => {
  it('render text content', () => {
    render(<RoughSVG>123</RoughSVG>);
    expect(screen.getByText('123')).toBeDefined();
  });

  it('render html content', () => {
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

  it('render nested html element', () => {
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

it('handle event', () => {
  const props = { onClick: jest.fn() };
  const spy = jest.spyOn(props, 'onClick');
  render(
    <RoughSVG>
      <button onClick={props.onClick}>click</button>
    </RoughSVG>
  );
  act(() => {
    const button = screen.getByText('click');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(spy).toBeCalledTimes(1);
});

it('rerender when props have changed', () => {
  const Counter = () => {
    const [count, setCount] = useState(0);
    return (
      <>
        <button onClick={() => setCount((v) => v + 1)}>add</button>
        <RoughSVG>
          <span>{count}</span>
        </RoughSVG>
      </>
    );
  };
  render(<Counter />);
  act(() => {
    const button = screen.getByText('add');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(screen.getByText('1')).toBeDefined();
});

describe('render svg element', () => {
  it('render path', () => {
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

  it('render circle', () => {
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

  it('render line', () => {
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

  it('render rect', () => {
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

  it('render ellipse', () => {
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

  it('render polygon', () => {
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

describe('render fill and stroke', () => {
  it('when the shape does not have inline fill and stroke attributes, render two paths', () => {
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
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(2);
    expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe(null);
  });

  it('when the shape has inline fill = none, render one path', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" fill="none" data-testid="path"></path>
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(1);
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe(null);
  });

  it('when the shape has inline stroke = none, render one path', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" stroke="none" data-testid="path"></path>
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(1);
    expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
  });

  // it('when the shape has inline stroke !== none, pass it to the stroke path', () => {
  //   render(
  //     <RoughSVG>
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="24"
  //         height="24"
  //         viewBox="0 0 24 24"
  //       >
  //         <path d="M0 0 L 10 10" stroke="none" data-testid="path"></path>
  //       </svg>
  //     </RoughSVG>
  //   );
  //   const pathGroup = screen.getByTestId('path');
  //   expect(pathGroup.children.length).toBe(1);
  //   expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
  //   expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
  // });
});
