import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';

const NameTab: FC<{
  planName: string;
  setPlanName: Dispatch<SetStateAction<string>>;
}> = ({ planName, setPlanName }) => {
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setPlanName(e.target.value);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">새로운 이름을 설정해주세요</h3>
      <input
        value={planName}
        className="input input-bordered py-4 w-full"
        onChange={onChangeName}
      />
    </div>
  );
};

export default NameTab;
