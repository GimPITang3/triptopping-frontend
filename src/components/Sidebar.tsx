import { FC, useCallback, useContext } from 'react';
import Link from 'next/link';

import { UserContext } from '@/contexts';

const Sidebar: FC = () => {
  const { user, setUser, setAccessToken } = useContext(UserContext);

  const onLogout = useCallback(() => {
    setUser(() => undefined);
    setAccessToken(() => undefined);
  }, [setUser, setAccessToken]);

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        {user?.userId ? (
          <div className="flex flex-col">
            <div className="avatar placeholder flex justify-center">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                <span className="text-3xl">{user.nickname.slice(0, 1)}</span>
              </div>
            </div>
            <h2 className="card-title justify-center my-4">{user.nickname}</h2>
            <div className="flex flex-row justify-end gap-x-2">
              <Link
                href={'/account/' + user.userId}
                className="flex justify-end btn btn-primary"
              >
                프로필 편집
              </Link>
              <button className="btn btn-error" onClick={onLogout}>
                로그아웃
              </button>
            </div>
            <div className="divider"></div>
            <li>
              <Link href="/plan/list">내 여행 계획</Link>
            </li>
            <li>
              <Link href="/community/list/articles">내 작성 글</Link>
            </li>
            <li>
              <Link href="/community/list/comments">내 작성 댓글</Link>
            </li>
            <li>
              <Link href="/community/list/likes">내 관심 글</Link>
            </li>
          </div>
        ) : (
          <div>
            <Link href={'/account/login'} className="btn btn-primary">
              로그인
            </Link>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
