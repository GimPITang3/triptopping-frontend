import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { UserContext } from '@/contexts';
import { Plan } from '@/types';
import { NextPage } from 'next';
import Head from 'next/head';
import { DateTime } from 'luxon';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

interface Article {
  articleId: string;
  title: string;
  description: string;
  coverImage?: string | StaticImageData;
  author: string;
}

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
        <div className="drawer-content scrollbar-hide">
          <Topbar />

          <div>
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col justify-between mb-4">
                  <p className="text-2xl mb-4 font-bold leading-none text-gray-900 dark:text-white">
                    {id + '번째 글'}
                  </p>
                  <div className="flex items-center justify-start">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span className="text-lg">심</span>
                      </div>
                    </div>
                    <p className="text-base ml-1">심지수</p>
                    <p className="text-sm text-gray-400 ml-2">| 2023-05-18</p>
                  </div>
                  <div className="divider mb-4"></div>
                  <div>
                    <p>
                      이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                      1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                      글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                      글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                      1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                      글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                      글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                      1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                      글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                      글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                      1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                      글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                      글은 1번째 글{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BtmNavbar currentPath={4} />

        <Sidebar />
      </div>
    </>
  );
};

export default ArticlePage;
