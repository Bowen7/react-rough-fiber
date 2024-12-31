import { cleanup, render } from '@testing-library/react';
import { vi, afterEach, it, expect, describe } from 'vitest';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
});

describe('return correct ref', () => {
  it('render g', () => {
    let ref: SVGElement | null = null;
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" data-testid="path" />
          <g ref={(_ref) => (ref = _ref)} />
        </svg>
      </RoughSVG>,
    );
    expect(ref!.tagName).toBe('g');
  });

  it('render path', () => {
    let ref: SVGElement | null = null;
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M0 0 L 10 10"
            data-testid="path"
            ref={(_ref) => (ref = _ref)}
          />
          <g />
        </svg>
      </RoughSVG>,
    );
    expect(ref!.tagName).toBe('path');
  });
});
