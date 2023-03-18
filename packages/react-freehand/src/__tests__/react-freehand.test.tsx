import { cleanup, render, screen } from '@testing-library/react';
import { ReactFreehand } from '../index';

afterEach(() => {
  cleanup();
});

describe('ReactFreehand component', () => {
  it('render text content', async () => {
    render(<ReactFreehand>123</ReactFreehand>);
    expect(screen.getByText('123')).toBeDefined();
  });
});
