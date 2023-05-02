import { useRouter } from 'next/router';
import { FC, useContext, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { PlanContext } from '@/contexts';
import { DateTime } from 'luxon';
import Image from 'next/image';
import plus from '../../../../public/plus.svg';
import dash from '../../../../public/dash.svg';

const DateSelector: FC = () => {
  const router = useRouter();
  const { plan, handlePlan } = useContext(PlanContext);
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const onChangePeriod = (plus: boolean) => {
    if (plus) {
      handlePlan('period', plan.num + 1);
    } else {
      if (plan.num > 1) {
        handlePlan('period', plan.num - 1);
      }
    }
  };

  const handleValueChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
    const s = DateTime.fromISO(newValue.startDate);
    const e = DateTime.fromISO(newValue.endDate);
    const period = e.diff(s, 'days').days;
    handlePlan('startAt', s.toISODate());
    handlePlan('period', period);
  };

  return (
    <div className="relative min-h-screen">
      <div>언제 떠나세요?</div>
      <div>몇일동안 여행하시나요?</div>

      <button className="btn btn-ghost" onClick={() => onChangePeriod(false)}>
        <Image width={32} height={32} src={dash} alt="-" />
      </button>
      {plan.period}
      <button className="btn btn-ghost" onClick={() => onChangePeriod(true)}>
        <Image width={32} height={32} src={plus} alt="+" />
      </button>
      <Datepicker
        value={value}
        onChange={handleValueChange}
        showShortcuts={true}
      />
      <div className="absolute bottom-1 right-1 space-x-2">
        <button className="btn" onClick={() => router.push('/plan/new/num')}>
          뒤로가기
        </button>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/plan/new/tag')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
