import { PlanContext } from '@/contexts';
import { Plan } from '@/types';
import { FC, PropsWithChildren, useCallback, useState } from 'react';

const initPlan = (): Plan => ({
  planId: '',
  name: '',
  numberOfMembers: 1,
  members: [],
  author: '',
  budget: 0,
  period: 1,
  tags: [],
  loc: { lat: 0, lng: 0 },
  itinerary: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const PlanContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<Plan>(initPlan());

  const clearPlan = useCallback(() => setPlan(initPlan()), []);

  return (
    <PlanContext.Provider value={{ plan, setPlan, clearPlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export default PlanContextProvider;
