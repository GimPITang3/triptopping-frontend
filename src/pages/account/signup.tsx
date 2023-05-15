import { UserContext } from '@/contexts';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState, ChangeEvent } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

const SignUpPage: NextPage = ({}) => {
  const router = useRouter();
	const { user, setUser } = useContext(UserContext);
	const [ nickname, setNickname ] = useState('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

	const handleClickNext = () => {
		if (nickname === '') {
      setUser({ ...user, nickname: '아무개', userId: '45' });
    }
		else {
			setUser({ ...user, nickname: nickname, userId: '45' });
		}
		//setUser({ ...user, userId: '45' });
		router.push('/');
	};

  return (
	<div>
	  <div className="flex my-4 justify-center">
		<div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"> 
			<form className="space-y-6" action="#">
				<h5 className="text-xl font-medium text-gray-900 dark:text-white">닉네임을 정해주세요.</h5>
				<div className="mb-6">
					<div>
						<label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
						<input type="text" onChange={handleChange} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="닉네임" required />
					</div>
				</div>
				<button type="button" onClick={handleClickNext} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">회원가입</button>
			</form>
		</div>
	  </div>
	</div>
  );
};

export default SignUpPage;
