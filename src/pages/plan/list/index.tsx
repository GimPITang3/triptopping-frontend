import Topbar from '@/components/Topbar';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import axios from '@/utils/AxiosInstance';
import {
  FC,
  PropsWithChildren,
  useState,
  useEffect,
  MouseEventHandler,
} from 'react';
import plusCircle from '../../../../public/pluscircle.svg';
import { Plan } from '@/types';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

interface ItineraryListProps {
  planId: string;
  name: string;
  date: Date | undefined;
  period: number;
  onClickDelPlan: Function;
}

const ItineraryList: FC<ItineraryListProps> = ({
  planId,
  name,
  date,
  period,
  onClickDelPlan,
}) => {
  const router = useRouter();

<<<<<<< HEAD
  let dateString = date ? (()=>{
    console.log(date);
    const startDate = DateTime.fromISO(new Date(date).toISOString());
    const endDate = startDate.plus({days: period});
    const diff = startDate.diff(DateTime.now(), ['days']).days;
    const dDay = Math.ceil(diff);
=======
  let dateString = date
    ? (() => {
        const startDate = DateTime.fromISO(date.toISOString());
        const endDate = startDate.plus({ days: period });
        const diff = startDate.diff(DateTime.now(), ['days']).days;
        const dDay = Math.ceil(diff);
>>>>>>> b4249f0bd05d70118bb81aea87aad98db5e39a3d

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
<<<<<<< HEAD
    <a onClick={() => router.push('/')} className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
=======
    <a
      href={'/plan/' + planId}
      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
>>>>>>> b4249f0bd05d70118bb81aea87aad98db5e39a3d
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {dateString}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
<<<<<<< HEAD
          <div className="btn-group">
            <label onClick={(e) => {e.stopPropagation(); router.push('/plan/' + planId);}} className="btn">수정</label>
            <label onClick={(e) => {e.stopPropagation(); onClickDelPlan(planId);}} htmlFor="del-modal" className="btn btn-secondary">삭제</label>
=======
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => router.push('/plan/' + planId)}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              수정
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-2 focus:ring-red-700 focus:text-red-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-red-500 dark:focus:text-white"
            >
              <label onClick={() => onClickDelPlan(planId)} htmlFor="del-modal">
                삭제
              </label>
            </button>
>>>>>>> b4249f0bd05d70118bb81aea87aad98db5e39a3d
          </div>
        </div>
      </div>
    </a>
  );
};

const PlanPage: NextPage = ({}) => {
  const router = useRouter();
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [delId, setDelId] = useState('');

  const handleDelId = (id: string) => {
    setDelId(id);
  };

  const delPlan = () => {
    setPlanList(planList.filter((item) => item.planId !== delId));
    console.log(planList);
  };

  useEffect(() => {
    const SetPlanList = async () => {
      const { data } = await axios.get<Plan[]>('/plans');
      setPlanList(data);
    };
    SetPlanList();
  }, []);

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <input type="checkbox" id="del-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">일정이 삭제돼요</h3>
              <p className="py-4">
                선택하신 일정이 삭제됩니다. 삭제하시겠습니까?
              </p>
              <div className="modal-action">
                <label
                  onClick={delPlan}
                  htmlFor="del-modal"
                  className="btn btn-primary"
                >
                  예
                </label>
                <label htmlFor="del-modal" className="btn">
                  아니오
                </label>
              </div>
            </div>
          </div>

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
                      <Link
                        href="/plan/new/name"
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <Image src={plusCircle} alt="#" />
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            새 여행계획을 만들어보세요
                          </p>
                        </div>
                      </Link>
                    </li>
                    {planList.map(
                      ({ planId, name, startDate, period }, index) => {
                        return (
                          <li key={`plan-${index}`} className="py-3 sm:py-1">
                            <ItineraryList
                              planId={planId}
                              name={name}
                              date={startDate}
                              period={period}
                              onClickDelPlan={handleDelId}
                            />
                          </li>
                        );
                      },
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
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

export default PlanPage;
