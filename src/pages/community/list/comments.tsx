import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState, useCallback } from 'react';
import { DateTime } from 'luxon';

import { UserContext } from '@/contexts';
import { Plan, Article } from '@/types';
import { deletePlan, getPlans } from '@/services/plansService';
import { getArticles } from '@/services/articlesService';

import Sidebar from '@/components/Sidebar';
import BtmNavbar from '@/components/BtmNavbar';
import Topbar from '@/components/Topbar';

import plusCircle from '../../../../public/pluscircle.svg';

const MyCommentsPage: NextPage = ({}) => {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const [curPage, setCurPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const perPage = 10;

  const onPrevPage = useCallback(() => {
    setCurPage((page) => {
      return Math.max(page - 1, 1);
    });
  }, [setCurPage]);

  const onNextPage = useCallback(() => {
    setCurPage((page) => {
      return Math.min(page + 1, Math.ceil(totalArticles / perPage));
    });
  }, [setCurPage, totalArticles]);

  useEffect(() => {
    getArticles({
      skip: (curPage - 1) * perPage,
      limit: perPage,
    }).then((result) => {
      setArticles([
        ...result.items.filter((item) =>
          item.comments?.find(
            (comment) => comment.author?.userId === user?.userId,
          ),
        ),
      ]);
      setTotalArticles(articles.length);
    });
  }, [user, curPage, articles]);

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
                    {articles.map(({ title, articleId }, index) => {
                      return (
                        <li key={`plan-${index}`} className="py-3 sm:py-1">
                          <a
                            onClick={() =>
                              router.push(`/community/${articleId}`)
                            }
                            className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                  {title}
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="flex py-6 justify-center btn-group">
                  <button className="btn" onClick={onPrevPage}>
                    «
                  </button>
                  <button className="btn">Page {curPage}</button>
                  <button className="btn" onClick={onNextPage}>
                    »
                  </button>
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
