import { IPlan } from '@/types';
import { createContext } from 'react';

export const PlanContext = createContext<{
  plan: IPlan;
  handlePlan: (key: string, value: any) => void;
}>({
  plan: {
    name: '새로운 이름',
    num: 1,
    members: [],
    budget: 0,
    period: 1,
    startAt: new Date(),
    tags: [],
    itineraries: [],
  },
  handlePlan: () => {},
});
