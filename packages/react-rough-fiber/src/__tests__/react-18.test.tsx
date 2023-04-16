import {
  version as reactVersion,
  useState,
  createContext,
  useContext,
} from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { WCRoughSVG } from '../index';

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test('react version should be 18', () => {
  expect(reactVersion.slice(0, 2)).toBe('18');
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
    'none'
  );
  expect(screen.getByTestId('path').children[0].getAttribute('stroke')).toBe(
    '#000'
  );

  act(() => {
    const button = screen.getByText('change');
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(screen.getByTestId('path').children[0].getAttribute('fill')).toBe(
    'none'
  );
  expect(screen.getByTestId('path').children[0].getAttribute('stroke')).toBe(
    '#fff'
  );
});
