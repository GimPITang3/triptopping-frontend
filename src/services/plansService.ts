import { AxiosResponse } from 'axios';
import client from '@/services/axiosClient';
import { PaginationOptionsDto, PaginationResponseDto, Plan } from '@/types';

export type CreatePlanDto = Pick<
  Partial<Plan>,
  | 'name'
  | 'numberOfMembers'
  | 'budget'
  | 'tags'
  | 'period'
  | 'startDate'
  | 'loc'
>;

export type UpdatePlanDto = Pick<
  Partial<Plan>,
  | 'name'
  | 'budget'
  | 'tags'
  | 'loc'
  | 'period'
  | 'startDate'
  | 'itinerary'
  | 'numberOfMembers'
>;

export const getPlans = async (): Promise<Plan[]> => {
  const resp = await client.get<Plan[]>('/plans');

  return resp.data;
};

export const getPlansOfUser = async (
  userId: string,
  dto: PaginationOptionsDto,
): Promise<PaginationResponseDto<Plan>> => {
  const resp = await client.get<PaginationResponseDto<Plan>>(
    `/users/${userId}/plans`,
    { params: { ...dto } },
  );

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

export const createPlan = async (plan: CreatePlanDto): Promise<Plan> => {
  const resp = await client.post<Plan, AxiosResponse<Plan>>('/plans', plan);

  return resp.data;
};

export const updatePlan = async (
  id: string,
  dto: UpdatePlanDto,
): Promise<Plan> => {
  const resp = await client.patch<Plan>(`/plans/${id}`, dto);

  return resp.data;
};

export const excludePlaces = async (
  id: string,
  placeIds: string[],
): Promise<void> => {
  await client.post(`/plans/${id}/excludes`, {
    placeIds: placeIds,
  });
};

export const addMember = async (id: string, email: string): Promise<Plan> => {
  const resp = await client.post(`/plans/${id}/members`, { email });
  return resp.data;
};
