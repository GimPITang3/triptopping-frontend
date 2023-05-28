import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

import { UserContext } from '@/contexts';
import { Article, Plan } from '@/types';

import { getPlansOfUser } from '@/services/plansService';
import { getArticles } from '@/services/articlesService';

import CommunityCard from '@/components/CommunityCard';
import Topbar from '@/components/Topbar';
import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';

import banner1 from '../../public/topbanner1.jpeg';
import banner2 from '../../public/topbanner2.jpeg';

interface ItineraryListProps {
  planId: string;
  name: string;
  date: Date | undefined;
  period: number;
}

const ItineraryList: FC<ItineraryListProps> = ({
  planId,
  name,
  date,
  period,
}) => {
  let dateString = date
    ? (() => {
        const startDate = DateTime.fromISO(new Date(date).toISOString());
        const endDate = startDate.plus({ days: period });
        const diff = startDate.diff(DateTime.now(), ['days']).days;
        const dDay = Math.ceil(diff);

        return (
          'D-' +
          (dDay === 0 ? 'day' : dDay) +
          ' | ' +
          startDate.toFormat('MM.dd(EEE)') +
          ' - ' +
          endDate.toFormat('MM.dd(EEE)')
        );
      })()
    : period - 1 + '박' + period + '일';

  return (
    <Link
      href={'/plan/details/' + planId}
      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {dateString}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Home: NextPage = () => {
  const router = useRouter();

  const { user } = useContext(UserContext);
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!user) return;

    getPlansOfUser(user.userId, { limit: 3, skip: 0 }).then((plans) => {
      setPlanList(plans.items);
    });
  }, [user]);

  useEffect(() => {
    getArticles({ limit: 3, skip: 0 }).then((articles) => {
      setArticles(articles.items);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Trip Topping</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
          <Topbar />

          <div className="carousel w-full h-72">
            <div id="item1" className="carousel-item w-full relative">
              <Image
                className="object-cover"
                src={banner1}
                alt=""
                priority={true}
              />
              <div className="absolute bottom-10 left-10 text-white text-xl font-bold">
                TripTopping
              </div>
            </div>
            <div id="item2" className="carousel-item w-full relative">
              <Image
                className="object-cover"
                src={banner2}
                alt=""
                priority={true}
              />
              <div className="absolute bottom-10 left-10 text-white text-xl font-bold">
                트으립토핑
              </div>
            </div>
          </div>

          <div className="p-4 pt-8">
            {user ? (
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    {`${user?.nickname}님의 여행 계획`}
                  </h5>
                  <button
                    className="btn btn-ghost text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 flex items-center"
                    onClick={() => router.push('/plan/list')}
                  >
                    <div>모두 보기</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flow-root">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {planList.map(
                      ({ planId, name, startDate, period }, index) => {
                        return (
                          <li key={`plan-${index}`} className="py-3 sm:py-1">
                            <ItineraryList
                              planId={planId}
                              name={name}
                              date={startDate}
                              period={period}
                            />
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <Link className="link link-primary" href="/account/login">
                  로그인
                </Link>{' '}
                하세요
              </div>
            )}
          </div>

          <div className="p-4 my-4">
            <div className="font-bold pb-4 text-xl">커뮤니티</div>
            <div className="relative w-full flex gap-6 snap-x snap-mandatory scroll-smooth overflow-x-auto pb-14 scrollbar-hide">
              {articles.map((article, i) => (
                <CommunityCard
                  key={i}
                  article={article}
                  // coverImage={article.coverImage} // TODO:
                />
              ))}
            </div>
          </div>
        </div>

        <BtmNavbar currentPath={1} />

        <Sidebar />
      </div>
    </>
  );
};

export default Home;
