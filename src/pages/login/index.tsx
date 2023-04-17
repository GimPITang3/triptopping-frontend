import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

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
      <button className="btn btn-wide">구글로 로그인</button>
    </div>
  );
};

export default LoginPage;
