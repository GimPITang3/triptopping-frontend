import { FC } from 'react';
import MenuToggle from './MenuToggle';

const Topbar: FC = () => {
  return (
    <div className="mx-auto px-4">
      <div className="relative flex items-center justify-between h-12">
        <div className="flex-shrink-0 flex items-center font-bold text-xl">
          TripTopping
        </div>
        <MenuToggle />
      </div>
    </div>
  );
};

export default Topbar;
