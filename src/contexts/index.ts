import { Plan, User } from '@/types';
import { SetStateAction, createContext, Dispatch } from 'react';

export const PlanContext = createContext<{
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
}>({
  plan: {
    name: '',
    numberOfMembers: 1,
    author: '',
    members: [],
    budget: 0,
    period: 1,
    tags: [],
    itinerary: [],
    planId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setPlan: () => {},
});

export const UserContext = createContext<{
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}>({
  user: {
    userId: '',
    nickname: '',
  },
  setUser: () => {},
});