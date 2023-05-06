import { PlanContext } from '@/contexts';
import { IPlan } from '@/types';
import { FC, PropsWithChildren, useState } from 'react';

const PlanContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<IPlan>({
    planId: '',
    name: '',
    numberOfMembers: 1,
    members: [],
    author: '',
    budget: 0,
    period: 1,
    tags: [],
    itineraries: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const contextValue = { plan, setPlan };
  return (
    <PlanContext.Provider value={contextValue}>{children}</PlanContext.Provider>
  );
};

export default PlanContextProvider;
