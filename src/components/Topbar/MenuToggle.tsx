import { FC } from 'react';
import Image from 'next/image';

import hamburgur from '../../../public/hamburger.svg';

const MenuToggle: FC = () => {
  return (
    <>
      <Image src={hamburgur} alt="hamburgur" />
    </>
  );
};

export default MenuToggle;
