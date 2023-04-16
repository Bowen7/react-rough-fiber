import { useState, ComponentProps } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { RoughOptions, RoughSVG, SVGShape } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
      <RoughSVG options={{ seed: 2 }}>
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
      <RoughSVG options={{ seed: 2 }}>
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

  it('receive the function type rough options', () => {
    const options = (shape: SVGShape): RoughOptions => {
      if (shape.type === 'rect') {
        if (shape.width === 20 && shape.height === 20) {
          return {
            fillStyle: 'solid',
          };
        }
      }
      return {};
    };

    const Rect = () => {
      const [rectProps, setRectProps] = useState<ComponentProps<'rect'>>({
        width: 10,
        height: 10,
      });
      const onClick = () => {
        setRectProps({
          width: 20,
          height: 20,
        });
      };
      return (
        <RoughSVG options={options}>
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
    expect(screen.getByTestId('rect').children[0].getAttribute('fill')).toBe(
      'none'
    );
    expect(screen.getByTestId('rect').children[0].getAttribute('stroke')).toBe(
      'var(--rrf-fill-color)'
    );

    act(() => {
      const button = screen.getByText('change');
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(screen.getByTestId('rect').children[0].getAttribute('fill')).toBe(
      null
    );
    expect(screen.getByTestId('rect').children[0].getAttribute('stroke')).toBe(
      'none'
    );
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
