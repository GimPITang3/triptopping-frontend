import { FC, PropsWithChildren } from 'react';

export const TopbarContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="px-4 h-12">{children}</div>;
};
