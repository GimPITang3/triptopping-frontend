import { ChangeEvent, useContext, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import Image from 'next/image';
import { DateTime } from 'luxon';

import { UpdatePlanDto, updatePlan } from '@/services/plansService';

import { PlanContext } from '@/contexts';

import dash from '../../../public/dash.svg';
import plus from '../../../public/plus.svg';

const ModifyPlanModal: React.FC = () => {
  const { plan, setPlan } = useContext(PlanContext);

  const [tabIndex, setTabIndex] = useState(0);
  const [tag, setTag] = useState('');
  const [startDateSelected, setStartDateSelected] = useState(true);

  const [planName, setPlanName] = useState(plan.name);
  const [planNumberOfMembers, setPlanNumberOfMembers] = useState(
    plan.numberOfMembers,
  );
  const [planBudget, setPlanBudget] = useState(plan.budget);
  const [planPeriod, setPlanPeriod] = useState(plan.period);
  const [planStartDate, setPlanStartDate] = useState(plan.startDate);
  const [planTags, setPlanTags] = useState(plan.tags);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setPlanName(e.target.value);
  };

  const onChangeNum = (plus: boolean) => {
    setPlanNumberOfMembers((prev) => Math.max(prev + (plus ? 1 : -1), 1));
  };

  const addBudget = (num: number) => {
    setPlanBudget((prev) => Math.max(prev + num, 0));
  };

  const changeEnteredBudget = (e: ChangeEvent<HTMLInputElement>) => {
    const budgetValue = parseInt(e.target.value.replace(/\,/g, ''));

    setPlanBudget(budgetValue);
  };

  const onChangePeriod = (plus: boolean) => {
    setPlanPeriod((prev) => Math.max(prev + (plus ? 1 : -1), 1));
  };

  const handleValueChange = (newValue: any) => {
    const s = DateTime.fromISO(newValue.startDate);
    const e = DateTime.fromISO(newValue.endDate);
    const period = e.diff(s, 'days').days;

    setPlanPeriod(period);
    setPlanStartDate(s.toJSDate());
  };

  const addTag = () => {
    if (!tag) {
      return;
    }
    setPlanTags((prev) => [...prev, tag]);
    setTag('');
  };
  const delTag = (tag: string) => {
    setPlanTags((prev) => prev.filter((item) => item !== tag));
  };

  const GetTab = () => {
    switch (tabIndex) {
      case 0:
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold">새로운 이름을 설정해주세요</h3>
            <input
              value={planName}
              className="input input-bordered py-4 w-full"
              onChange={onChangeName}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <h3 className="text-lg font-bold">인원 수를 설정해주세요</h3>

            <div className="flex py-8 justify-center">
              <button
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangeNum(false)}
              >
                <Image width={32} height={32} src={dash} alt="-" />
              </button>
              <div className="text-4xl font-bold self-center mx-16 rounded">
                {planNumberOfMembers}
              </div>
              <button
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangeNum(true)}
              >
                <Image width={32} height={32} src={plus} alt="+" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-bold">예산을 설정해주세요</h3>

            <div className="flex flex-col py-8 max-w-md mx-auto">
              <div className="form-control flex-shrink">
                <label className="input-group flex">
                  <span>금액</span>
                  <input
                    type="text"
                    value={planBudget.toLocaleString()}
                    onChange={changeEnteredBudget}
                    className="input input-bordered text-right grow"
                  />
                  <span>원</span>
                </label>
              </div>
              <div
                className="inline-flex rounded-md shadow-sm flex-shrink"
                role="group"
              >
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(10000)}
                >
                  +1만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(50000)}
                >
                  +5만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(100000)}
                >
                  +10만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(1000000)}
                >
                  +100만
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="flex-grow">
              <div className="flex justify-center">
                <div className="tabs tabs-boxed bg-white">
                  <a
                    className={`tab tab-lg ${
                      startDateSelected ? 'tab-active' : ''
                    }`}
                    onClick={() => setStartDateSelected(true)}
                  >
                    날짜를 정했어요
                  </a>
                  <a
                    className={`tab tab-lg ${
                      startDateSelected ? '' : 'tab-active'
                    }`}
                    onClick={() => setStartDateSelected(false)}
                  >
                    기간만 정할게요
                  </a>
                </div>
              </div>

              {startDateSelected ? (
                <div>
                  <div className="text-xl my-8">
                    출발 - 도착 날짜를 입력해주세요!
                  </div>
                  <Datepicker
                    value={{
                      startDate: planStartDate || null,
                      endDate:
                        (planStartDate &&
                          DateTime.fromJSDate(planStartDate)
                            .plus({ day: plan.period })
                            .toJSDate()) ||
                        null,
                    }}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </div>
              ) : (
                <div>
                  <div className="text-xl my-8">
                    며칠간 여행하시는지 알려주세요!
                  </div>
                  <div className="flex py-8 justify-center">
                    <button
                      disabled={planStartDate !== undefined}
                      className="btn btn-outline hover:bg-slate-300"
                      onClick={() => onChangePeriod(false)}
                    >
                      <Image width={32} height={32} src={dash} alt="-" />
                    </button>
                    <div className="text-4xl font-bold self-center mx-16 rounded">
                      {planPeriod}
                    </div>
                    <button
                      disabled={planStartDate !== undefined}
                      className="btn btn-outline hover:bg-slate-300"
                      onClick={() => onChangePeriod(true)}
                    >
                      <Image width={32} height={32} src={plus} alt="+" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-2">
            <h3 className="text-lg font-bold">태그를 설정해주세요</h3>
            <div>
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  autoComplete="off"
                  value={tag}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') addTag();
                  }}
                  onChange={(e) => setTag(e.target.value)}
                  type="text"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
                <button
                  onClick={() => addTag()}
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="space-x-2">
              {planTags.map((tag, index) => (
                <div key={`tag-${index}`} className="badge badge-outline">
                  {'#' + tag}
                  <svg
                    onClick={() => delTag(tag)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="hover:bg-slate-200 inline-block w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  const onConfirm = async () => {
    const updatePlanDto: UpdatePlanDto = {
      budget: planBudget,
      name: planName,
      numberOfMembers: planNumberOfMembers,
      period: planPeriod,
      startDate: planStartDate,
      tags: planTags,
    };

    const newPlan = await updatePlan(plan.planId, updatePlanDto);

    setPlan(newPlan);
  };

  return (
    <div>
      <input type="checkbox" id="modify-name-modal" className="modal-toggle" />
      <label htmlFor="modify-name-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="space-y-4">
            <div className="tabs tabs-boxed">
              <a
                onClick={() => setTabIndex(0)}
                className={'tab ' + (tabIndex === 0 ? 'tab-active' : '')}
              >
                이름
              </a>
              <a
                onClick={() => setTabIndex(1)}
                className={'tab ' + (tabIndex === 1 ? 'tab-active' : '')}
              >
                인원 수
              </a>
              <a
                onClick={() => setTabIndex(2)}
                className={'tab ' + (tabIndex === 2 ? 'tab-active' : '')}
              >
                예산
              </a>
              <a
                onClick={() => setTabIndex(3)}
                className={'tab ' + (tabIndex === 3 ? 'tab-active' : '')}
              >
                날짜
              </a>
              <a
                onClick={() => setTabIndex(4)}
                className={'tab ' + (tabIndex === 4 ? 'tab-active' : '')}
              >
                태그
              </a>
            </div>
            {GetTab()}
            <div className="flex flex-row justify-end gap-x-2">
              <label className="btn btn-error" htmlFor="modify-name-modal">
                취소
              </label>
              <label
                className="btn btn-success"
                htmlFor="modify-name-modal"
                onClick={onConfirm}
              >
                확인
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};

export default ModifyPlanModal;
