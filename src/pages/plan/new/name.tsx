import { PlanContext, UserContext } from '@/contexts';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useContext, useEffect } from 'react';

const Name: FC = () => {
  const router = useRouter();
  const { plan, setPlan, clearPlan } = useContext(PlanContext);
  const { user, setUser } = useContext(UserContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlan({ ...plan, name: e.target.value });
  };

  const handleClickNext = () => {
    if (plan.name === '') {
      setPlan({
        ...plan,
        name:
          (user.nickname ? user.nickname + '님의 ' : '') +
          '폭풍을 부르는 우당탕탕 여행기!',
      });
    }
    router.push('/plan/new/num');
  };

  useEffect(() => {
    clearPlan();
  }, [clearPlan]);

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Head>
        <title>여행 계획 설정 - 이름</title>
      </Head>

      <div className="font-bold text-3xl mb-8">새 여행 계획</div>
      <div className="flex-grow">
        <div className="text-xl my-4">여행 계획의 이름을 정해주세요</div>
        <input
          type="text"
          placeholder="짱친들의 일본 여행!"
          className="input input-bordered w-full"
          value={plan.name}
          onChange={handleChange}
          onKeyUp={(e) => {
            if (e.key === 'Enter') handleClickNext();
          }}
        />
      </div>
      <div className="flex w-full space-x-4">
        <button className="flex-1 btn" onClick={() => router.push('/')}>
          취소
        </button>
        <button className="flex-1 btn btn-primary" onClick={handleClickNext}>
          다음
        </button>
      </div>
    </div>
  );
};

export default Name;
