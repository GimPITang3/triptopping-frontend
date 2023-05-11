import { PlanContext } from '@/contexts';
import { Plan } from '@/types';
import { FC, PropsWithChildren, useState } from 'react';

const PlanContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<Plan>({
    planId: '',
    name: '',
    numberOfMembers: 1,
    members: [],
    author: '',
    budget: 0,
    period: 1,
    tags: [],
    itinerary: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const contextValue = { plan, setPlan };
  return (
    <PlanContext.Provider value={contextValue}>{children}</PlanContext.Provider>
  );
};

export default PlanContextProvider;
