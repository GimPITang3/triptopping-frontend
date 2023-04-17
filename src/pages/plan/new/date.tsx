import { FC } from 'react';

const Date: FC = () => {
  return (
    <div>
      <div>뒤로가기</div>
      <div>언제 떠나세요?</div>

      <div>몇일동안 여행하시나요?</div>

      <div className="flex">
        <button className="btn btn-ghost">취소</button>
        <button className="btn btn-primary">다음</button>
      </div>
    </div>
  );
};

export default Date;
