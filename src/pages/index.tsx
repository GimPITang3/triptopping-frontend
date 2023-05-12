import Topbar from '@/components/Topbar';
import { Plan } from '@/types';
import api from '@/utils/AxiosInstance';
import { DateTime } from 'luxon';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import banner1 from '../../public/topbanner1.jpeg';
import banner2 from '../../public/topbanner2.jpeg';
import younha from '../../public/younha.png';

interface ItineraryListProps {
  planId: string;
  name: string;
  date: Date | undefined;
  period: number;
}

const inter = Inter({ subsets: ['latin'] });

const TestComponent: FC<PropsWithChildren> = ({ children }) => {
  return <></>;
};

const ItineraryList: FC<ItineraryListProps> = ({
  planId,
  name,
  date,
  period,
}) => {
  let dateString = date
    ? (() => {
        const startDate = DateTime.fromISO(date.toISOString());
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
      href={'/plan/' + planId}
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

const CommunityCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="card shrink-0 w-72 bg-base-100 shadow-xl">
      <figure>
        <Image src={younha} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-name">지리는 여행</h2>
        <div className="badge badge-secondary">NEW</div>
        <p>그녀의 쌀국수 여행기!</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">food</div>
          <div className="badge badge-outline">1st</div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const router = useRouter();
  const [planList, setPlanList] = useState<Plan[]>([]);

  useEffect(() => {
    const SetPlanList = async () => {
      const { data } = await api.get<Plan[]>('/plans');
      setPlanList(data.slice(0, 3));
    };
    SetPlanList();
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
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                  내 여행 계획
                </h5>
                <button
                  className="link text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  onClick={() => router.push('/plan/list')}
                >
                  View all
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
          </div>

          <div className="p-4 my-4">
            <div className="font-bold pb-4 text-xl">커뮤니티</div>
            <div className="relative w-full flex gap-6 snap-x snap-mandatory scroll-smooth overflow-x-auto pb-14 scrollbar-hide">
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
              <CommunityCard />
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <div className="btm-nav container mx-auto max-w-screen-md">
            <button className="text-primary active">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="h-5 w-5"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
              </svg>
            </button>
            <Link href="/plan/new/name">
              <button className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="h-5 w-5"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"
                  />
                  <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                </svg>
              </button>
            </Link>
            <button className="text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="h-5 w-5"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </button>
          </div>
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
