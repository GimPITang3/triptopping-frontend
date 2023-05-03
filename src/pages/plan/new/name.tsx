import { PlanContext } from '@/contexts';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useContext } from 'react';

const Name: FC = () => {
  const router = useRouter();
  const { plan, handlePlan } = useContext(PlanContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handlePlan('name', e.target.value);
  };

  const handleClickNext = () => {
    if (plan.name === '') {
      handlePlan('name', '폭풍을 부르는 우당탕탕 여행기!');
    }
    router.push('/plan/new/num');
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="font-bold text-3xl mb-8">새 여행 계획</div>
      <div className="flex-grow">
        <div className="text-xl my-4">여행 계획의 이름을 정해주세요</div>
        <input
          type="text"
          placeholder="짱친들의 일본 여행!"
          className="input input-bordered w-full"
          value={plan.name}
          onChange={handleChange}
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
