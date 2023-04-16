import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
