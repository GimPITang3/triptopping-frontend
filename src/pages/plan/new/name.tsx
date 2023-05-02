import { useRouter } from 'next/router';
import { ChangeEvent, FC, useContext } from 'react';
import { PlanContext } from '@/contexts';

const Name: FC = () => {
  const router = useRouter();
  const { plan, handlePlan } = useContext(PlanContext);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handlePlan('name', e.target.value);
  };

  return (
    <div className="relative min-h-screen">
      <div>이름을 설정해주세요.</div>
      <input
        type="text"
        placeholder="이름"
        className="input input-bordered w-full max-w-xs"
        value={plan.name}
        onChange={handleChange}
      />
      <div className="absolute bottom-1 right-1 space-x-2">
        <button className="btn" onClick={() => router.push('/')}>
          취소
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/plan/new/num')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Name;
