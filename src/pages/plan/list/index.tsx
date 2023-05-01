import { GetServerSideProps, NextPage } from 'next';
import { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Topbar from '@/components/Topbar';
import plusCircle from '../../../../public/pluscircle.svg'

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

const ItineraryList: FC<PropsWithChildren> = ({ children }) => {
    return (
      <a href="#" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
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
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                수정
              </button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-red-700 focus:text-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-red-500 dark:focus:text-white">
                삭제
              </button>
            </div>
          </div>
        </div>
      </a>
    );
  };

const PlanPage: NextPage = ({}) => {
  const router = useRouter();

  return (
    <>
      <Topbar />

      <div>
          <div className="p-4 pt-8">
          <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                내 여행 계획
              </h5>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                <li className="py-3 sm:py-1">
                  <a href="/plan/new/name" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center space-x-4">
                      <Image src={plusCircle} alt="#" />
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        새 여행계획을 만들어보세요
                      </p>
                    </div>
                  </a>
                </li>
                <li className="py-3 sm:py-1">
                  <ItineraryList />
                </li>
                <li className="py-3 sm:py-1">
                  <ItineraryList />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanPage;
