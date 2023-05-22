import client from './axiosClient';

import { Article } from '@/types';

export const getArticle = async (id: string): Promise<Article> => {
  const resp = await client.get<Article>(`/articles/${id}`);

  return resp.data;
};

export const createArticle = async () => {
  // TODO:
};

export const updateArticle = async () => {
  // TODO:
};

export const deleteArticle = async () => {
  // TODO:
};
