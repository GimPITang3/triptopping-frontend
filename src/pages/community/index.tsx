import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { UserContext } from '@/contexts';
import { deletePlan } from '@/services/plansService';
import { Plan } from '@/types';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

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

const CommunityPage: NextPage = ({}) => {
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

        <BtmNavbar user={user} currentPath={4} />

        <Sidebar user={user} />
      </div>
    </>
  );
};

export default CommunityPage;
