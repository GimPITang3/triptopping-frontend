import { useGoogleLogin } from '@react-oauth/google';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';

import { UserContext } from '@/contexts';
import { signinWithGoogle, signupWithGoogle } from '@/services/authService';

import BtmNavbar from '@/components/BtmNavbar';
import Topbar from '@/components/Topbar';

const LoginPage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser, setAccessToken } = useContext(UserContext);

  const [isLogin, setIsLogin] = useState(true);
  const [nickname, setNickname] = useState<string>('');

  const signin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      signinWithGoogle(tokenResponse.code).then((resp) => {
        setUser(resp.user);
        setAccessToken(resp.accessToken);
        router.push('/');
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onNonOAuthError: (error) => {
      console.log(error);
    },
    flow: 'auth-code',
  });

  const signup = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      signupWithGoogle({
        code: tokenResponse.code,
        nickname: nickname,
        introduce: '',
      }).then((resp) => {
        setUser(resp.user);
        setAccessToken(resp.accessToken);
        router.push('/');
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onNonOAuthError: (error) => {
      console.log(error);
    },
    flow: 'auth-code',
  });

  const onSignin = useCallback(() => {
    signin();
  }, [signin]);

  const onSignup = useCallback(() => {
    if (nickname.trim().length === 0) return;

    signup();
  }, [signup, nickname]);

  return (
    <div className="min-h-screen">
      <Head>
        <title>{`로그인`}</title>
      </Head>

      <Topbar />

      <div className="flex justify-center">
        <div className="w-full max-w-sm p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-6">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              {isLogin ? '로그인' : '회원가입'}
            </h5>
            {!isLogin && (
              <div>
                <label className="label">
                  <span className="label-text">1. 닉네임을 입력해 주세요</span>
                </label>
                <input
                  placeholder="your-nickname"
                  className="input input-primary w-full"
                  onChange={(e) => setNickname(e.target.value)}
                ></input>
                <label className="label mt-4 -mb-6">
                  <span className="label-text">2. 구글 로그인을 진행해주세요</span>
                </label>
              </div>
            )}
            <button
              className="btn btn-primary w-full"
              onClick={isLogin ? onSignin : onSignup}
            >
              Continue with Google
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {isLogin
                ? '아직 회원이 아니신가요? '
                : '이미 계정이 있으신가요? '}
              <a
                onClick={() => {
                  setIsLogin(!isLogin);
                }}
                className="text-blue-700 hover:underline cursor-pointer dark:text-blue-500"
              >
                {isLogin ? '회원가입' : '로그인'}
              </a>
            </div>
          </div>
        </div>
      </div>

      <BtmNavbar currentPath={5} />
    </div>
  );
};

export default LoginPage;
