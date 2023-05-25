import { useCallback, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

import { UserContext } from '@/contexts';
import { Article } from '@/types';
import { getArticle } from '@/services/articlesService';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const ArticlePage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);
  const [article, setArticle] = useState<Article>();
  const [delId, setDelId] = useState('');

  const { id } = router.query;

  const prevArticle = useCallback(() => {
    // TODO:
  }, []);
  const nextArticle = useCallback(() => {
    // TODO:
  }, []);

  useEffect(() => {
    if (typeof id !== 'string') return;

    getArticle(`${id}`).then((article) => {
      setArticle(article);
    });
  }, [id]);

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
                    {article?.title}
                  </p>
                  <div className="flex items-center justify-start">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span className="text-lg">
                          {article?.author.nickname.slice(0, 1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-base ml-1">{article?.author.nickname}</p>
                    <p className="text-sm text-gray-400 ml-2">
                      {article?.createdAt !== undefined &&
                        DateTime.fromISO(article.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="divider mb-4"></div>
                  <div>
                    <p>{article?.content}</p>
                  </div>

                  <div className="divider"></div>
                  <p className="mb-2">댓글 3개</p>
                  <div className="overflow-x-auto text-sm mb-12">
                    <table className="table w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold">아무개</td>
                          <td>아무 댓글</td>
                          <td>05-21</td>
                        </tr>
                        <tr>
                          <td className="font-bold">아무개</td>
                          <td>아무 댓글</td>
                          <td>05-21</td>
                        </tr>
                        <tr>
                          <td className="font-bold">아무개</td>
                          <td>아무 댓글</td>
                          <td>05-21</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn mr-2"
                      onClick={prevArticle}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="btn mr-2"
                      onClick={nextArticle}
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn mr-2"
                    >
                      목록
                    </button>
                  </div>
                  <div className="divider mb-16"></div>
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
