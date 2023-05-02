import { useRouter } from 'next/router';
import { FC, useState } from 'react';

const Tag: FC = () => {
  const router = useRouter();
  const [tagList, setTagList] = useState<string[]>([]);
  const [tag, setTag] = useState('');
  const addTag = () => {
    if (!tag) {
      return;
    }
    setTagList([...tagList, tag]);
    setTag('');
  };
  const onClickCreate = () => {
    // send plan data to backend
    router.push('/plan/123');
  };
  return (
    <div className="relative min-h-screen">
      <div>여행 태그를 입력해주세요.</div>
      <div>
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            autoComplete="off"
            value={tag}
            onKeyUp={(e) => {
              if (e.key === 'Enter') addTag();
            }}
            onChange={(e) => setTag(e.target.value)}
            type="text"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            required
          />
          <button
            onClick={() => addTag()}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            추가
          </button>
        </div>
      </div>
      <div className="space-x-2">
        {tagList.map((tag, index) => (
          <div key={`tag-${index}`} className="badge badge-outline">
            {tag}
          </div>
        ))}
      </div>

      <div className="absolute bottom-1 right-1 space-x-2">
        <button className="btn" onClick={() => router.push('/plan/new/date')}>
          뒤로가기
        </button>
        <button className="btn btn-primary" onClick={onClickCreate}>
          생성
        </button>
      </div>
    </div>
  );
};

export default Tag;
