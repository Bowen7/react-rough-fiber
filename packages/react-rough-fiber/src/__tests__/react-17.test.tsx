import { version as reactVersion } from 'react';

it('react version should be 17', () => {
  expect(reactVersion.slice(0, 2)).toBe('17');
});
