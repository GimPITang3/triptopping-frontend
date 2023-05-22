import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import CommunityCard from '@/components/CommunityCard';
import { UserContext } from '@/contexts';
import { deletePlan } from '@/services/plansService';
import { Plan } from '@/types';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useContext, useEffect, useState } from 'react';

const dummyArticles: {
  title: string;
  description: string;
  coverImage?: string | StaticImageData;
}[] = [
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image3.jpg',
  },
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image1.jpeg',
  },
  {
    title: '지수의 군산 콩국수 여행기',
    description: '콩국수 맛있겠다',
    coverImage: '/imgs/image2.jpeg',
  },
];
interface Article {
  articleId: string;
  title: string;
  description: string;
  coverImage?: string | StaticImageData;
  author: string;
}

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
        <div className="drawer-content scrollbar-hide">
          <Topbar />

          <div>
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                    자유게시판
                  </h5>
                </div>

                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    {dummyArticles.map((article, i) => (
                      <CommunityCard
                        key={i}
                        title={article.title}
                        description={article.description}
                        coverImage={article.coverImage}
                      />
                    ))}
                    <CommunityCard />
                  </div>
                </div>

                <div className="flex py-6 justify-center btn-group">
                  <button className="btn">«</button>
                  <button className="btn">Page 22</button>
                  <button className="btn">»</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BtmNavbar currentPath={4} />

        <Sidebar />
      </div>
    </>
  );
};

export default CommunityPage;
