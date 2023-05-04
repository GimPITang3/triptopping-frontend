import { IPlan } from '@/types';
import { SetStateAction, createContext, Dispatch } from 'react';

export const PlanContext = createContext<{
  plan: IPlan;
  setPlan: Dispatch<SetStateAction<IPlan>>;
}>({
  plan: {
    name: '새로운 이름',
    num: 1,
    members: [],
    budget: 0,
    period: 1,
    tags: [],
    itineraries: [],
  },
  setPlan: () => {},
});
