import { useState, ComponentProps } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi, afterEach, it, expect, describe } from 'vitest';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
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
