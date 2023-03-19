import { version as reactVersion } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { ReactFreehand } from '../index';

afterEach(() => {
  cleanup();
});

it('react version should be 16', () => {
  expect(reactVersion.slice(0, 2)).toBe('16');
});

describe('ReactFreehand component render html element', () => {
  it('render text content', async () => {
    render(<ReactFreehand>123</ReactFreehand>);
    expect(screen.getByText('123')).toBeDefined;
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
