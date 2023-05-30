import { PlanContext } from '@/contexts';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';

const Budget: FC = () => {
  const router = useRouter();
  const { plan, setPlan } = useContext(PlanContext);
  const [budgetString, setBudgetString] = useState('');

  const addBudget = (num: number) => {
    setBudgetString((plan.budget + num).toLocaleString());
    setPlan({ ...plan, budget: plan.budget + num });
  };
  const changeEnteredBudget = (e: ChangeEvent<HTMLInputElement>) => {
    const budget = Number(e.target.value.replace(/\,/g, ''));
    if (isNaN(budget)) {
      setBudgetString('');
    } else {
      setBudgetString(budget.toLocaleString());
    }
    setPlan({ ...plan, budget: budget ? budget : 0 });
  };

  console.log(plan);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Head>
        <title>여행 계획 설정 - 예산</title>
      </Head>

      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="flex-grow">
        <div className="text-xl my-4">예산을 설정해주세요.</div>
        <div className="flex flex-col py-8 max-w-md mx-auto">
          <div className="form-control flex-shrink">
            <label className="input-group flex">
              <span className="shrink-0">금액</span>
              <input
                type="text"
                value={budgetString}
                onChange={changeEnteredBudget}
                className="input input-bordered text-right grow min-w-0"
              />
              <span>원</span>
            </label>
          </div>
          <div
            className="grid grid-cols-2 sm:grid-cols-4 rounded-md shadow-sm"
            role="group"
          >
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium border text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              onClick={() => addBudget(10000)}
            >
              +1만
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium border text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              onClick={() => addBudget(50000)}
            >
              +5만
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium border text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              onClick={() => addBudget(100000)}
            >
              +10만
            </button>
            <button
              type="button"
              className="px-5 py-2 text-sm font-medium border text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
              onClick={() => addBudget(1000000)}
            >
              +100만
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full space-x-4">
        <button
          className="flex-1 btn"
          onClick={() => router.push('/plan/new/city')}
        >
          뒤로가기
        </button>
        <button
          className="flex-1 btn btn-primary"
          onClick={() => router.push('/plan/new/date')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Budget;
