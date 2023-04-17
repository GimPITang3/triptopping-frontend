import { FC, PropsWithChildren } from 'react';
const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="container mx-auto max-w-screen-md bg-slate-50 text-black">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
