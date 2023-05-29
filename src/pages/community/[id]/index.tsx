import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';

import { Place, Article } from '@/types';
import { flattenScheduleSlot } from '@/utils';
import { UserContext, PlanContext } from '@/contexts';
import {
  getArticle,
  createComment,
  deleteComment,
  likeArticle,
  deleteArticle,
  unlikeArticle,
} from '@/services/articlesService';

import BtmNavbar from '@/components/BtmNavbar';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Image from 'next/image';

interface CommentProp {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  isSameUser: boolean;
  onClickDelComment: Function;
}

const Comments: FC<CommentProp> = ({
  id,
  name,
  content,
  createdAt,
  isSameUser,
  onClickDelComment,
}) => {
  return (
    <div>
      <div className="flex flex-row mb-2">
        <p className="font-bold">{name}</p>
        <p className="grow text-sm text-gray-400 ml-2">
          |{' '}
          {DateTime.fromISO(new Date(createdAt).toISOString()).toFormat(
            'MM.dd',
          )}
        </p>
        {isSameUser ? (
          <label
            onClick={(e) => {
              e.stopPropagation();
              onClickDelComment(id);
            }}
            htmlFor="del-comment-modal"
            className="btn btn-square btn-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
        ) : (
          ''
        )}
      </div>
      <p>{content}</p>
      <div className="divider"></div>
    </div>
  );
};

const ArticlePage: NextPage = ({}) => {
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);
  const { plan, setPlan } = useContext(PlanContext);

  const [article, setArticle] = useState<Article>();
  const [delId, setDelId] = useState('');
  const [page, setPage] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [comment, setComment] = useState('');

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
      if (article.plan) {
        setPlan(article.plan);
        setFocusedPlace(
          flattenScheduleSlot(article.plan.itinerary[0][0]).details || null,
        );
      }
    });
  }, [id, setPlan]);

  useEffect(() => {
    if (map && focusedPlace !== null) {
      const center = {
        ...{ lat: 0, lng: 0 },
        ...focusedPlace?.geometry?.location,
      };
      map.panTo(center);
    }
  }, [map, focusedPlace]);

  const onClickCreate = () => {
    if (typeof id !== 'string') return;
    createComment(id, {
      content: comment,
    }).then((res) => {
      getArticle(`${id}`).then((article) => {
        setArticle(article);
        setComment('');
      });
    });
  };

  const itineraryDaily = plan.itinerary[page];
  const GetIcon = () => {
    return 'https://cdn.discordapp.com/attachments/1107627544850731028/1107627583601922158/lodging-icon.png';
  };

  const onClickLikeButton = useCallback(() => {
    if (typeof id !== 'string') return;
    if (!user || !article) return;

    if (article.likes?.map((i) => i.userId).includes(user.userId)) {
      unlikeArticle(id).then((article) => {
        setArticle(article);
      });
    } else {
      likeArticle(id).then((article) => {
        setArticle(article);
      });
    }
  }, [id, article, user]);

  const handleDelId = (id: string) => {
    setDelId(id);
  };

  const delArticle = () => {
    if (typeof id !== 'string') return;
    deleteArticle(id).then(() => {
      router.push('/community');
    });
  };

  const delComment = () => {
    if (typeof id !== 'string') return;
    deleteComment(id, delId).then((article) => {
      setArticle(article);
      setDelId('');
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
          <input
            type="checkbox"
            id="del-comment-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">댓글이 삭제돼요</h3>
              <p className="py-4">댓글을 삭제하시겠습니까?</p>
              <div className="modal-action">
                <label
                  onClick={delComment}
                  htmlFor="del-comment-modal"
                  className="btn btn-primary"
                >
                  예
                </label>
                <label htmlFor="del-comment-modal" className="btn">
                  아니오
                </label>
              </div>
            </div>
          </div>

          <input
            type="checkbox"
            id="del-article-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">글이 삭제돼요</h3>
              <p className="py-4">글을 삭제하시겠습니까?</p>
              <div className="modal-action">
                <label
                  onClick={delArticle}
                  htmlFor="del-article-modal"
                  className="btn btn-primary"
                >
                  예
                </label>
                <label htmlFor="del-article-modal" className="btn">
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
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8 relative">
                        {article?.author?.google.profileUrl ? (
                          <Image
                            src={article.author.google.profileUrl}
                            alt="profile image"
                            fill={true}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-lg">
                            {article?.author?.nickname?.slice(0, 1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-base ml-1">
                      {article?.author?.nickname}
                    </p>
                    <p className="text-sm text-gray-400 ml-2">
                      {' '}
                      |&nbsp;
                      {article?.createdAt !== undefined &&
                        DateTime.fromISO(article.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {article?.author?.userId === user?.userId ? (
                    <div className="flex flex-row justify-end">
                      <Link href={`/community/${id}/edit`} className="text-sm">
                        수정
                      </Link>
                      <p className="text-sm">&nbsp;|&nbsp;</p>
                      <label htmlFor="del-article-modal" className="text-sm">
                        삭제
                      </label>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="divider mb-4"></div>
                  {article?.plan ? (
                    <div>
                      {plan.tags.map((tag, index) => (
                        <div key={`tag-${index}`} className="badge badge-lg badge-outline mb-2 mr-2">
                          {'#' + tag}
                        </div>
                      ))}
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
                                itineraryDaily.length - 1 === index ||
                                index === 0 ? (
                                  <Marker
                                    key={`it-${index}`}
                                    position={
                                      flattenScheduleSlot(itinerary).details
                                        .geometry?.location || {
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
                                      flattenScheduleSlot(itinerary).details
                                        .geometry?.location || {
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
                                    flattenScheduleSlot(itinerary).details
                                      .geometry?.location || {
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
                                flattenScheduleSlot(plan.itinerary[index][0])
                                  .details,
                              );
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
                      <div className="rounded-md shadow-inner bg-white/80 h-64 overflow-y-auto">
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
                                    flattenScheduleSlot(
                                      plan.itinerary[page][index],
                                    ).details,
                                  );
                                }}
                              >
                                <div className="">
                                  {flattenScheduleSlot(itinerary).details.name}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                      <button className="btn btn-primary w-full mb-4">
                        내 여행계획에 추가하기
                      </button>
                    </div>
                  ) : (
                    ''
                  )}

                  <div>
                    <p>{article?.content}</p>
                  </div>
                  <div className="flex flex-row mt-8">
                    <CopyToClipboard
                      text={
                        typeof window !== 'undefined'
                          ? window.location.href
                          : ''
                      }
                    >
                      <label>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                          />
                        </svg>
                      </label>
                    </CopyToClipboard>
                    <p className="text-sm">&nbsp;|&nbsp;</p>
                    <span onClick={onClickLikeButton} className="">
                      {article?.likes?.find((i) => i.userId == user?.userId) !==
                      undefined ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      )}
                    </span>
                    <p>{article?.likes?.length}</p>
                  </div>
                  <div className="divider"></div>
                  <p className="mb-4">댓글 {article?.comments?.length}개</p>
                  <div className="overflow-x-auto text-sm mb-12">
                    <div className="flex flex-col">
                      <ul>
                        {article?.comments?.map((comment, i) => (
                          <li key={`comment-${i}`}>
                            <Comments
                              id={comment.commentId}
                              name={comment.author?.nickname || ''}
                              content={comment.content}
                              createdAt={comment.createdAt}
                              isSameUser={
                                comment.author?.userId === user?.userId
                              }
                              onClickDelComment={handleDelId}
                            />
                          </li>
                        ))}
                      </ul>
                      <div className="space-y-2">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full textarea textarea-bordered"
                          placeholder="댓글을 입력하세요."
                        ></textarea>
                        <div className="flex flex-row justify-end">
                          <button
                            onClick={() => onClickCreate()}
                            className="btn btn-primary"
                          >
                            등록
                          </button>
                        </div>
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
