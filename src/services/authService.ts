import { User } from '@/types';

import client from './axiosClient';

export interface GoogleSignupDto {
  code: string;
  email: string;
  nickname: string;
  introduce: string;
}

export interface GoogleAuthResponseDto {
  accessToken: string;
  user: User;
}

export const signinWithGoogle = async (
  code: string,
): Promise<GoogleAuthResponseDto> => {
  const resp = await client.post<GoogleAuthResponseDto>('/auth/google/signin', {
    code,
  });

  return resp.data;
};

export const signupWithGoogle = async (
  dto: GoogleSignupDto,
): Promise<GoogleAuthResponseDto> => {
  const resp = await client.post<GoogleAuthResponseDto>('/auth/google/signup', {
    ...dto,
  });

  return resp.data;
};
