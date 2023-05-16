import Topbar from '@/components/Topbar';
import { Plan, User } from '@/types';
import { UserContext } from '@/contexts';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState, useContext } from 'react';
import plusCircle from '../../../public/pluscircle.svg';
import { deletePlan, getPlans } from '@/services/plansService';
import Head from 'next/head';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   context.params;

//   return {
//     props: {},
//   };
// };

interface ArticleProps {
  articleId: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface CommentProps {
  content: string;
  author: string;
  createdAt: Date;
}

const Article: FC<ArticleProps> = ({
  articleId,
  title,
  content,
  author,
  createdAt,
}) => {
  const router = useRouter();

  const createdDate = DateTime.fromISO(new Date(createdAt).toISOString());
  let dateString = createdDate.toFormat('MM.dd');

  return (
    <tr className="hover">
      <th>{articleId}</th>
      <td><Link href={'/community/' + articleId}>{title}</Link></td>
      <td>{author}</td>
      <td>{dateString}</td>
    </tr>
  );
};

const ArticlePage: NextPage = ({}) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [delId, setDelId] = useState('');

  const handleDelId = (id: string) => {
    setDelId(id);
  };

  const delPlan = () => {
    setPlanList(planList.filter((item) => item.planId !== delId));
    deletePlan(delId);
  };

  useEffect(() => {
    // const SetPlanList = async () => {
    //   const plans = await getPlans();
    //   setPlanList(plans);
    // };
    // SetPlanList();
  }, []);

  return (
    <>
      <Head>
        <title>{`커뮤니티`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">

          <Topbar />

          <div>
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    자유게시판
                  </h5>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th></th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일자</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Article
                        articleId={'1'}
                        title={'!+!+!+내가 공연할 차례군!+!+!+'}
                        content={'ㅈㄱㄴ'}
                        author={'ㅇㅇ'}
                        createdAt={new Date()}
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <div className="flex flex-col">
              <div className="avatar placeholder flex justify-center">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-24">
                  <span className="text-3xl">{user.nickname.slice(0,1)}</span>
                </div>
              </div>
              <h2 className="card-title justify-center my-4">{user.nickname}</h2>
              <Link href={'/account/' + user.userId} className="flex justify-end">프로필 편집</Link>
            </div>
            <div className="divider"></div>
            <li>
              <Link href="/plan/list">내 여행 계획</Link>
            </li>
            <li>
              <a>내 작성 글</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
