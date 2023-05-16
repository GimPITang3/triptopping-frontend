import client from './axiosClient';

export const loginWithGoogle = async () => {
  await client.get('/auth/google');
};
