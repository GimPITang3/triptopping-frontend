import { User } from '@/types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FC } from 'react';

const Sidebar: FC<{
  user: User
}> = ({
  user
}) => {
  const router = useRouter();

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        {user.userId ?
          (<div className="flex flex-col">
          <div className="avatar placeholder flex justify-center">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
              <span className="text-3xl">{user.nickname.slice(0,1)}</span>
            </div>
          </div>
          <h2 className="card-title justify-center my-4">{user.nickname}</h2>
          <Link href={'/account/' + user.userId} className="flex justify-end">프로필 편집</Link>
          </div>) : 
          (<div><Link href={'/account/login'} className="mx-4">로그인 해주세요.</Link></div>)
        }
        <div className="divider"></div>
        <li>
          <Link href="/plan/list">내 여행 계획</Link>
        </li>
        <li>
          <a>내 작성 글</a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;