import { FC, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

const DateSelector: FC = () => {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleValueChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };
  return (
    <div className="relative min-h-screen">
      <div>뒤로가기</div>
      <div>언제 떠나세요?</div>
      <div>몇일동안 여행하시나요?</div>
      <Datepicker
        value={value}
        onChange={handleValueChange}
        showShortcuts={true}
      />
      <div className="absolute bottom-1 right-1">
        <button className="btn btn-ghost">취소</button>
        <button className="btn btn-primary">다음</button>
      </div>
    </div>
  );
};

export default DateSelector;
