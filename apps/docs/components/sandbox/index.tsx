import { useMemo } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';

type Props = {
  code: string;
};
export const Sandbox = ({ code }: Props) => {
  const files = useMemo(() => ({ 'App.js': code }), [code]);
  return <Sandpack theme="auto" template="react" files={files} />;
};
