import { PlanContext } from '@/contexts';
import { createPlan } from '@/services/plansService';
import { useRouter } from 'next/router';
import { FC, useContext, useState } from 'react';

const Tag: FC = () => {
  const router = useRouter();
  const { plan, setPlan } = useContext(PlanContext);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState('');
  const addTag = () => {
    if (!tag) {
      return;
    }
    setPlan({ ...plan, tags: [...plan.tags, tag] });
    setTag('');
  };
  const delTag = (tag: string) => {
    setPlan({ ...plan, tags: plan.tags.filter((item) => item !== tag) });
  };

  const onClickCreate = () => {
    setLoading(true);
    console.log({
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: '5bf142459b72e12b2b1b2cd',
    });
    console.log(typeof plan.startDate);
    createPlan({
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: '15bf142459b72e12b2b1b2cd',
    }).then((plan) => {
      setLoading(false);
      router.push('/plan/' + plan.planId);
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="flex-grow">
        <div className="text-xl my-4">여행 태그를 입력해주세요.</div>
        <div className="space-x-2 space-y-2 py-8 min-h-[160px]">
          {plan.tags.map((tag, index) => (
            <div key={`tag-${index}`} className="badge badge-lg badge-outline">
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
        <div>
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
              placeholder="맛집"
              required
            />
            <button
              onClick={() => addTag()}
              className="flex-1 btn-primary text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
            >
              추가
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full space-x-4">
        <button
          className="flex-1 btn"
          onClick={() => router.push('/plan/new/date')}
        >
          뒤로가기
        </button>
        <button className="flex-1 btn btn-primary" onClick={onClickCreate}>
          생성
        </button>
      </div>
    </div>
  );
};

export default Tag;
