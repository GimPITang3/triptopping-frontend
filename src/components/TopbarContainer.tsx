import { FC, PropsWithChildren } from 'react';

export const TopbarContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className="p-2">{children}</div>;
};
