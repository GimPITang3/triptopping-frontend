import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { PlanContext } from '@/contexts';
import { getPlanDetails } from '@/services/plansService';
import { Place } from '@/types';
import { flattenScheduleSlot } from '@/utils';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';

import { UserContext } from '@/contexts';
import { Article, Comment } from '@/types';
import { getArticle } from '@/services/articlesService';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface CommentProp {
  id: number;
  name: string;
  content: string;
  createdAt: Date;
  onClickDelComment: Function;
}

const Comment: FC<CommentProp> = ({
  id,
  name,
  content,
  createdAt,
  onClickDelComment,
}) => {
  const router = useRouter();

  let dateString = (() => {
      const commentedDate = DateTime.fromISO(new Date(createdAt).toISOString());
      return (
        commentedDate.toFormat('MM.dd')
      );
    })();

  return (
    <div>
      <div className="flex flex-row mb-2">
        <p className="font-bold">{name}</p>
        <p className="grow text-sm text-gray-400 ml-2">| {dateString}</p>
        <label
          onClick={(e) => {
                e.stopPropagation();
                onClickDelComment(id);
              }}
          htmlFor="del-modal"
          className="btn btn-square btn-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </label>
      </div>
      <p>{content}</p>
      <div className="divider"></div>
    </div>
  );
};

const ArticlePage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);
  const [article, setArticle] = useState<Article>();
  const [delId, setDelId] = useState(-1);
  const { plan, setPlan } = useContext(PlanContext);
  const [page, setPage] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const { id } = router.query;

  const prevArticle = useCallback(() => {
    // TODO:
  }, []);
  const nextArticle = useCallback(() => {
    // TODO:
  }, []);

  useEffect(() => {
    if (typeof id !== 'string') return;

    getArticle(`${id}`).then((article) => {
      setArticle(article);
    });
  }, [id]);

  useEffect(() => {
    if (article) {
      setPlan(article.plan);
      setFocusedPlace(
        flattenScheduleSlot(plan.itinerary[0][0]).details || null,
      );
    }
  }, [article, setPlan]);

  useEffect(() => {
    if (map && focusedPlace !== null) {
      const center = {
        ...{ lat: 0, lng: 0 },
        ...focusedPlace?.geometry?.location,
      };
      map.panTo(center);
    }
  }, [map, focusedPlace]);

  const itineraryDaily = plan.itinerary[page];
  const GetIcon = () => {
    return 'https://cdn.discordapp.com/attachments/1107627544850731028/1107627583601922158/lodging-icon.png';
  };

  const handleDelId = (id: number) => {
    if(id<0) return;
    setDelId(id);
  };
  
  if(!article)
  {
    return <div></div>;
  }

  const delComment = () => {
    // TODO
  };

  return (
    <>
      <Head>
        <title>{`커뮤니티`}</title>
      </Head>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content scrollbar-hide">
          <input type="checkbox" id="del-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">댓글이 삭제돼요</h3>
              <p className="py-4">
                댓글을 삭제하시겠습니까?
              </p>
              <div className="modal-action">
                <label
                  onClick={delComment}
                  htmlFor="del-modal"
                  className="btn btn-primary"
                >
                  예
                </label>
                <label htmlFor="del-modal" className="btn">
                  아니오
                </label>
              </div>
            </div>
          </div>

          <Topbar />

          <div>
            <div className="p-4 pt-8">
              <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col justify-between mb-4">
                  <p className="text-2xl mb-4 font-bold leading-none text-gray-900 dark:text-white">
                    {article?.title}
                  </p>
                  <div className="flex items-center justify-start">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span className="text-lg">
                          {article?.author.nickname.slice(0, 1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-base ml-1">{article?.author.nickname}</p>
                    <p className="text-sm text-gray-400 ml-2">
                      {article?.createdAt !== undefined &&
                        DateTime.fromISO(article.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="divider mb-4"></div>
                  <div>
                    <p>{article?.content}</p>
                  </div>

                  <div className="flex flex-row justify-end">
                    <Link href="/community/new" className="text-sm">수정</Link>
                    <p className="text-sm">&nbsp;|&nbsp;</p>
                    <Link href="/community" className="text-sm">삭제</Link>
                  </div>
                  <div className="divider mb-4"></div>
                  <LoadScript
                    googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
                    libraries={['places']}
                  >
                    <div className="h-full">
                      <GoogleMap
                        options={{ disableDefaultUI: true }}
                        mapContainerStyle={containerStyle}
                        zoom={12}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                      >
                        {itineraryDaily
                          .filter((itinerary) => itinerary.type === 'place')
                          .map((itinerary, index) =>
                            itineraryDaily.length - 1 === index || index === 0 ? (
                              <Marker
                                key={`it-${index}`}
                                position={
                                  flattenScheduleSlot(itinerary).details.geometry
                                    ?.location || {
                                    lat: 0,
                                    lng: 0,
                                  }
                                }
                                icon={GetIcon()}
                              />
                            ) : (
                              <Marker
                                key={`it-${index}`}
                                position={
                                  flattenScheduleSlot(itinerary).details.geometry
                                    ?.location || {
                                    lat: 0,
                                    lng: 0,
                                  }
                                }
                                label={(index + 1).toString()}
                              />
                            ),
                          )}

                        <Polyline
                          options={{
                            strokeColor: '#b41412',
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            clickable: false,
                            draggable: false,
                            editable: false,
                            visible: true,
                            path: itineraryDaily.slice(0, -1).map(
                              (itinerary) =>
                                flattenScheduleSlot(itinerary).details.geometry
                                  ?.location || {
                                  lat: 0,
                                  lng: 0,
                                },
                            ),
                            zIndex: 1,
                          }}
                        />
                      </GoogleMap>
                    </div>
                  </LoadScript>
                  <div className="tabs tabs-boxed justify-center backdrop-blur-sm bg-white/80 pointer-events-auto w-full rounded-none border-t-2 border-gray-300">
                    {plan.itinerary.map((_value, index) => (
                      <button
                        key={`page-${index}`}
                        onClick={() => {
                          setPage(index);
                          setFocusedPlace(
                            flattenScheduleSlot(plan.itinerary[index][0]).details,
                          );
                          setFocusedIndex(0);
                        }}
                        className={
                          'tab tab-lg flex-shrink-0' +
                          (index === page ? ' tab-active' : '')
                        }
                      >
                        Day {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className="bg-white/80 h-64 overflow-y-auto">
                    <ul
                      key={`day-${page}`}
                      className="steps steps-vertical snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide pl-4"
                    >
                      {itineraryDaily
                        .filter((itinerary) => itinerary.type === 'place')
                        .map((itinerary, index) => (
                          <li
                            key={`it-${index}`}
                            className="step step-neutral snap-always snap-start h-24 cursor-pointer"
                            onClick={(e) => {
                              setFocusedPlace(
                                flattenScheduleSlot(plan.itinerary[page][index]).details,
                              );
                              setFocusedIndex(index);
                            }}
                          >
                            <div className="">
                              {flattenScheduleSlot(itinerary).details.name}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <button className="btn btn-primary grow">내 여행계획에 추가하기</button>

                  <p className="mt-8">
                    이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                    1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                    글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                    글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                    1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                    글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                    글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                    1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                    글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                    글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은
                    1번째 글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째
                    글 이 글은 1번째 글 이 글은 1번째 글 이 글은 1번째 글 이
                    글은 1번째 글{' '}
                  </p>
                  <div className="flex flex-row mt-8">
                    <CopyToClipboard text={ window.location.href }>
                      <label>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </label>
                    </CopyToClipboard>
                    <p className="text-sm">&nbsp;|&nbsp;</p>
                    <label className="swap">
                      <input type="checkbox" />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="swap-on w-6 h-6">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="swap-off w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </label>
                    <p>150</p>
                  </div>
                  <div className="divider"></div>
                  <p className="mb-4">댓글 3개</p>
                  <div className="overflow-x-auto text-sm mb-12">
                    <div className="flex flex-col">
                      <ul>
                        {article?.comments.map((comment, i) => (
                          <li key={`comment-${i}`}>
                            <Comment
                              id={i}
                              name={comment.name}
                              content={comment.content}
                              createdAt={comment.createdAt}
                              onClickDelComment={handleDelId}
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-row items-end">
                        <textarea className="grow textarea textarea-bordered" placeholder="댓글을 입력하세요."></textarea>
                        <button className="btn btn-primary">등록</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="btn btn-sm mr-2"
                      onClick={prevArticle}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm mr-2"
                      onClick={nextArticle}
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/community')}
                      className="btn btn-sm mr-2"
                    >
                      목록
                    </button>
                  </div>
                  <div className="divider mb-16"></div>
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

export default ArticlePage;
