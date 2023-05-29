import Link from 'next/link';
import { FC } from 'react';

import { TopbarContainer } from '../TopbarContainer';
import MenuToggle from './MenuToggle';

import Image from 'next/image';
import trip from '../../../public/trip.png';

const Topbar: FC = () => {
  return (
    <TopbarContainer>
      <div className="navbar bg-white shadow-xl rounded-box">
        <div className="navbar-start"></div>
        <Link className="flex navbar-center" href="/">
          <div className="">
            <Image className="shrink-0 mr-2 mt-[2px]" src={trip} alt="logo" width={24} height={24} />
          </div>
          <div className="shrink-0 flex items-center font-bold text-xl">
            TripTopping
          </div>
        </Link>
        <div className="navbar-end pr-2">
          <MenuToggle />
        </div>
      </div>
    </TopbarContainer>
  );
};

export default Topbar;
