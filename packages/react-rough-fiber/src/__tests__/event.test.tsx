import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react';
import { vi, afterEach, it, expect } from 'vitest';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
});

it('handle event', () => {
  const props = { onClick: vi.fn() };
  const spy = vi.spyOn(props, 'onClick');
  render(
    <RoughSVG>
      <button onClick={props.onClick}>click</button>
    </RoughSVG>,
  );
  act(() => {
    const button = screen.getByText('click');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(spy).toBeCalledTimes(1);
});
