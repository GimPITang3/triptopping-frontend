import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

import { UserContext } from '@/contexts';
import { deletePlan, getPlansOfUser } from '@/services/plansService';
import { Plan } from '@/types';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

import plusCircle from '../../../../public/pluscircle.svg';

interface ItineraryListProps {
  planId: string;
  name: string;
  date: Date | undefined;
  period: number;
  onClickDelPlan: Function;
  numberOfMembers: number;
}

const ItineraryList: FC<ItineraryListProps> = ({
  planId,
  name,
  date,
  period,
  onClickDelPlan,
  numberOfMembers,
}) => {
  const router = useRouter();

  const dateString = date
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
    <a
      onClick={() => router.push('/plan/details/' + planId)}
      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {name}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {`${dateString} · ${numberOfMembers}명`}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <div>{/* 뭔가 더? */}</div>
          <div className="btn-group">
            <label
              onClick={(e) => {
                e.stopPropagation();
                router.push('/plan/' + planId);
              }}
              className="btn"
            >
              수정
            </label>
            <label
              onClick={(e) => {
                e.stopPropagation();
                onClickDelPlan(planId);
              }}
              htmlFor="del-modal"
              className="btn btn-secondary"
            >
              삭제
            </label>
          </div>
        </div>
      </div>
    </a>
  );
};

const PlanPage: NextPage = ({}) => {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const [planList, setPlanList] = useState<Plan[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [curPage, setCurPage] = useState(1);

  const [delId, setDelId] = useState('');

  const perPage = 10;

  useEffect(() => {
    if (!user) return;

    getPlansOfUser(user.userId, {
      skip: (curPage - 1) * perPage,
      limit: perPage,
    }).then((res) => {
      setPlanList(res.items);
      setTotalPages(Math.ceil(res.total / perPage));
    });
  }, [user, curPage]);

  const onPrevPage = useCallback(() => {
    setCurPage((i) => Math.max(i, 1));
  }, []);

  const onNextPage = useCallback(() => {
    setCurPage((i) => Math.min(i, totalPages));
  }, [totalPages]);

  const onDeletePlan = useCallback((id: string) => {
    setDelId(id);
  }, []);

  const onConfirmDeletePlan = useCallback(() => {
    setPlanList(planList.filter((item) => item.planId !== delId));

    deletePlan(delId);
  }, [delId, planList]);

  return (
    <>
      <Head>
        <title>{`일정 목록`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
          <input type="checkbox" id="del-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">일정이 삭제돼요</h3>
              <p className="py-4">
                선택하신 일정이 삭제됩니다. 삭제하시겠습니까?
              </p>
              <div className="modal-action">
                <label
                  onClick={onConfirmDeletePlan}
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
            <div className="p-4 pt-8 mb-16">
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
                      (
                        { planId, name, startDate, period, numberOfMembers },
                        index,
                      ) => {
                        return (
                          <li key={`plan-${index}`} className="py-3 sm:py-1">
                            <ItineraryList
                              planId={planId}
                              name={name}
                              date={startDate}
                              period={period}
                              onClickDelPlan={onDeletePlan}
                              numberOfMembers={numberOfMembers}
                            />
                          </li>
                        );
                      },
                    )}
                  </ul>

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

          <BtmNavbar currentPath={2} />
        </div>

        <Sidebar />
      </div>
    </>
  );
};

export default PlanPage;
