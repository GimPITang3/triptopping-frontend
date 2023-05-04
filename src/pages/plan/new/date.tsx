import { PlanContext } from '@/contexts';
import { DateTime } from 'luxon';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useContext, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import dash from '../../../../public/dash.svg';
import plus from '../../../../public/plus.svg';

const DateSelector: FC = () => {
  const router = useRouter();
  const { plan, setPlan } = useContext(PlanContext);
  const [selected, setSelected] = useState(true);

  const onChangePeriod = (plus: boolean) => {
    if (plus) {
      setPlan({ ...plan, period: plan.period + 1 });
    } else {
      if (plan.period > 1) {
        setPlan({ ...plan, period: plan.period - 1 });
      }
    }
  };

  const handleValueChange = (newValue: any) => {
    const s = DateTime.fromISO(newValue.startDate);
    const e = DateTime.fromISO(newValue.endDate);
    const period = e.diff(s, 'days').days;
    setPlan({ ...plan, startAt: s.toJSDate(), period: period });
  };

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="text-xl my-4">여행 날짜가 정해지셨나요?</div>
      <div className="flex-grow">
        <div className="flex justify-center">
          <div className="tabs tabs-boxed bg-white">
            <a className={`tab tab-lg ${selected ? "tab-active" : ''}`} onClick={() => setSelected(true)}>날짜를 정했어요</a>
            <a className={`tab tab-lg ${selected ? '' : "tab-active"}`} onClick={() => setSelected(false)}>기간만 정할게요</a>
          </div>
        </div>
        
        {selected ? <div>
          <div className="text-xl my-8">출발 - 도착 날짜를 입력해주세요!</div>
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
        </div> :
          <div>
            <div className="text-xl my-8">며칠간 여행하시는지 알려주세요!</div>
            <div className="flex py-8 justify-center">
              <button
              disabled={plan.startAt !== undefined}
              className="btn btn-outline hover:bg-slate-300"
              onClick={() => onChangePeriod(false)}
              >
                <Image width={32} height={32} src={dash} alt="-" />
              </button>
              <div className="text-4xl font-bold self-center mx-16 rounded">
                {plan.period}
              </div>
              <button
                disabled={plan.startAt !== undefined}
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangePeriod(true)}
              >
              <Image width={32} height={32} src={plus} alt="+" />
            </button>
          </div>
        </div>}
      </div>
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
