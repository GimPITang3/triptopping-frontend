import { useRouter } from 'next/router';
import { FC } from 'react';

const Name: FC = () => {
  const router = useRouter();
  return (
    <div className="relative min-h-screen">
      <div>이름을 설정해주세요.</div>
      <input
        type="text"
        placeholder="이름"
        className="input input-bordered w-full max-w-xs"
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
