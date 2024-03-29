import { useContext, useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { UserContext } from '@/contexts';
import { Plan } from '@/types';
import { getPlans } from '@/services/plansService';
import { getArticle, updateArticle } from '@/services/articlesService';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const EditArticlePage: NextPage = ({}) => {
  const router = useRouter();

  const [planList, setPlanList] = useState<Plan[]>([]);
  const { user, setUser } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [planId, setPlanId] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>();

  const { id } = router.query;

  useEffect(() => {
    if (typeof id !== 'string') return;

    getArticle(`${id}`).then((article) => {
      setTitle(article.title);
      setContent(article.content);
      setCoverImageUrl(article.coverImageUrl);
      if (article.plan) {
        setPlanId(article.plan.planId);
      }
    });
  }, [id]);

  useEffect(() => {
    getPlans().then((plans) => setPlanList(plans));
  }, []);

  const onClickUpdate = () => {
    if (typeof id !== 'string') return;

    setLoading(true);

    updateArticle(id, {
      title: title,
      content: content,
      planId: planId,
      coverImageUrl: coverImageUrl,
    }).then(() => {
      setLoading(false);

      router.push('/community');
    });
  };

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
                <div className="flex flex-col mb-4">
                  <select
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => {
                      setPlanId(e.target.value);
                    }}
                    value={planId}
                  >
                    <option value="">여행 계획을 선택하세요.</option>
                    <option value="">선택 안함</option>
                    {planList.map(({ planId, name }, index) => {
                      return (
                        <option key={index} value={planId}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="divider"></div>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요."
                    className="mb-4 input input-bordered w-full max-w-xs"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    value={title}
                  />
                  <input
                    type="text"
                    placeholder="커버 이미지 URL을 입력하세요."
                    className="mb-4 input input-bordered w-full max-w-xs"
                    onChange={(e) => {
                      setCoverImageUrl(e.target.value);
                    }}
                    value={coverImageUrl || ''}
                  />
                  <textarea
                    className="textarea textarea-bordered h-64"
                    placeholder="내용을 입력하세요."
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    defaultValue={content}
                  ></textarea>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => router.back()}
                    className={'btn' + (loading ? ' btn-disabled' : '')}
                  >
                    취소
                  </button>
                  <button
                    onClick={() => onClickUpdate()}
                    className={
                      'btn btn-primary' + (loading ? ' btn-disabled' : '')
                    }
                  >
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BtmNavbar currentPath={4} />

        <Sidebar />

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-500/20">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-16 h-16 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default EditArticlePage;
