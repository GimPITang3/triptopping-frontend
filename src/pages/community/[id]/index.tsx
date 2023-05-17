import BtmNavbar from '@/components/BtmNavbar';
import Topbar from '@/components/Topbar';
import { UserContext } from '@/contexts';
import { Plan } from '@/types';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

const ArticlePage: NextPage = ({}) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [delId, setDelId] = useState('');

  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{`커뮤니티`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">

          <Topbar />

          <div>
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    {id + '번째 글'}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BtmNavbar user={user} currentPath={4} />

        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <div className="flex flex-col">
              <div className="avatar placeholder flex justify-center">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                  <span className="text-3xl">{user.nickname.slice(0,1)}</span>
                </div>
              </div>
              <h2 className="card-title justify-center my-4">{user.nickname}</h2>
              <Link href={'/account/' + user.userId} className="flex justify-end">프로필 편집</Link>
            </div>
            <div className="divider"></div>
            <li>
              <Link href="/plan/list">내 여행 계획</Link>
            </li>
            <li>
              <a>내 작성 글</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
