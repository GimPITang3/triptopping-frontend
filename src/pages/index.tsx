import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import younha from '../../public/younha.png';
import banner1 from '../../public/topbanner1.jpeg';
import banner2 from '../../public/topbanner2.jpeg';
import hamburgur from '../../public/hamburger.svg';
import { FC, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

const TestComponent: FC<PropsWithChildren> = ({ children }) => {
  return <></>;
};

const ItineraryList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
          도쿄 여행
        </p>
        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
          D-1 | 4.17(월) - 4.21(금)
        </p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
        <a
          href="#"
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            aria-hidden="true"
            className="w-4 h-4 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

const CommunityCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="card shrink-0 w-72 bg-base-100 shadow-xl">
      <figure>
        <Image src={younha} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">지리는 여행</h2>
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
  return (
    <>
      <div className="mx-auto px-4">
        <div className="relative flex items-center justify-between h-12">
          <div className="flex-shrink-0 flex items-center font-bold text-xl">
            TripTopping
          </div>
          <Image src={hamburgur} alt="hamburgur" />
        </div>
      </div>

      <div className="carousel w-full h-72">
        <div id="item1" className="carousel-item w-full relative">
          <Image className="object-cover" src={banner1} alt="" />
          <div className="absolute bottom-10 left-10 text-white text-xl font-bold">
            TripTopping
          </div>
        </div>
        <div id="item2" className="carousel-item w-full relative">
          <Image className="object-cover" src={banner2} alt="" />
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
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              View all
            </a>
          </div>
          <div className="flow-root">
            <ul
              role="list"
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              <li className="py-3 sm:py-4">
                <ItineraryList />
              </li>
              <li className="py-3 sm:py-4">
                <ItineraryList />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="font-bold pb-4 text-xl">커뮤니티</div>
        <div
          className="relative w-full flex gap-6 snap-x snap-mandatory scroll-smooth overflow-x-auto pb-14
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        >
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

      <div
        className="fixed z-50 w-full max-w-screen-md h-16 -translate-x-1/2 bg-white border border-gray-200
      bottom-0 left-1/2 dark:bg-gray-700 dark:border-gray-600"
      >
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
          <button
            data-tooltip-target="tooltip-home"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <svg
              className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span className="sr-only">Home</span>
          </button>
          <div
            id="tooltip-home"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Home
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                router.push('/plan/new/name');
              }}
              data-tooltip-target="tooltip-new"
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                ></path>
              </svg>
              <span className="sr-only">New item</span>
            </button>
          </div>
          <div
            id="tooltip-new"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Create new item
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>

          <button
            data-tooltip-target="tooltip-profile"
            type="button"
            className="inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
          >
            <svg
              className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              ></path>
            </svg>
            <span className="sr-only">Profile</span>
          </button>
          <div
            id="tooltip-profile"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Profile
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
