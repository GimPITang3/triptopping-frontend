import { PlanContext } from '@/contexts';
import { IPlan } from '@/types';
import { FC, PropsWithChildren, useState } from 'react';

const PlanContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<IPlan>({
    name: '',
    num: 0,
    members: [],
    budget: 0,
    period: 0,
    tags: [],
    itineraries: [],
  });
  const contextValue = { plan, setPlan };
  return (
    <PlanContext.Provider value={contextValue}>{children}</PlanContext.Provider>
  );
};

export default PlanContextProvider;
