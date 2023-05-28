import client from './axiosClient';

import { Article } from '@/types';

interface PaginationOptionsDto {
  skip: number;
  limit: number;
}

interface PaginationResponseDto<T> {
  items: T[];

  skip: number;
  limit: number;
  total: number;
}

interface CreateArticleDto {
  title: string;
  content: string;
  planId: string;
}

interface UpdateArticleDto {
  title?: string;
  content?: string;
}

interface CreateCommentDto {
  content: string;
}

interface UpdateCommentDto {
  content: string;
}

export const getArticles = async (
  dto: PaginationOptionsDto,
): Promise<PaginationResponseDto<Article>> => {
  const resp = await client.get(`/articles`, {
    params: {
      ...dto,
    },
  });

  return resp.data;
};

export const getArticle = async (id: string): Promise<Article> => {
  const resp = await client.get<Article>(`/articles/${id}`);

  return resp.data;
};

export const createArticle = async (dto: CreateArticleDto) => {
  const resp = await client.post<Article>(`/articles`, dto);

  return resp.data;
};

export const updateArticle = async (id: string, dto: UpdateArticleDto) => {
  const resp = await client.patch<Article>(`/articles/${id}`, dto);

  return resp.data;
};

export const deleteArticle = async (id: string) => {
  await client.delete(`/articles/${id}`);
};

export const createComment = async (
  articleId: string,
  dto: CreateCommentDto,
): Promise<Article> => {
  const resp = await client.post<Article>(
    `/articles/${articleId}/comments`,
    dto,
  );

  return resp.data;
};

export const updateComment = async (
  articleId: string,
  commentId: string,
  dto: UpdateCommentDto,
): Promise<Article> => {
  const resp = await client.patch<Article>(
    `/articles/${articleId}/comments/${commentId}`,
    dto,
  );

  return resp.data;
};

export const deleteComment = async (
  articleId: string,
  commentId: string,
): Promise<Article> => {
  const resp = await client.delete<Article>(
    `/articles/${articleId}/comments/${commentId}`,
  );

  return resp.data;
};

export const incLikes = async (articleId: string): Promise<Article> => {
  const resp = await client.post<Article>(`/articles/${articleId}/likes`);

  return resp.data;
};
