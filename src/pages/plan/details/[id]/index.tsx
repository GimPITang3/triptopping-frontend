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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import arrowLeftCircle from '../../../../../public/arrowleftcircle.svg';

const Topbar: FC = () => {
  const { plan } = useContext(PlanContext);
  const router = useRouter();
  const onBackClick = () => {
    router.back();
  };

  return (
    <TopbarContainer>
      <div className="relative flex items-center justify-between h-full">
        <div className="flex-shrink-0 flex items-center font-bold text-xl gap-x-2">
          <button onClick={onBackClick}>
            <Image
              src={arrowLeftCircle}
              alt="arrowLeftCircle"
              width={24}
              height={24}
            />
          </button>
          <div>{plan.name}</div>
        </div>
        <div className="flex-shrink-0 flex items-center font-bold text-xl gap-x-2">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="h-6 w-6"
              viewBox="0 0 16 16"
            >
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
            </svg>
          </Link>
        </div>
      </div>
    </TopbarContainer>
  );
};

const decodePolyline = (encoded: string) => {
  return decode(encoded, 5);
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

  if (!plan.planId) {
    return <div></div>;
  }

  const itineraryDaily = plan.itinerary[page];
  const GetIcon = () => {
    return 'https://cdn.discordapp.com/attachments/1107627544850731028/1107627583601922158/lodging-icon.png';
  };

  return (
    <div className="relative min-h-screen">
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

      <div className="absolute top-0 left-0 flex flex-col w-full items-start pointer-events-none h-screen">
        <div className="backdrop-blur-sm bg-white/80 w-full pointer-events-auto">
          <Topbar />
        </div>
        <div className="absolute top-12 w-full h-24 z-10 pointer-events-auto bg-white border-y-4 border-gray-100">
          {focusedPlace && (
            <div className="flex items-center pl-[21px] h-full">
              <div className="rounded-full bg-[#3d4451] h-8 w-8 text-white text-center text-xl shrink-0">
                {focusedIndex + 1}
              </div>
              <div className="overflow-hidden pl-3 pr-6">
                <div className="text-2xl font-bold flex items-end">
                  <div className="pr-3 line-clamp-1">
                    {focusedPlace?.name || ''}
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
        <div
          className={
            'pointer-events-auto bg-white/90 grow overflow-y-auto scrollbar-hide shadow-[10px_0_10px_-5px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out' +
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
