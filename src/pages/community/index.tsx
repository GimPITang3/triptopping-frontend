import { useCallback, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { StaticImageData } from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { UserContext } from '@/contexts';
import { deletePlan } from '@/services/plansService';
import { Article, Plan } from '@/types';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import CommunityCard from '@/components/CommunityCard';
import { getArticles } from '@/services/articlesService';

const dummyArticles: {
  title: string;
  description: string;
  coverImage?: string | StaticImageData;
}[] = [
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image3.jpg',
  },
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image1.jpeg',
  },
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image2.jpeg',
  },
];

const CommunityPage: NextPage = ({}) => {
  const router = useRouter();

  const [plan, setPlan] = useState<Plan>();
  const [curPage, setCurPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const perPage = 4;

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
      setArticles(result.items);
      setTotalArticles(result.total);
    });
  }, [curPage]);

  return (
    <>
      <Head>
        <title>{`커뮤니티`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
          <Topbar />

          <div className="mb-16">
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    자유게시판
                  </h5>
                  <div className="flex justify-end">
                    <button
                      onClick={() => router.push('/community/new')}
                      className="btn btn-primary"
                    >
                      글 작성
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    {articles.map((article) => {
                      return (
                        <CommunityCard
                          article={article}
                          key={article.articleId}
                          tags={article.plan?.tags}
                          coverImage={article.coverImageUrl}
                        />
                      );
                    })}
                  </div>
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
        </div>

        <BtmNavbar currentPath={4} />

        <Sidebar />
      </div>
    </>
  );
};

export default CommunityPage;
