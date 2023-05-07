import { FC } from 'react';
import Image from 'next/image';

import hamburgur from '../../../public/hamburger.svg';

const MenuToggle: FC = () => {
  return (
    <>
      <label htmlFor="my-drawer-4" className="hover:bg-slate-200 drawer-button"><Image src={hamburgur} alt="hamburgur" /></label>
    </>
  );
};

export default MenuToggle;
