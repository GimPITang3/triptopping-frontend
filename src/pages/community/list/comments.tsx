import BtmNavbar from '@/components/BtmNavbar';
import Topbar from '@/components/Topbar';
import { UserContext } from '@/contexts';
import { deletePlan, getPlans } from '@/services/plansService';
import { Plan } from '@/types';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';
import plusCircle from '../../../../public/pluscircle.svg';
import Sidebar from '@/components/Sidebar';

const MyCommentsPage: NextPage = ({}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`내 작성 댓글`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">

          <Topbar />

          <div>
            <div className="p-4 pt-8 mb-16">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    내 작성 댓글
                  </h5>
                </div>
                <div className="divider"></div>
                <div className="flow-root">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    <li className="py-3 sm:py-1">
                      <a
                        onClick={() => router.push('/community/1')}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {'아무 댓글'}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {'지수의 군산 콩국수 여행기'}
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li className="py-3 sm:py-1">
                      <a
                        onClick={() => router.push('/community/1')}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {'아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글 아무 댓글'}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {'지수의 군산 콩국수 여행기'}
                            </p>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <BtmNavbar currentPath={4} />
        </div>

        <Sidebar />
      </div>
    </>
  );
};

export default MyCommentsPage;
