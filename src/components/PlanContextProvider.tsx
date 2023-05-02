import { PlanContext } from '@/contexts';
import { IPlan } from '@/types';
import { FC, PropsWithChildren, useState } from 'react';

const PlanContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<IPlan>({
    name: '',
    num: 0,
    status: 'normal',
    members: [],
    budget: 0,
    period: 0,
    startAt: new Date(),
    tags: [],
    itineraries: [],
  });
  const handlePlan = (key: string, value: any) => {
    setPlan((prev: any) => ({ ...prev, [key]: value }));
  };
  const contextValue = { plan, handlePlan };
  return (
    <PlanContext.Provider value={contextValue}>{children}</PlanContext.Provider>
  );
};

export default PlanContextProvider;
