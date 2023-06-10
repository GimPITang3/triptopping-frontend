import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { DateTime } from 'luxon';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';

import { PlanContext, UserContext } from '@/contexts';
import {
  ItineraryDaily,
  Place,
  ScheduleSlot,
  TranslatedPlaceData,
} from '@/types';

import {
  addMember,
  excludePlaces,
  getPlan,
  updatePlan,
} from '@/services/plansService';

import ModifyPlanModal from '@/components/ModifyPlanModal';
import MenuToggle from '@/components/Topbar/MenuToggle';
import { TopbarContainer } from '@/components/TopbarContainer';

import BtmNavbar from '@/components/BtmNavbar';
import { initPlan } from '@/components/PlanContextProvider';
import Sidebar from '@/components/Sidebar';
import UserProfileImage from '@/components/UserProfileImage';
import { GetGoogleMapUrl, flattenScheduleSlot } from '@/utils';
import { AddressType } from '@googlemaps/google-maps-services-js';
import check from '../../../../public/check.svg';
import plus from '../../../../public/plus.svg';
import trash from '../../../../public/trash.svg';
import x from '../../../../public/x.svg';

interface SearchResult {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
}

const InviteMemberModal: React.FC = () => {
  const { plan, setPlan } = useContext(PlanContext);
  const [email, setEmail] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onClickAdd = async () => {
    try {
      const memberAddedPlan = await addMember(plan.planId, email);
      setPlan(memberAddedPlan);
      setEmail('');
      ref.current?.click();
    } catch (err) {
      alert('추가에 실패했습니다.');
    }
  };
  return (
    <div>
      <input
        type="checkbox"
        id="invite-member-modal"
        className="modal-toggle"
        ref={ref}
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">계획을 공유할 일행의 이메일을 넣어주세요</h3>
          <div className="flex space-x-4">
            <input
              className="input input-bordered grow"
              value={email}
              onChange={onChangeEmail}
            />
            <button className="btn btn-primary" onClick={onClickAdd}>
              추가
            </button>
          </div>
          <div className="modal-action pt-4">
            <label htmlFor="invite-member-modal" className="btn">
              닫기
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleMapModal: React.FC<{ day: number }> = ({ day }) => {
  const { plan, setPlan } = useContext(PlanContext);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [searchResult, setSearchResult] =
    useState<google.maps.places.PlaceResult | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setCenter(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (!searchBox) return;

    const places = searchBox.getPlaces();

    if (!places || places.length === 0) {
      return;
    }

    const place = places[0];
    if (!(place.geometry && place.geometry.location && place.name)) {
      return;
    }
    setSearchResult(place);

    if (map) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
    }
  }, [searchBox, map]);

  const containerStyle = {
    width: '100%',
    height: '300px',
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const onClickAdd = () => {
    if (!searchResult) {
      return;
    }
    setPlan((prev) => {
      const newPlan = { ...prev };
      newPlan.itinerary[day].splice(newPlan.itinerary[day].length - 1, 0, {
        type: 'place',
        system: {},
        manual: { details: searchResult },
      });
      return newPlan;
    });
  };

  return (
    <div>
      <input type="checkbox" id="modal-google-map" className="modal-toggle" />
      <label htmlFor="modal-google-map" className="modal cursor-pointer">
        <label className="modal-box relative max-w-2xl" htmlFor="">
          <div className="text-xl font-bold mb-2">
            추가할 장소를 선택해주세요
          </div>
          <LoadScript
            googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
            libraries={['places']}
          >
            <div className="h-full">
              <StandaloneSearchBox
                onLoad={onSearchBoxLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요"
                  className="input input-primary input-bordered w-full mb-2"
                />
              </StandaloneSearchBox>
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{ disableDefaultUI: true }}
              ></GoogleMap>
            </div>
          </LoadScript>
          <div className="mt-4 space-x-2 flex justify-end">
            <label className="btn btn-ghost w-24" htmlFor="modal-google-map">
              취소
            </label>
            <label
              className="btn btn-primary w-24"
              htmlFor="modal-google-map"
              onClick={onClickAdd}
            >
              추가
            </label>
          </div>
        </label>
      </label>
    </div>
  );
};

const PlanPage: NextPage = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const { plan, setPlan } = useContext(PlanContext);
  const [selectDay, setSelectDay] = useState<number>(-1);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(UserContext);

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

  const onClickDeleteItinerary = async (day: number, index: number) => {
    if (plan.itinerary[day][index].system?.details) {
      const excludePlaceIds = plan.itinerary[day]
        .splice(index, 1)
        .map(
          (item) =>
            (flattenScheduleSlot(item) as Place).details?.place_id || '',
        );
      await excludePlaces(id as string, excludePlaceIds);
      setPlan((prev) => {
        prev.excludes = Array.isArray(prev.excludes)
          ? prev.excludes.concat(excludePlaceIds)
          : excludePlaceIds;
        return { ...prev };
      });
    } else {
      setPlan((prev) => {
        prev.itinerary[day].splice(index, 1);
        return { ...prev };
      });
    }
  };

  const onClickAddItinerary = async (day: number) => {
    setPlan((prev) => {
      prev.itinerary[day].splice(prev.itinerary[day].length - 1, 0, {
        type: 'place',
        system: {},
      });
      return { ...prev };
    });
  };

  useEffect(() => {
    if (id === undefined) return;
    getPlan(`${id}`).then((plan) => {
      setPlan(plan);
    });
  }, [id, setPlan]);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDay = parseInt(result.source.droppableId);
    const destinationDay = parseInt(result.destination.droppableId);

    const sourceIdx = result.source.index;
    const destIdx = result.destination.index;
    if (destIdx === 0 || destIdx === plan.itinerary[destinationDay].length - 1)
      return;

    const item = plan.itinerary[sourceDay][sourceIdx];
    // change system to manual
    if (sourceDay !== destinationDay) {
      item.manual = { ...item.manual, ...item.system };
      item.system = {};
    }

    setPlan((prev) => {
      prev.itinerary[sourceDay].splice(sourceIdx, 1);
      prev.itinerary[destinationDay].splice(destIdx, 0, item);
      return { ...prev };
    });
  };

  const handleUpdateRecommend = async () => {
    setLoading(true);
    const data = await updatePlan(plan.planId, {
      itinerary: plan.itinerary,
    });
    setLoading(false);
    setPlan(data);
  };

  const ToggleSchedule = (day: number, index: number) => {
    setPlan((prev) => {
      const schedule = prev.itinerary[day][index];
      if (!schedule.manual || Object.keys(schedule.manual).length === 0) {
        schedule.manual = {
          ...schedule.manual,
          ...schedule.system,
        };
        delete schedule.system;
      } else {
        schedule.system = {
          ...schedule.system,
          ...schedule.manual,
        };
        delete schedule.manual;
      }
      return { ...prev };
    });
  };

  if (!plan.planId) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content scrollbar-hide">
        <Head>
          <title>{`${plan.name}`}</title>
        </Head>
        <TopbarContainer>
          <div className="navbar bg-white shadow-xl rounded-box">
            <div className="navbar-start ps-1 w-fit">
              <div className="">
                <Link href="/plan/list">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="h-7 w-7"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="grow flex justify-center">
              <div className="font-bold text-xl text-ellipsis text-center line-clamp-1">
                {`${plan.name}`}
              </div>
            </div>
            <div className="navbar-end pr-2 w-fit">
              <MenuToggle />
            </div>
          </div>
        </TopbarContainer>
        <div className="px-4 my-4 space-y-4">
          <header className="flex justify-between items-end">
            <div className="space-y-2 text-lg">
              <div className="indicator">
                <span className="indicator-item badge badge-info">
                  {plan.numberOfMembers}명
                </span>
                <div className="avatar-group -space-x-6">
                  {(plan.members || []).map((member, i) => (
                    <div className="avatar border-gray-100" key={`member-${i}`}>
                      <div className="w-12">
                        <UserProfileImage user={member} />
                      </div>
                    </div>
                  ))}
                  <div className="avatar border-gray-100 bg-white">
                    <div className="w-12">
                      <label htmlFor="invite-member-modal">
                        <Image src={plus} alt="" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {plan.startDate ? (
                  <div>
                    {DateTime.fromJSDate(new Date(plan.startDate)).toFormat(
                      'yyyy년 MM월 dd일',
                    )}{' '}
                    ~{' '}
                    {DateTime.fromJSDate(new Date(plan.startDate))
                      .plus({ days: plan.period })
                      .toFormat('yyyy년 MM월 dd일')}
                  </div>
                ) : (
                  <div>
                    {plan.period - 1}박{plan.period}일
                  </div>
                )}
              </div>
              <div className="space-x-2">
                {plan.tags.map((tag: string, idx: number) => (
                  <div key={idx} className="badge">
                    {'#' + tag}
                  </div>
                ))}
              </div>
            </div>
            <label htmlFor="modify-name-modal" className="btn btn-secondary">
              편집
            </label>
          </header>
        </div>
        <div className="divider"></div>
        <LoadScript
          googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
          libraries={['places']}
        >
          <div className="">
            <GoogleMap
              options={{ disableDefaultUI: true }}
              mapContainerStyle={containerStyle}
              center={
                flattenScheduleSlot(plan.itinerary[0][0]).details.geometry
                  ?.location || {
                  lat: 0,
                  lng: 0,
                }
              }
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {plan.itinerary
                .flatMap((schedule) => schedule)
                .filter((schedule) => schedule.system?.details)
                .map((schedule, idx) => {
                  return (
                    <Marker
                      key={`place-${idx}`}
                      position={
                        flattenScheduleSlot(schedule).details.geometry
                          ?.location || {
                          lat: 0,
                          lng: 0,
                        }
                      }
                    ></Marker>
                  );
                })}
            </GoogleMap>
          </div>
        </LoadScript>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="space-y-2 p-4">
            {plan.itinerary.map(
              (itineraryDaily: ItineraryDaily, dayIdx: number) => (
                <div className="py-4" key={`day-${dayIdx}`}>
                  <h1 className="font-bold text-xl">{`Day${dayIdx + 1}`}</h1>
                  <Droppable key={dayIdx} droppableId={dayIdx.toString()}>
                    {(provided) => (
                      <ul {...provided.droppableProps} ref={provided.innerRef}>
                        {itineraryDaily
                          .filter(
                            (itinerary: ScheduleSlot) =>
                              itinerary.type === 'place',
                          )
                          .map((itinerary: ScheduleSlot, idx: number) => (
                            <Draggable
                              key={`itinerary${dayIdx}-${idx}`}
                              draggableId={`itinerary${dayIdx}-${idx}`}
                              index={idx}
                              isDragDisabled={
                                idx === 0 || idx === itineraryDaily.length - 1
                              }
                            >
                              {(provided) => {
                                const place = flattenScheduleSlot(itinerary)
                                  ?.details as Partial<TranslatedPlaceData>;
                                return (
                                  <li
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    onClick={() => {
                                      if (place) {
                                        map?.panTo(
                                          place.geometry?.location || {
                                            lat: 0,
                                            lng: 0,
                                          },
                                        );
                                      }
                                    }}
                                  >
                                    <div
                                      className="py-1"
                                      key={`itinerary-${idx}`}
                                    >
                                      <div className="flex items-center space-x-4 h-[124px]">
                                        <div className="flex flex-col h-full">
                                          <div className="h-6"></div>
                                          <div className="grow mx-auto flex items-center justify-center">
                                            <div className="avatar placeholder">
                                              <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                                                <span className="text-l">
                                                  {idx + 1}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="relative top-4 h-[24px]"></div>
                                        </div>
                                        <div
                                          className={
                                            'card-body rounded-lg shadow-md bg-[#ffffff] ' +
                                            // itinerary idx가 처음 또는 마지막이면 회색
                                            // itinerary에 manual이 있으면 시안, 없으면 핑크
                                            (idx === 0 ||
                                            idx === itineraryDaily.length - 1
                                              ? 'shadow-gray-500'
                                              : itinerary?.manual
                                              ? 'shadow-cyan-300'
                                              : 'shadow-pink-300')
                                          }
                                        >
                                          <h2 className="card-title">
                                            <p className="flex-1 line-clamp-1">
                                              {place
                                                ? place.translated_name ||
                                                  place.name ||
                                                  '테스트'
                                                : '자동 추천 일정'}
                                            </p>
                                            {place &&
                                              !place?.types?.includes(
                                                AddressType.airport,
                                              ) &&
                                              !place?.types?.includes(
                                                AddressType.lodging,
                                              ) && (
                                                <button
                                                  onClick={() =>
                                                    ToggleSchedule(dayIdx, idx)
                                                  }
                                                >
                                                  <Image
                                                    src={
                                                      !plan.itinerary[dayIdx][
                                                        idx
                                                      ].manual
                                                        ? check
                                                        : x
                                                    }
                                                    alt="check"
                                                    width={28}
                                                    height={28}
                                                  />
                                                </button>
                                              )}
                                            {place &&
                                              !place?.types?.includes(
                                                AddressType.airport,
                                              ) &&
                                              !place?.types?.includes(
                                                AddressType.lodging,
                                              ) && (
                                                <button
                                                  onClick={() =>
                                                    onClickDeleteItinerary(
                                                      dayIdx,
                                                      idx,
                                                    )
                                                  }
                                                >
                                                  <Image
                                                    src={trash}
                                                    alt="delete"
                                                    width={20}
                                                    height={20}
                                                  />
                                                </button>
                                              )}
                                          </h2>
                                          <a
                                            className="line-clamp-1"
                                            target="_blank"
                                            href={
                                              place
                                                ? GetGoogleMapUrl(
                                                    place.geometry?.location
                                                      .lat || 0,
                                                    place.geometry?.location
                                                      .lng || 0,
                                                    place.place_id || '',
                                                  )
                                                : undefined
                                            }
                                          >
                                            {place
                                              ? place.formatted_address
                                              : '저장 및 추천을 눌러 자동으로 추천 받으세요'}
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              }}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                  <div className="flex space-x-4 mr-4">
                    {/* 새 사용자 일정 추가 */}
                    <label
                      className="btn btn-ghost bg-white flex justify-center shadow-lg mt-2 w-1/2"
                      onClick={() => setSelectDay(dayIdx)}
                      htmlFor="modal-google-map"
                    >
                      <Image src={plus} alt="plus" width={32} height={32} />
                      직접 일정 추가
                    </label>
                    {/* 새 AI 추천 일정 추가 */}
                    <label
                      className="btn btn-ghost bg-white flex justify-center shadow-lg mt-2 w-1/2 underline decoration-sky-500/80 decoration-2 underline-offset-4 decoration-wavy shadow-sky-500/50"
                      onClick={() => onClickAddItinerary(dayIdx)}
                      htmlFor=""
                    >
                      <div className="text-sky-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="mr-2 w-5 h-5"
                          viewBox="0 0 16 16"
                        >
                          <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z" />
                        </svg>
                      </div>
                      추천 일정 추가
                    </label>
                  </div>
                </div>
              ),
            )}
          </div>
        </DragDropContext>
        <ModifyPlanModal />
        <InviteMemberModal />
        <GoogleMapModal day={selectDay} />
        <div className="h-32"></div>
        <div className="sticky bottom-20 flex space-x-4 px-4 justify-center">
          <button
            className={
              'btn btn-accent w-40 shadow-lg shadow-accent' +
              (loading ? ' loading' : '')
            }
            onClick={handleUpdateRecommend}
          >
            {loading ? '' : '저장 & 추천 갱신'}
          </button>
          <button
            className="btn btn-primary w-40 shadow-lg shadow-primary"
            onClick={() => {
              setPlan(initPlan());
              router.push(`/plan/details/${plan.planId}`);
            }}
          >
            최종 계획 확인
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className=""
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </button>
        </div>
        <BtmNavbar currentPath={2} />
      </div>

      <Sidebar />
    </div>
  );
};

export default PlanPage;
