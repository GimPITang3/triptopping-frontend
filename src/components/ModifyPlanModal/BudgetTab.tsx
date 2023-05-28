import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

const BudgetTab: FC<{
  planBudget: number;
  setPlanBudget: Dispatch<SetStateAction<number>>;
}> = ({ planBudget, setPlanBudget }) => {
  const changeEnteredBudget = (e: ChangeEvent<HTMLInputElement>) => {
    const budgetValue = parseInt(e.target.value.replace(/\,/g, ''));

    setPlanBudget(budgetValue);
  };

  const addBudget = (num: number) => {
    setPlanBudget((prev) => Math.max(prev + num, 0));
  };

  return (
    <div>
      <div className="text-lg font-bold my-4">변경할 예산을 설정해주세요</div>
      <div className="flex flex-col py-8 max-w-md mx-auto">
        <div className="form-control flex-shrink">
          <label className="input-group flex">
            <span>금액</span>
            <input
              type="text"
              value={planBudget.toLocaleString()}
              onChange={changeEnteredBudget}
              className="input input-bordered text-right grow min-w-0"
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
};

export default BudgetTab;
