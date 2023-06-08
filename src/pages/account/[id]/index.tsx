import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { UserContext } from '@/contexts';

import { getUser, updateUser } from '@/services/usersService';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import UserProfileImage from '@/components/UserProfileImage';
import Link from 'next/link';

const AccountPage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser, setAccessToken } = useContext(UserContext);

  const [nickname, setNickname] = useState(user?.nickname);
  const [introduce, setIntroduce] = useState(user?.introduce);

  const { id } = router.query;

  const onLogout = useCallback(() => {
    setUser(() => undefined);
    setAccessToken(() => undefined);
    router.push('/');
  }, [setUser, setAccessToken, router]);

  useEffect(() => {
    if (typeof id !== 'string') return;

    getUser(id).then((user) => {
      setUser(user);
      setNickname(user.nickname);
      setIntroduce(user.introduce);
    });
  }, [setUser, id]);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleIntroduceChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduce(e.target.value);
  };

  const handleClickNext = () => {
    if (typeof id !== 'string') return;

    updateUser(id, { introduce, nickname }).then((user) => {
      setUser(user);

      router.push('/');
    });
  };

  const onClickChangeProfileImage = useCallback(() => {
    // TODO:
    alert('not yet implemented');
  }, []);

  return (
    <div className="min-h-screen">
      <Head>
        <title>{`프로필 변경`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
          <input
            type="checkbox"
            id="del-user-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">회원 탈퇴</h3>
              <p className="py-4">정말 탈퇴하시겠습니까?</p>
              <div className="modal-action">
                <label
                  onClick={onLogout}
                  htmlFor="del-article-modal"
                  className="btn btn-primary"
                >
                  예
                </label>
                <label htmlFor="del-article-modal" className="btn">
                  아니오
                </label>
              </div>
            </div>
          </div>

          <Topbar />

          <div className="flex justify-center">
            <div className="w-full max-w-sm p-4 mt-6 mb-24 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="space-y-6">
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                  프로필 변경
                </h5>
                <div className="flex justify-center">
                  <div className="avatar placeholder">
                    <div className="rounded-full w-24 relative">
                      {user ? <UserProfileImage user={user} /> : <></>}

                      <div
                        className="absolute flex flex-row justify-center items-center w-full h-full text-gray-300 bg-gray-950/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={onClickChangeProfileImage}
                      >
                        <div>변경</div>
                      </div>
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
                      placeholder={user?.nickname}
                      defaultValue={user?.nickname}
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="introduce"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    자기소개
                  </label>
                  <textarea
                    id="introduce"
                    rows={4}
                    onChange={handleIntroduceChange}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="자기소개를 입력하세요."
                    defaultValue={user?.introduce}
                  ></textarea>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleClickNext}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    저장
                  </button>
                  <label htmlFor="del-user-modal" className="place-self-center link link-error text-sm">회원 탈퇴</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BtmNavbar currentPath={5} />

        <Sidebar />
      </div>
    </div>
  );
};

export default AccountPage;
