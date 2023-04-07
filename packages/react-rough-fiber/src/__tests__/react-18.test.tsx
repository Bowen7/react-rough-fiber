import {
  version as reactVersion,
  useState,
  ComponentProps,
  createContext,
  useContext,
} from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { RoughSVG, WCRoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('react version should be 18', () => {
  expect(reactVersion.slice(0, 2)).toBe('18');
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
          <path d="M0 0 L 10 10" data-testid="path" />
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

  it('render polyline', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <polyline
            points="0,10 5,20 5,15 10,0"
            data-testid="polyline"
          ></polyline>
        </svg>
      </RoughSVG>
    );
    const polyline = screen.getByTestId('polyline');
    expect(polyline.tagName).toBe('g');
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
          <path d="M0 0 L 10 10" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(2);
    expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
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
          <path d="M0 0 L 10 10" fill="none" data-testid="path" />
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
          <path d="M0 0 L 10 10" stroke="none" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(1);
    expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
  });

  it('when the shape has inline stroke !== none, pass it to the stroke path', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" stroke="#000" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(2);
    expect(pathGroup.children[0].getAttribute('fill')).toBe(null);
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe('#000');
  });

  it('when the shape has inline fill !== none, pass it to the fill path', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" fill="#000" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(2);
    expect(pathGroup.children[0].getAttribute('fill')).toBe('#000');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('none');
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe(null);
  });
});

describe('update svg paths', () => {
  it('update rect paths', () => {
    const Rect = () => {
      const [rectProps, setRectProps] = useState<ComponentProps<'rect'>>({
        width: 10,
        height: 10,
      });
      const onClick = () => {
        setRectProps({
          width: 10,
          height: 10,
          fill: 'none',
        });
      };
      return (
        <RoughSVG>
          <button onClick={onClick}>change</button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <rect {...rectProps} data-testid="rect"></rect>
          </svg>
        </RoughSVG>
      );
    };
    render(<Rect />);
    expect(screen.getByTestId('rect').children.length).toBe(2);

    act(() => {
      const button = screen.getByText('change');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(screen.getByTestId('rect').children.length).toBe(1);
  });

  it('update ellipse paths', () => {
    const Ellipse = () => {
      const [ellipseProps, setEllipseProps] = useState<
        ComponentProps<'ellipse'>
      >({
        cx: 5,
        cy: 5,
        rx: 10,
        ry: 5,
      });
      const onClick = () => {
        setEllipseProps({
          cx: 10,
          cy: 5,
          rx: 10,
          ry: 5,
        });
      };
      return (
        <>
          <button onClick={onClick}>change</button>
          <RoughSVG>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <ellipse {...ellipseProps} data-testid="ellipse"></ellipse>
            </svg>
          </RoughSVG>
        </>
      );
    };
    render(<Ellipse />);
    const ellipse1 = screen.getByTestId('ellipse');
    expect(ellipse1.children.length).toBe(2);
    const d1 = ellipse1.children[0].getAttribute('d');
    const d2 = ellipse1.children[1].getAttribute('d');

    act(() => {
      const button = screen.getByText('change');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    const ellipse2 = screen.getByTestId('ellipse');
    expect(ellipse2.children.length).toBe(2);
    expect(ellipse2.children[0].getAttribute('d')).not.toBe(d1);
    expect(ellipse2.children[1].getAttribute('d')).not.toBe(d2);
  });

  it('diff shape props', () => {
    const Circle = () => {
      const [circleProps, setCircleProps] = useState<ComponentProps<'circle'>>({
        cx: 10,
        cy: 10,
        r: 5,
      });
      const onClick = () => {
        setCircleProps({
          cx: 10,
          cy: 10,
          r: 5,
          className: 'circle',
        });
      };
      return (
        <RoughSVG>
          <button onClick={onClick}>change</button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <circle {...circleProps} data-testid="circle"></circle>
          </svg>
        </RoughSVG>
      );
    };
    render(<Circle />);
    const circle1 = screen.getByTestId('circle');
    const d1 = circle1.children[0].getAttribute('d');
    const d2 = circle1.children[1].getAttribute('d');
    expect(circle1.getAttribute('class')).toBe(null);

    act(() => {
      const button = screen.getByText('change');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const circle2 = screen.getByTestId('circle');
    expect(circle2.getAttribute('class')).toBe('circle');
    expect(circle2.children[0].getAttribute('d')).toBe(d1);
    expect(circle2.children[1].getAttribute('d')).toBe(d2);
  });
});

describe('receive props', () => {
  it('the default container type is div', () => {
    render(
      <RoughSVG data-testid="container">
        <svg />
      </RoughSVG>
    );
    expect(screen.getByTestId('container').tagName).toBe('DIV');
  });

  it('change the container type to span', () => {
    render(
      <RoughSVG containerType="span" data-testid="container">
        <svg />
      </RoughSVG>
    );
    expect(screen.getByTestId('container').tagName).toBe('SPAN');
  });

  it('receive the rough options', () => {
    render(
      <RoughSVG roughOptions={{ seed: 2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" fill="#000" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const d = screen.getByTestId('path').children[0].getAttribute('d');
    cleanup();
    render(
      <RoughSVG roughOptions={{ seed: 2 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" fill="#000" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    expect(screen.getByTestId('path').children[0].getAttribute('d')).toBe(d);
  });

  it('receive rest props', () => {
    render(
      <RoughSVG className="container" data-testid="container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" fill="#000" data-testid="path" />
        </svg>
      </RoughSVG>
    );
    expect(screen.getByTestId('container').getAttribute('class')).toBe(
      'container'
    );
  });
});

it('work with context', () => {
  const FillContext = createContext('#000');
  const Path = () => {
    const fill = useContext(FillContext);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M0 0 L 10 10" fill={fill} data-testid="path" />
      </svg>
    );
  };
  const ContextDemo = () => {
    const [fill, setFill] = useState('#000');
    const onClick = () => {
      setFill('#fff');
    };
    return (
      <>
        <button onClick={onClick}>change</button>
        <FillContext.Provider value={fill}>
          <WCRoughSVG data-testid="container">
            <Path />
          </WCRoughSVG>
        </FillContext.Provider>
      </>
    );
  };

  render(<ContextDemo />);

  expect(screen.getByTestId('path').children[0].getAttribute('fill')).toBe(
    '#000'
  );

  act(() => {
    const button = screen.getByText('change');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(screen.getByTestId('path').children[0].getAttribute('fill')).toBe(
    '#fff'
  );
});
