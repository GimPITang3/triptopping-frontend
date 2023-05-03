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

  const onChangePeriod = (plus: boolean) => {
    if (plus) {
      handlePlan('period', plan.period + 1);
    } else {
      if (plan.num > 1) {
        handlePlan('period', plan.period - 1);
      }
    }
  };

  const handleValueChange = (newValue: any) => {
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

      <button
        disabled={plan.startAt !== undefined}
        className="btn btn-ghost"
        onClick={() => onChangePeriod(false)}
      >
        <Image width={32} height={32} src={dash} alt="-" />
      </button>
      {plan.period}
      <button
        disabled={plan.startAt !== undefined}
        className="btn btn-ghost"
        onClick={() => onChangePeriod(true)}
      >
        <Image width={32} height={32} src={plus} alt="+" />
      </button>
      <Datepicker
        value={{
          startDate: plan.startAt === undefined ? null : plan.startAt,
          endDate:
            plan.startAt === undefined
              ? null
              : DateTime.fromJSDate(plan.startAt)
                  .plus({ day: plan.period })
                  .toJSDate(),
        }}
        onChange={handleValueChange}
        showShortcuts={true}
      />
      <div className="flex w-full space-x-4">
        <button
          className="flex-1 btn"
          onClick={() => router.push('/plan/new/budget')}
        >
          뒤로가기
        </button>
        <button
          className="flex-1 btn btn-primary"
          onClick={() => router.push('/plan/new/tag')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
