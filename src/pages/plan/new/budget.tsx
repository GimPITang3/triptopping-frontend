import { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { PlanContext } from '@/contexts';

const Budget: FC = () => {
  const router = useRouter();
  const { handlePlan } = useContext(PlanContext);
  const [budget, setBudget] = useState('0');

  const addBudget = (num: number) => {
    const removedCommaValue: number = Number(budget.replaceAll(',', ''));
    changeEnteredBudget((removedCommaValue + num).toString());
    handlePlan('budget', removedCommaValue + num);
  };
  const changeEnteredBudget = (value: string) => {
    const removedCommaValue: number = Number(value.replaceAll(/[^0-9]/gi, ''));
    setBudget(removedCommaValue.toLocaleString());
    handlePlan('budget', removedCommaValue);
  };
  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="font-bold text-3xl mb-8">
        여행 계획 이름 대충 넣어줭
      </div>
      <div className="flex-grow">
        <div className="text-xl my-4">예산을 설정해주세요.</div>
        <div className="flex flex-col py-8 max-w-md mx-auto">
          <div className="form-control flex-shrink">
            <label className="input-group flex">
              <span>금액</span>
              <input
                type="text"
                value={budget}
                onChange={(e) => changeEnteredBudget(e.target.value)}
                className="input input-bordered text-right grow"
              />
              <span>원</span>
            </label>
          </div>
          <div className="inline-flex rounded-md shadow-sm flex-shrink" role="group">
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
      <div className="flex w-full space-x-4">
        <button className="flex-1 btn" onClick={() => router.push('/plan/new/num')}>
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
