import { FC, useState } from 'react';
import plus from '../../../../public/plus.svg';
import dash from '../../../../public/dash.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Num: FC = () => {
  const router = useRouter();
  const [num, setNum] = useState(1);
  const onChange = (plus: boolean) => {
    if (plus) {
      setNum(num + 1);
    } else {
      if (num > 1) {
        setNum(num - 1);
      }
    }
  };
  return (
    <div className="relative min-h-screen">
      <div>몇 명이서 여행 가시나요?</div>
      <button className="btn btn-ghost" onClick={() => onChange(false)}>
        <Image width={32} height={32} src={dash} alt="-" />
      </button>
      {num}
      <button className="btn btn-ghost" onClick={() => onChange(true)}>
        <Image width={32} height={32} src={plus} alt="+" />
      </button>
      <div className="absolute bottom-1 right-1 space-x-2">
        <button className="btn" onClick={() => router.push('/plan/new/name')}>
          뒤로가기
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/plan/new/budget')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Num;
