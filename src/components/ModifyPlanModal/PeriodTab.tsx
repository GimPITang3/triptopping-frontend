import { DateTime } from 'luxon';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

import dash from '../../../public/dash.svg';
import plus from '../../../public/plus.svg';

const PeriodTab: FC<{
  planPeriod: number;
  setPlanPeriod: Dispatch<SetStateAction<number>>;
  planStartDate: Date | undefined;
  setPlanStartDate: Dispatch<SetStateAction<Date | undefined>>;
}> = ({ planPeriod, planStartDate, setPlanPeriod, setPlanStartDate }) => {
  const [startDateSelected, setStartDateSelected] = useState(true);

  const onChangePeriod = (plus: boolean) => {
    setPlanPeriod((prev) => Math.max(prev + (plus ? 1 : -1), 1));
  };

  const handleValueChange = (newValue: any) => {
    const s = DateTime.fromISO(newValue.startDate);
    const e = DateTime.fromISO(newValue.endDate);
    const period = e.diff(s, 'days').days;

    setPlanPeriod(period);
    setPlanStartDate(s.toJSDate());
  };
  return (
    <div>
      <h3 className="text-lg font-bold my-4">변경할 날짜를 입력해주세요</h3>
      <div className="flex-grow">
        <div className="flex justify-center">
          <div className="tabs tabs-boxed bg-white">
            <a
              className={`tab tab-lg ${startDateSelected ? 'tab-active' : ''}`}
              onClick={() => setStartDateSelected(true)}
            >
              날짜를 정했어요
            </a>
            <a
              className={`tab tab-lg ${startDateSelected ? '' : 'tab-active'}`}
              onClick={() => setStartDateSelected(false)}
            >
              기간만 정할게요
            </a>
          </div>
        </div>

        {startDateSelected ? (
          <div>
            <div className="text-xl my-8">출발 - 도착 날짜를 입력해주세요!</div>
            <Datepicker
              value={{
                startDate: planStartDate || null,
                endDate:
                  (planStartDate &&
                    DateTime.fromJSDate(planStartDate)
                      .plus({ day: planPeriod })
                      .toJSDate()) ||
                  null,
              }}
              onChange={handleValueChange}
              showShortcuts={true}
            />
          </div>
        ) : (
          <div>
            <div className="text-xl my-8">며칠간 여행하시는지 알려주세요!</div>
            <div className="flex py-8 justify-center">
              <button
                disabled={planStartDate !== undefined}
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangePeriod(false)}
              >
                <Image width={32} height={32} src={dash} alt="-" />
              </button>
              <div className="text-4xl font-bold self-center mx-16 rounded">
                {planPeriod}
              </div>
              <button
                disabled={planStartDate !== undefined}
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangePeriod(true)}
              >
                <Image width={32} height={32} src={plus} alt="+" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodTab;
