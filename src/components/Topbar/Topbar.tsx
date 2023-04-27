import Image from 'next/image';
import { FC } from 'react';

import hamburgur from '../../../public/hamburger.svg';

const Topbar: FC = () => {
  return (
    <div className="mx-auto px-4">
      <div className="relative flex items-center justify-between h-12">
        <div className="flex-shrink-0 flex items-center font-bold text-xl">
          TripTopping
        </div>
        <Image src={hamburgur} alt="hamburgur" />
      </div>
    </div>
  );
};

export default Topbar;
