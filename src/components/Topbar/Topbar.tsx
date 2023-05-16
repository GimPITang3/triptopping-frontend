import { FC } from 'react';
import Link from 'next/link';

import { TopbarContainer } from '../TopbarContainer';
import MenuToggle from './MenuToggle';

const Topbar: FC = () => {
  return (
    <TopbarContainer>
      <div className="relative flex items-center justify-between h-full">
        <Link href="/">
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
