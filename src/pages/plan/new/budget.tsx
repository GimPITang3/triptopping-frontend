import { FC, useState } from 'react';
import { useRouter } from 'next/router';

const Budget: FC = () => {
  const router = useRouter();
  const [budget, setBudget] = useState('');
  const addBudget = (num: number) => {
    const removedCommaValue: number = Number(budget.replaceAll(",", ""));
    changeEnteredBudget((removedCommaValue + num).toString());
  };
  const changeEnteredBudget = (value: string) => {
    const removedCommaValue: number = Number(value.replaceAll(/[^0-9]/gi, ""));
    setBudget(removedCommaValue.toLocaleString());
  };
  return (
    <div className="relative min-h-screen">
      <div>예산을 설정해주세요.</div>
      <div className="form-control">
        <label className="input-group">
          <span>금액</span>
          <input type="text" value={budget} onChange={(e) => changeEnteredBudget(e.target.value)} className="input input-bordered text-right" />
          <span>원</span>
        </label>
      </div>
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button 
          type="button" 
          className="px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => addBudget(10000)}
        >
          +1만
        </button>
        <button 
          type="button" 
          className="px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => addBudget(50000)}
        >
          +5만
        </button>
        <button 
          type="button" 
          className="px-5 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => addBudget(100000)}
        >
          +10만
        </button>
        <button 
          type="button" 
          className="px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => addBudget(1000000)}
        >
          +100만
        </button>
      </div>
      <div className="absolute bottom-1 right-1 space-x-2">
        <button className="btn" onClick={() => router.push('/')}>
          취소
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/plan/new/date')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Budget;
