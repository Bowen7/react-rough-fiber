import { useState, ComponentProps } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { RoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
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
  it('render the fill and stroke paths', () => {
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
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe(
      'var(--rrf-fill-color)'
    );
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe(null);
  });

  it('only render the stroke path', () => {
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

  it('only render the fill path', () => {
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
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe(
      'var(--rrf-fill-color)'
    );
  });

  it('pass the inline stroke attribute to the stroke path', () => {
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
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe(
      'var(--rrf-fill-color)'
    );
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe('#000');
  });

  it('pass the inline fill attribute it to the fill path', () => {
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
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('#000');
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe(null);
  });

  it('pass the inline fill in style attribute to the stroke path', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0 L 10 10" style={{ fill: '#000' }} data-testid="path" />
        </svg>
      </RoughSVG>
    );
    const pathGroup = screen.getByTestId('path');
    expect(pathGroup.children.length).toBe(2);
    expect(pathGroup.children[0].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[0].getAttribute('stroke')).toBe('#000');
    expect(pathGroup.children[1].getAttribute('fill')).toBe('none');
    expect(pathGroup.children[1].getAttribute('stroke')).toBe(null);
  });

  it('the default value of fill is #000', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          data-testid="svg"
        >
          <g data-testid="g" />
        </svg>
      </RoughSVG>
    );
    const svg = screen.getByTestId('svg');
    const g = screen.getByTestId('g');
    expect(svg.style.getPropertyValue('--rrf-fill-color')).toBe('#000');
    expect(g.style.getPropertyValue('--rrf-fill-color')).toBe('');
  });

  it('set fill color by the CSS variable', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          data-testid="svg"
          fill="green"
        >
          <g data-testid="g" style={{ fill: 'red' }} />
          <path d="M0 0 L 10 10" data-testid="path" style={{ fill: 'red' }} />
        </svg>
      </RoughSVG>
    );
    const svg = screen.getByTestId('svg');
    const g = screen.getByTestId('g');
    const path = screen.getByTestId('path');
    expect(svg.style.getPropertyValue('--rrf-fill-color')).toBe('green');
    expect(g.style.getPropertyValue('--rrf-fill-color')).toBe('red');
    expect(path.style.getPropertyValue('--rrf-fill-color')).toBe('');
    expect(path.children[0].getAttribute('stroke')).toBe('red');
  });
});

describe('render fill opacity', () => {
  it('the default value of fill opacity is 1', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          data-testid="svg"
        >
          <g data-testid="g" />
        </svg>
      </RoughSVG>
    );
    const svg = screen.getByTestId('svg');
    const g = screen.getByTestId('g');
    expect(svg.style.getPropertyValue('--rrf-fill-opacity')).toBe('1');
    expect(g.style.getPropertyValue('--rrf-fill-opacity')).toBe('');
  });

  it('set fill opacity by the CSS variable', () => {
    render(
      <RoughSVG>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          data-testid="svg"
          fillOpacity={0.7}
        >
          <g data-testid="g" style={{ fillOpacity: 0.5 }} />
          <path
            d="M0 0 L 10 10"
            data-testid="path"
            style={{ fillOpacity: 0.2 }}
          />
        </svg>
      </RoughSVG>
    );
    const svg = screen.getByTestId('svg');
    const g = screen.getByTestId('g');
    const path = screen.getByTestId('path');
    expect(svg.style.getPropertyValue('--rrf-fill-opacity')).toBe('0.7');
    expect(g.style.getPropertyValue('--rrf-fill-opacity')).toBe('0.5');
    expect(path.style.getPropertyValue('--rrf-fill-opacity')).toBe('');
    expect(path.children[0].getAttribute('stroke-opacity')).toBe('0.2');
  });
});
