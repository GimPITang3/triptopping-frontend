import { Dispatch, FC, SetStateAction } from 'react';
import Image from 'next/image';

import dash from '../../../public/dash.svg';
import plus from '../../../public/plus.svg';

const NumberOfMembersTab: FC<{
  planNumberOfMembers: number;
  setPlanNumberOfMembers: Dispatch<SetStateAction<number>>;
}> = ({ planNumberOfMembers, setPlanNumberOfMembers }) => {
  const onChangeNum = (plus: boolean) => {
    setPlanNumberOfMembers((prev) => Math.max(prev + (plus ? 1 : -1), 1));
  };

  return (
    <div>
      <h3 className="text-lg font-bold">인원 수를 설정해주세요</h3>

      <div className="flex py-8 justify-center">
        <button
          className="btn btn-outline hover:bg-slate-300"
          onClick={() => onChangeNum(false)}
        >
          <Image width={32} height={32} src={dash} alt="-" />
        </button>
        <div className="text-4xl font-bold self-center mx-16 rounded">
          {planNumberOfMembers}
        </div>
        <button
          className="btn btn-outline hover:bg-slate-300"
          onClick={() => onChangeNum(true)}
        >
          <Image width={32} height={32} src={plus} alt="+" />
        </button>
      </div>
    </div>
  );
};

export default NumberOfMembersTab;
