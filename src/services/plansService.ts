import { AxiosResponse } from 'axios';
import client from '@/services/axiosClient';
import { Plan } from '@/types';

export const getPlans = async (): Promise<Plan[]> => {
  const resp = await client.get<Plan[]>('/plans');

  return resp.data;
};

export const getPlan = async (id: string): Promise<Plan> => {
  const resp = await client.get<Plan>(`/plans/${id}`);

  return resp.data;
};

export const getPlanDetails = async (id: string): Promise<Plan> => {
  const resp = await client.get<Plan>(`/plans/${id}/detail`);

  return resp.data;
};

export const deletePlan = async (id: string) => {
  await client.delete(`/plans/${id}`);
};

export const createPlan = async (plan: Plan): Promise<Plan> => {
  const resp = await client.post<Plan, AxiosResponse<Plan>>('/plans', plan);

  return resp.data;
};
