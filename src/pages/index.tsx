import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

import { UserContext } from '@/contexts';

import { getArticles } from '@/services/articlesService';
import { getPlansOfUser } from '@/services/plansService';

import { Article, Plan } from '@/types';

import BtmNavbar from '@/components/BtmNavbar';
import CommunityCard from '@/components/CommunityCard';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import UserProfileImage from '@/components/UserProfileImage';

import banner1 from '../../public/topbanner1.jpeg';
import banner2 from '../../public/topbanner2.jpeg';

const ItineraryList: FC<{ plan: Plan }> = ({ plan }) => {
  const dateString = plan.startDate
    ? (() => {
        const startDate = DateTime.fromISO(
          new Date(plan.startDate).toISOString(),
        );
        const endDate = startDate.plus({ days: plan.period });
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
    : plan.period - 1 + '박' + plan.period + '일';

  return (
    <Link
      href={'/plan/details/' + plan.planId}
      className="flex p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div className="grow flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {plan.name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {dateString}
          </p>
        </div>
      </div>
      <div>
        <div className="avatar-group -space-x-6">
          {[...(plan.members || []), ...(plan.author ? [plan.author] : [])].map(
            (member) => {
              return (
                <div
                  key={member.userId}
                  className="avatar border-gray-100 w-12 h-12 relative"
                >
                  <UserProfileImage user={member} />
                </div>
              );
            },
          )}
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
    getArticles({ limit: 4, skip: 0 }).then((articles) => {
      setArticles(articles.items);
      console.log(articles.items[0].plan);
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
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#item2" className="btn btn-circle bg-gray-400/30">
                  ❮
                </a>
                <a href="#item2" className="btn btn-circle bg-gray-400/30">
                  ❯
                </a>
              </div>
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
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#item1" className="btn btn-circle bg-gray-400/30">
                  ❮
                </a>
                <a href="#item1" className="btn btn-circle bg-gray-400/30">
                  ❯
                </a>
              </div>
              <div className="absolute bottom-10 left-10 text-white text-xl font-bold">
                여행 계획을 세워보세요
              </div>
            </div>
          </div>

          <div className="p-4 pt-8">
            <div className="flex flex-col w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 min-h-[348px]">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white sm:ms-2">
                  {user ? `${user?.nickname}님의 여행 계획` : '여행 계획'}
                </h5>
                {user ? (
                  <button
                    className="btn btn-ghost text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 flex items-center my-2"
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
                ) : (
                  ''
                )}
              </div>
              {user ? (
                <div className="flow-root">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                  >
                    {planList.map((plan, index) => {
                      return (
                        <li key={`plan-${index}`} className="py-3 sm:py-1">
                          <ItineraryList plan={plan} />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-center items-center grow">
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push('/account/login')}
                  >
                    로그인이 필요합니다
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 my-4">
            <div className="flex justify-between">
              <div className="font-bold pb-4 text-xl">커뮤니티</div>
              <button
                className="btn btn-ghost text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 flex items-center my-2"
                onClick={() => router.push('/community')}
              >
                <div>더보기</div>
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
            <div className="w-full pb-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article, i) => (
                <div className="basis-1/2" key={i}>
                  <CommunityCard
                    article={article}
                    // coverImage={article.coverImage} // TODO:
                    tags={article.plan?.tags}
                  />
                </div>
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
