import Link from 'next/link';
import { FC } from 'react';

import { TopbarContainer } from '../TopbarContainer';
import MenuToggle from './MenuToggle';

import Image from 'next/image';
import trip from '../../../public/trip.png';

const Topbar: FC = () => {
  return (
    <TopbarContainer>
      <div className="relative flex items-center justify-between h-full">
        <Link className="flex" href="/">
          <div className="">
            <Image className="shrink-0 mr-2 mt-[2px]" src={trip} alt="logo" width={24} height={24} />
          </div>
          <div className="flex-shrink-0 flex items-center font-bold text-xl">
            TripTopping
          </div>
        </Link>
        <MenuToggle />
      </div>
    </TopbarContainer>
  );
};

export default Topbar;
