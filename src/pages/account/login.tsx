import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
import Head from 'next/head';
import Topbar from '@/components/Topbar';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

const LoginPage: NextPage = ({}) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen">
      <Head>
        <title>{`로그인`}</title>
      </Head>

      <Topbar />

      <div className="flex justify-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              {isLogin ? '로그인' : '회원가입'}
            </h5>
            <GoogleOAuthProvider clientId="1028097431026-mmb0irmfn0jd7b47nsqpkgisdqoibbh2.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </GoogleOAuthProvider>
            <button
              type="button"
              onClick={() => {
                router.push('/account/signup');
              }}
              className="btn"
            >
              임시로 만든 회원가입 버튼
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {isLogin
                ? '아직 회원이 아니신가요? '
                : '이미 계정이 있으신가요? '}
              <a
                onClick={() => {
                  setIsLogin(!isLogin);
                }}
                className="text-blue-700 hover:underline dark:text-blue-500"
              >
                {isLogin ? '로그인' : '회원가입'}
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
