import { PlanContext } from '@/contexts';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext } from 'react';
import dash from '../../../../public/dash.svg';
import plus from '../../../../public/plus.svg';
import Head from 'next/head';

const Num: FC = () => {
  const router = useRouter();
  const { plan, setPlan } = useContext(PlanContext);
  const onChange = (plus: boolean) => {
    if (plus) {
      setPlan({ ...plan, numberOfMembers: plan.numberOfMembers + 1 });
    } else {
      if (plan.numberOfMembers > 1) {
        setPlan({ ...plan, numberOfMembers: plan.numberOfMembers - 1 });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <Head>
        <title>여행 계획 설정 - 인원</title>
      </Head>

      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="flex-grow">
        <div className="text-xl my-4">총 여행 인원을 알려주세요!</div>
        <div className="flex py-8 justify-center">
          <button
            className="btn btn-outline hover:bg-slate-300"
            onClick={() => onChange(false)}
          >
            <Image width={32} height={32} src={dash} alt="-" />
          </button>
          <div className="text-4xl font-bold self-center mx-16 rounded">
            {plan.numberOfMembers}
          </div>
          <button
            className="btn btn-outline hover:bg-slate-300"
            onClick={() => onChange(true)}
          >
            <Image width={32} height={32} src={plus} alt="+" />
          </button>
        </div>
      </div>
      <div className="flex w-full space-x-4">
        <button
          className="flex-1 btn"
          onClick={() => router.push('/plan/new/name')}
        >
          뒤로가기
        </button>
        <button
          className="flex-1 btn btn-primary"
          onClick={() => router.push('/plan/new/city')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Num;
