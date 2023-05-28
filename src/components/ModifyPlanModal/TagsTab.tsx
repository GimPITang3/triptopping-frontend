import { Dispatch, FC, SetStateAction, useState } from 'react';

const TagsTab: FC<{
  planTags: string[];
  setPlanTags: Dispatch<SetStateAction<string[]>>;
}> = ({ planTags, setPlanTags }) => {
  const [tag, setTag] = useState('');

  const addTag = () => {
    if (!tag) {
      return;
    }
    setPlanTags((prev) => [...prev, tag]);
    setTag('');
  };
  const delTag = (tag: string) => {
    setPlanTags((prev) => prev.filter((item) => item !== tag));
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold my-4">변경할 태그를 설정해주세요</h3>
      <div className="py-8 min-h-[160px]">
        {planTags.map((tag, index) => (
          <div key={`tag-${index}`} className="badge badge-lg badge-outline mb-2 mr-2">
            {'#' + tag}
            <svg
              onClick={() => delTag(tag)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="hover:bg-slate-200 inline-block w-4 h-4 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        ))}
      </div>
      <div>
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
            placeholder="맛집"
            required
          />
          <button
            onClick={() => addTag()}
            className="flex-1 btn-primary text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagsTab;
