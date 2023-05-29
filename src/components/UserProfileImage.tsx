import { FC } from 'react';
import Image from 'next/image';

import { User } from '@/types';

const UserProfileImage: FC<{ user: User }> = ({ user }) => {
  return (
    <>
      {user.google.profileUrl ? (
        <Image
          src={user.google.profileUrl}
          alt="user profile image"
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-neutral-focus text-neutral-content">
          <div className="w-full h-full flex flex-row justify-center items-center">
            <div>{user.nickname.slice(0, 1)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileImage;
