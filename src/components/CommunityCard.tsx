import { FC } from 'react';
import Image, { StaticImageData } from 'next/image';

import younha from '../../public/younha.png';

const CommunityCard: FC<{
  title?: string;
  description?: string;
  coverImage?: string | StaticImageData;
}> = ({ title, description, coverImage }) => {
  return (
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
        <h2 className="card-name font-bold text-xl">
          {title || '지리는 여행'}
        </h2>
        <div className="badge badge-secondary">NEW</div>
        <p>{description || '그녀의 쌀국수 여행기!'}</p>
        <div className="card-actions justify-end">
          {['food', '1st'].map((tag, i) => (
            <div className="badge badge-outline" key={i}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
