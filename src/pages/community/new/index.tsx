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
import { FC, useContext, useState } from 'react';

const NewArticlePage: NextPage = ({}) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

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
                <div className="flex flex-col mb-4">
                  <input type="text" placeholder="제목을 입력하세요." className="mb-4 input input-bordered w-full max-w-xs" />
                  <textarea className="textarea textarea-bordered h-64" placeholder="내용을 입력하세요."></textarea>
                </div>
                <div className="flex justify-end">
                  <button className="btn btn-primary">등록</button>
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

export default NewArticlePage;
