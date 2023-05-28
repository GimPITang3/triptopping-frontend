import { FC } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import younha from '../../public/younha.png';
import { Article } from '@/types';

const CommunityCard: FC<{
  article: Article;
  coverImage?: string | StaticImageData;
}> = ({ article, coverImage }) => {
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
          <div className="badge badge-secondary">NEW</div>
          <p className="line-clamp-2">{article.content}</p>
          <div className="card-actions flex items-center justify-end">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span className="text-lg">
                  {article.author && article.author.nickname
                    ? article.author.nickname.slice(0, 1)
                    : ''}
                </span>
              </div>
            </div>
            <p>{article.author && article.author.nickname}</p>
            {['food', '1st'].map((tag, i) => (
              <div className="badge badge-outline" key={i}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
