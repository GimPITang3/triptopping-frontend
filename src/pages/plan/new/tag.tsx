import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

import { PlanContext } from '@/contexts';
import { createPlan } from '@/services/plansService';

const LoadingMessage: FC = () => {
  const messages = [
    '여행 #태그 취향을 분석중이에요!',
    '여행 일정을 생각중이에요!',
    '유명 여행지를 찾아보고 있어요!',
    '여행 일정을 배분하고 있어요!',
    '여행 계획을 작성중이에요!',
  ];
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((currentIndex) => {
        const newIndex = currentIndex + 1;
        if (newIndex < messages.length) {
          setMessage(messages[newIndex]);
          return newIndex;
        } else {
          clearInterval(timer);
          return currentIndex;
        }
      });
    }, 2000);

    return () => clearInterval(timer); // 컴포넌트가 unmount 되었을 때 타이머를 정리합니다.
  }, [messages]);

  return (
    <div>
      {message}
    </div>
  );
};;

const Tag: FC = () => {
  const router = useRouter();

  const { plan, setPlan } = useContext(PlanContext);

  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState('');

  const addTag = () => {
    if (!tag) return;

    setPlan({ ...plan, tags: [...plan.tags, tag] });
    setTag('');
  };

  const delTag = (tag: string) => {
    setPlan({ ...plan, tags: plan.tags.filter((item) => item !== tag) });
  };

  const onClickCreate = () => {
    setLoading(true);

    createPlan({
      ...plan,
    })
      .then((plan) => {
        setLoading(false);

        router.push('/plan/' + plan.planId);
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err);
        alert(err.response.data.message);
      });
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Head>
        <title>여행 계획 설정 - 태그</title>
      </Head>

      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="flex-grow">
        <div className="text-xl my-4">여행 태그를 입력해주세요.</div>
        <div className="py-8 min-h-[160px]">
          {plan.tags.map((tag, index) => (
            <div
              key={`tag-${index}`}
              className="badge badge-lg badge-outline mb-2 mr-2"
            >
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
          className={'flex-1 btn' + (loading ? ' btn-disabled' : '')}
          onClick={() => router.push('/plan/new/date')}
        >
          뒤로가기
        </button>
        <button
          className={
            'flex-1 btn btn-primary' + (loading ? ' btn-disabled' : '')
          }
          onClick={onClickCreate}
        >
          생성
        </button>
      </div>

      {loading ? (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-500/20">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <div className="mt-4">
            <LoadingMessage />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tag;
