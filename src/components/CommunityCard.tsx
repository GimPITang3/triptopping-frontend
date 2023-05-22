import { FC } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';

import younha from '../../public/younha.png';

const CommunityCard: FC<{
  title?: string;
  description?: string;
  coverImage?: string | StaticImageData;
}> = ({ title, description, coverImage }) => {
  return (
    <Link
      href={'/community/' + 1}
      className="block p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div className="card shrink-0 w-72 bg-base-100 shadow-xl">
        <figure className="relative w-72 h-72">
          <Image
            src={coverImage || younha}
            fill
            alt={''}
            className="object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-name font-bold text-xl truncate">
            {title || '지리는 여행'}
          </h2>
          <div className="badge badge-secondary">NEW</div>
          <p className="line-clamp-2">{description || '그녀의 쌀국수 여행기! 쌀국수에는 여러가지 종류가 있는데 얼큰 쌀국수랑 일반 쌀국수랑 그리고 등등이 있는데 거기서 깊은 역사가 존재한다.'}</p>
          <div className="card-actions flex items-center justify-end">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span className="text-lg">심</span>
              </div>
            </div>
            <p>심지수</p>
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
