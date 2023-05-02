import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

const LoginPage: NextPage = ({}) => {
  const router = useRouter();

  return (
    <div>
      <div>로그인</div>
      <GoogleOAuthProvider clientId="1089144693555-800hflqusq9stvt16h3qilrivop7v560.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </GoogleOAuthProvider>
      <div>회원가입</div>
    </div>
  );
};

export default LoginPage;