import { FC } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { DateTime } from 'luxon';

import younha from '../../public/younha.png';
import { Article } from '@/types';
import UserProfileImage from './UserProfileImage';

const CommunityCard: FC<{
  article: Article;
  tags?: string[];
  coverImage?: string | StaticImageData;
}> = ({ article, tags, coverImage }) => {
  const diffTimes = DateTime.now().diff(
    DateTime.fromISO(article.createdAt),
    'hours',
  );
  const diffHours = diffTimes.toObject().hours;
  const isNew = diffHours ? diffHours < 24 : false;

  return (
    <Link
      href={`/community/${article.articleId}`}
      className="block p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div className="card shrink-0 bg-base-100 shadow-xl">
        <figure className="relative w-full aspect-square">
          {
            coverImage ? (
              <Image
                src={coverImage || younha}
                fill
                alt={''}
                className="object-cover"
              />
            ) : (
              <svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
            )
          }
        </figure>
        <div className="card-body">
          <h2 className="card-name font-bold text-xl truncate">
            {article.title || '지리는 여행'}
          </h2>
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <p className="ml-1">{article?.likes?.length}</p>
            {isNew ? (
              <div className="badge badge-secondary place-self-end">NEW</div>
            ) : (
              ''
            )}
          </div>
          <p className="line-clamp-2">{article.content}</p>
          <div className="card-actions flex items-center justify-end">
            <div className="avatar w-8 aspect-square rounded-full placeholder relative overflow-hidden">
              {article.author ? (
                <UserProfileImage user={article.author} />
              ) : (
                <></>
              )}
            </div>
            <p>{article.author ? article.author.nickname : ''}</p>
          </div>
          <div className="flex flex-row">
            {tags
              ? tags.splice(0, 2).map((tag, index) => (
                  <div key={`tag-${index}`} className="badge badge-outline mr-2">
                    {tag}
                  </div>
                ))
              : ''
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
