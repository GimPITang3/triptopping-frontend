import { User } from '@/types';

import client from './axiosClient';

export interface UpdateUserDto {
  introduce?: string;
  nickname?: string;
}

export const getUser = async (id: string): Promise<User> => {
  const resp = await client.get<User>(`/users/${id}`);

  return resp.data;
};

export const updateUser = async (
  id: string,
  dto: UpdateUserDto,
): Promise<User> => {
  const resp = await client.patch(`/users/${id}`, { ...dto });

  return resp.data;
};

export const withdrawUser = async (id: string): Promise<void> => {
  await client.delete('/auth/account');
};
