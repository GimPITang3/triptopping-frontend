import { IPlan } from '@/types';
import { SetStateAction, createContext, Dispatch } from 'react';

export const PlanContext = createContext<{
  plan: IPlan;
  setPlan: Dispatch<SetStateAction<IPlan>>;
}>({
  plan: {
    name: '',
    numberOfMembers: 1,
    author: '',
    members: [],
    budget: 0,
    period: 1,
    tags: [],
    itineraries: [],
    planId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setPlan: () => {},
});
