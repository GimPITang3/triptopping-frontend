import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { UserContext } from '@/contexts';

import { getUser, updateUser } from '@/services/usersService';

import BtmNavbar from '@/components/BtmNavbar';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';

const AccountPage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  const [nickname, setNickname] = useState(user?.nickname);
  const [introduce, setIntroduce] = useState(user?.introduce);

  const { id } = router.query;

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

  return (
    <div className="min-h-screen">
      <Head>
        <title>{`프로필 변경`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
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
                      {user?.google.profileUrl ? (
                        <Image
                          src={user.google.profileUrl}
                          alt=""
                          className="object-cover rounded-full"
                          fill
                        />
                      ) : (
                        <span className="text-3xl">
                          {user?.nickname.slice(0, 1)}
                        </span>
                      )}
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

        <BtmNavbar currentPath={5} />

        <Sidebar />
      </div>
    </div>
  );
};

export default AccountPage;
