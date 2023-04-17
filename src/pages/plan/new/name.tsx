import { FC } from 'react';

const Name: FC = () => {
  return (
    <div>
      <div>뒤로가기</div>
      <div>이름을 설정해주세요.</div>
      <input
        type="text"
        placeholder="이름"
        className="input input-bordered w-full max-w-xs"
      />
      <div className="flex">
        <button className="btn btn-ghost">취소</button>
        <button className="btn btn-primary">다음</button>
      </div>
    </div>
  );
};

export default Name;
