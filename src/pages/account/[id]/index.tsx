import { useRouter } from 'next/router';
import { UserContext } from '@/contexts';
import { NextPage } from 'next';
import { useContext, useState, ChangeEvent } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Topbar from '@/components/Topbar';
import younha from '../../../../public/younha.png';

const AccountPage: NextPage = ({}) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname);
  const [introduce, setIntroduce] = useState(user.introduce);
  const { id } = router.query;

  // if(user.userId != id)
  // {
  //   return <div>접근 권한이 없습니다.</div>;
  // }

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleIntroduceChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduce(e.target.value);
  };

  const handleClickNext = () => {
    if (nickname === '') {
      setUser({ ...user, nickname: '아무개', introduce: introduce });
    } else {
      setUser({ ...user, nickname: nickname, introduce: introduce });
    }
    router.push('/');
  };

  console.log(user);

  return (
    <div className="min-h-screen">
      <Head>
        <title>{`프로필 변경`}</title>
      </Head>

      <Topbar />

      <div className="flex justify-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              프로필 변경
            </h5>
            <div className="flex justify-center">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                  <span className="text-3xl">{user.nickname.slice(0,1)}</span>
                </div>
              </div> 
            </div>
            <div className="mb-6">
              <div>
                <label
                  htmlFor="nickname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  닉네임
                </label>
                <input
                  type="text"
                  onChange={handleNicknameChange}
                  id="nickname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={user.nickname}
                  defaultValue={user.nickname}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
                <label htmlFor="introduce" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">자기소개</label>
                <textarea
                  id="introduce"
                  rows={4}
                  onChange={handleIntroduceChange}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="자기소개를 입력하세요."
                  defaultValue={user.introduce}
                >
                </textarea>
            </div>
            <button
              type="button"
              onClick={handleClickNext}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
