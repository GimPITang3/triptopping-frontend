import { TopbarContainer } from '@/components/TopbarContainer';
import { PlanContext } from '@/contexts';
import { getPlanDetails } from '@/services/plansService';
import { Place } from '@/types';
import { GetGoogleMapUrl, flattenScheduleSlot } from '@/utils';
import { decode } from '@googlemaps/polyline-codec';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useContext, useEffect, useState } from 'react';

const Topbar: FC = () => {
  const { plan } = useContext(PlanContext);
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };

  return (
    <TopbarContainer>
      <div className="navbar bg-white shadow-xl rounded-box">
        <div className="navbar-start ps-1 w-fit">
          <div className="">
            <Link href="/plan/list">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-7 w-7" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="grow flex justify-center">
          <div className="font-bold text-xl text-ellipsis text-center line-clamp-1">
            {`${plan.name}`}
          </div>
        </div>
        <div className="navbar-end w-[28px]">

        </div>
      </div>
    </TopbarContainer>
  );
};

const decodePolyline = (encoded: string) => {
  const decodedPaths = decode(encoded, 5);
  return decodedPaths.map((path) => ({
    lat: path[0],
    lng: path[1],
  }));
};

const Detail: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { plan, setPlan } = useContext(PlanContext);
  const [page, setPage] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [folded, setFolded] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const containerStyle = {
    width: '100%',
    height: '100vh',
  };

  const handleScroll = (height: number) => {
    //! magic number. please change.
    // console.log(height);
    const idx = Math.floor(height / 96);
    setFocusedIndex(idx);
    if (idx > plan.itinerary[page].length - 1) {
      return;
    }
    setFocusedPlace((prev) => {
      if (
        plan.itinerary[page][idx].type !== 'place' ||
        prev === plan.itinerary[page][idx]
      ) {
        return prev;
      }
      return flattenScheduleSlot(plan.itinerary[page][idx]).details || null;
    });
  };

  useEffect(() => {
    if (id) {
      getPlanDetails(`${id}`).then((plan) => {
        setPlan(plan);
        setFocusedPlace(
          flattenScheduleSlot(plan.itinerary[0][0]).details || null,
        );
      });
    }
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

  if (!plan.routes?.length) {
    return <div></div>;
  }

  const itineraryDaily = plan.itinerary[page];
  const GetIcon = () => {
    return 'https://cdn.discordapp.com/attachments/1107627544850731028/1107627583601922158/lodging-icon.png';
  };
  return (
    <div className="relative min-h-screen">
      <Head>
        <title>{`${plan.name}`}</title>
      </Head>
      <LoadScript
        googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
        libraries={['places']}
      >
        <div className="h-full">
          <GoogleMap
            options={{ disableDefaultUI: true }}
            mapContainerStyle={containerStyle}
            zoom={15}
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
            {plan?.routes[page]
              .flatMap((route) => route.legs.flatMap((leg) => leg.steps))
              .map((step, idx) => {
                return (
                  <Polyline
                    key={`poly-${idx}`}
                    options={{
                      strokeColor: '#1d4ed8',
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                      clickable: false,
                      draggable: false,
                      editable: false,
                      visible: true,
                      path: decodePolyline(step.polyline.points),
                      zIndex: 1,
                    }}
                  />
                );
              })}
          </GoogleMap>
        </div>
      </LoadScript>

      <div className="absolute top-0 left-0 flex flex-col w-full items-start pointer-events-none h-screen">
        <div className="w-full pointer-events-auto z-10">
          <Topbar />
        </div>
        <div className="absolute top-[55px] h-20 z-10 w-full ">
          <div className="h-20 z-10 pointer-events-auto bg-white mx-2 rounded-b-2xl">
            {focusedPlace && (
              <div className="flex items-center pl-[12px] h-full">
                <div className="rounded-full bg-[#3d4451] h-8 w-8 text-white text-center text-xl shrink-0">
                  {focusedIndex + 1}
                </div>
                <div className="overflow-hidden pl-3 pr-6">
                  <div className="text-2xl font-bold flex items-end">
                    <div className="pr-3 line-clamp-1">
                      {focusedPlace?.translated_name || focusedPlace?.name || ''}
                    </div>
                    <Image
                      src={focusedPlace?.icon || ''}
                      alt="icon"
                      width={24}
                      height={24}
                    />
                  </div>
                  <a
                    className="text-sm line-clamp-1"
                    href={GetGoogleMapUrl(
                      focusedPlace?.geometry?.location.lat,
                      focusedPlace?.geometry?.location.lng,
                      focusedPlace.place_id,
                    )}
                    target="_blank"
                  >
                    {focusedPlace?.formatted_address || ''}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-2 h-[90px] w-[20px] z-10 pointer-events-none bg-white rounded-tl-2xl">

        </div>
        <div
          className={
            '-mt-[33px] mb-[56px] pointer-events-auto bg-white grow overflow-y-auto scrollbar-hide shadow-[10px_0_10px_-5px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out' +
            (folded ? ' pr-4' : '')
          }
        >
          <ul
            key={`day-${page}`}
            onScroll={(e) => {
              handleScroll(e.currentTarget.scrollTop);
            }}
            className="steps steps-vertical snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide pl-4"
          >
            {itineraryDaily
              .filter((itinerary) => itinerary.type === 'place')
              .map((itinerary, index) => (
                <li
                  key={`it-${index}`}
                  className="step step-neutral snap-always snap-start h-24 cursor-pointer"
                  // 클릭시 해당 li가 top으로 스크롤
                  onClick={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement as HTMLUListElement;
                    const scroll = target.offsetTop - parent.offsetTop;
                    parent.scrollTo({
                      top: scroll,
                      behavior: 'smooth',
                    });
                  }}
                >
                  <div className="">
                    {folded ? flattenScheduleSlot(itinerary).details.name : ''}
                  </div>
                </li>
              ))}
            <li className="h-screen"></li>
          </ul>
        </div>

        <div className="absolute bottom-0 tabs tabs-boxed justify-center bg-white pointer-events-auto w-full rounded-none flex-nowrap overflow-x-auto whitespace-nowrap">
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
                'tab tab-lg flex-shrink-0 inline-block' +
                (index === page ? ' tab-active' : '')
              }
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-14 bg-white m-4 z-30">
        <button
          className="btn btn-outline btn-sm ring-8 ring-white/50"
          onClick={() => {
            setFolded(!folded);
          }}
        >
          {folded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-4 w-4"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
              <path
                fillRule="evenodd"
                d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-4 w-4"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"
              />
              <path
                fillRule="evenodd"
                d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Detail;
