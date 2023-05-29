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
          <Image
            src={coverImage || younha}
            fill
            alt={''}
            className="object-cover"
          />
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
          {tags
            ? tags.splice(0, 2).map((tag, index) => (
                <div key={`tag-${index}`} className="badge badge-outline">
                  {tag}
                </div>
              ))
            : ''}
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
