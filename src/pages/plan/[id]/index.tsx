import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';

import {
  GoogleMap,
  LoadScript,
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
import { ItineraryDaily, Place, ScheduleSlot } from '@/types';

import { excludePlaces, getPlan, updatePlan } from '@/services/plansService';

import ModifyPlanModal from '@/components/ModifyPlanModal';
import MenuToggle from '@/components/Topbar/MenuToggle';
import { TopbarContainer } from '@/components/TopbarContainer';

import BtmNavbar from '@/components/BtmNavbar';
import { GetGoogleMapUrl, flattenScheduleSlot } from '@/utils';
import { PlaceData } from '@googlemaps/google-maps-services-js';
import arrowLeftCircle from '../../../../public/arrowleftcircle.svg';
import check from '../../../../public/check.svg';
import plus from '../../../../public/plus.svg';
import trash from '../../../../public/trash.svg';

interface SearchResult {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
}

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
    height: '400px',
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
      newPlan.itinerary[day].push({
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
        <label className="modal-box relative max-w-3xl" htmlFor="">
          <div className="text-xl font-bold">추가할 장소를 선택해주세요</div>
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
                  placeholder="Search for a place"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                  }}
                />
              </StandaloneSearchBox>
              <GoogleMap
                mapContainerStyle={containerStyle}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              ></GoogleMap>
            </div>
          </LoadScript>
          <label className="btn btn-ghost" htmlFor="modal-google-map">
            취소
          </label>
          <label
            className="btn"
            htmlFor="modal-google-map"
            onClick={onClickAdd}
          >
            추가
          </label>
        </label>
      </label>
    </div>
  );
};

const PlanPage: NextPage = ({ }) => {
  const router = useRouter();
  const { id } = router.query;
  const { plan, setPlan } = useContext(PlanContext);
  const [selectDay, setSelectDay] = useState<number>(-1);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const { user, setUser } = useContext(UserContext);

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
    setSearchResult({
      position: {
        lat: place.geometry.location.lat() || 0,
        lng: place.geometry.location.lng() || 0,
      },
      name: place.name,
    });

    if (map) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
    }
  }, [searchBox, map]);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const onClickDeleteItinerary = async (day: number, index: number) => {
    const excludePlaceIds = plan.itinerary[day]
      .splice(index, 1)
      .map(
        (item) => (flattenScheduleSlot(item) as Place).details?.place_id || '',
      );
    await excludePlaces(id as string, excludePlaceIds);
    setPlan((prev) => {
      prev.excludes = Array.isArray(prev.excludes)
        ? prev.excludes.concat(excludePlaceIds)
        : excludePlaceIds;
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
    const data = await updatePlan(plan.planId, {
      itinerary: plan.itinerary,
    });
    console.log('updated plan', data);
    setPlan(data);
  };

  const FixSchedule = (day: number, index: number) => {
    console.log(day, index);
    setPlan((prev) => {
      prev.itinerary[day][index].manual = {
        ...prev.itinerary[day][index].manual,
        ...prev.itinerary[day][index].system,
      };
      delete prev.itinerary[day][index].system;
      return { ...prev };
    });
  };

  if (!plan.planId) {
    return <div></div>;
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>{`${plan.name}`}</title>
      </Head>
      <TopbarContainer>
        <div className="flex flex-row h-full items-center justify-between">
          <Link href="/plan/list">
            <Image src={arrowLeftCircle} alt="back" width={32} height={32} />
          </Link>
          <MenuToggle />
        </div>
      </TopbarContainer>
      <div className="px-4 my-4 space-y-4">
        <header className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-end">
              <div className="text-2xl font-bold">{plan.name}</div>
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
                  {tag}
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
      {/* <LoadScript
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
              placeholder="Search for a place"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
              }}
            />
          </StandaloneSearchBox>
          <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {searchResult && (
              <Marker
                position={searchResult.position}
                title={searchResult.name}
              />
            )}
          </GoogleMap>
        </div>
      </LoadScript> */}
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
                          >
                            {(provided) => {
                              const place = flattenScheduleSlot(itinerary)
                                ?.details as Partial<PlaceData>;
                              return (
                                <li
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
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
                                          'card-body rounded-lg shadow-md bg-[#fafcff] ' +
                                          (itinerary?.manual
                                            ? 'shadow-cyan-300'
                                            : 'shadow-pink-300')
                                        }
                                      >
                                        <h2 className="card-title">
                                          <p className="flex-1 line-clamp-1">
                                            {place.name || '테스트'}
                                          </p>
                                          <button
                                            onClick={() =>
                                              FixSchedule(dayIdx, idx)
                                            }
                                          >
                                            <Image
                                              src={check}
                                              alt="check"
                                              width={20}
                                              height={20}
                                            />
                                          </button>
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
                                              width={14}
                                              height={14}
                                            />
                                          </button>
                                        </h2>
                                        <a
                                          className="line-clamp-1"
                                          target="_blank"
                                          href={GetGoogleMapUrl(
                                            place.geometry?.location.lat || 0,
                                            place.geometry?.location.lng || 0,
                                            place.place_id || '',
                                          )}
                                        >
                                          {place.formatted_address}
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
                <label
                  className="btn btn-ghost flex justify-center shadow-lg mt-2"
                  onClick={() => setSelectDay(dayIdx)}
                  htmlFor="modal-google-map"
                >
                  <Image src={plus} alt="plus" width={32} height={32} />
                </label>
              </div>
            ),
          )}
        </div>
      </DragDropContext>
      <ModifyPlanModal />
      <GoogleMapModal day={selectDay} />
      <div className="h-32"></div>
      <div className="sticky bottom-20 flex space-x-4 px-4 justify-center">
        <button className="btn btn-accent w-40 shadow-lg shadow-accent" onClick={handleUpdateRecommend}>
          저장 & 추천 갱신
        </button>
        <button
          className="btn btn-primary w-40 shadow-lg shadow-primary"
          onClick={() => router.push(`/plan/details/${plan.planId}`)}
        >
          최종 계획 확인
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>
      <BtmNavbar user={user} currentPath={2} />
    </div>
  );
};

export default PlanPage;
