import { IPlan } from '@/types';
import { createContext } from 'react';

export const PlanContext = createContext<{
  plan: IPlan;
  handlePlan: (key: string, value: any) => void;
}>({
  plan: { name: '', num: 0 },
  handlePlan: () => {},
});
