import { Plan, User } from '@/types';
import { SetStateAction, createContext, Dispatch } from 'react';

export const PlanContext = createContext<{
  plan: Plan;
  setPlan: Dispatch<SetStateAction<Plan>>;
  clearPlan: () => void;
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
    loc: { lat: 0, lng: 0 },
    planId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setPlan: () => {},
  clearPlan: () => {},
});

export const UserContext = createContext<{
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  accessToken: string | undefined;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
}>({
  user: {
    userId: '',
    nickname: '',
    email: '',
    introduce: '',
    google: {},
  },
  setUser: () => {},
  accessToken: '',
  setAccessToken: () => {},
});
