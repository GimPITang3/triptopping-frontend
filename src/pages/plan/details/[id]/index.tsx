import { TopbarContainer } from '@/components/TopbarContainer';
import { PlanContext } from '@/contexts';
import { getPlanDetails } from '@/services/plansService';
import { Place } from '@/types';
import { decode } from '@googlemaps/polyline-codec';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import arrowLeftCircle from '../../../../../public/arrowleftcircle.svg';
import { flattenScheduleSlot } from '@/utils';

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
        console.log(flattenScheduleSlot(plan.itinerary[0][0]).details);
        setFocusedPlace(
          flattenScheduleSlot(plan.itinerary[0][0]).details || null,
        );
      });
    }
  }, [id, setPlan]);

  if (!plan.planId) {
    return <div></div>;
  }

  const itineraryDaily = plan.itinerary[page];
  const center = focusedPlace?.geometry?.location || {
    lat: 0,
    lng: 0,
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
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {itineraryDaily
              .filter((itinerary) => itinerary.type === 'place')
              .map((itinerary, index) => (
                <Marker
                  key={`it-${index}`}
                  position={
                    flattenScheduleSlot(itinerary).details.geometry
                      ?.location || {
                      lat: 0,
                      lng: 0,
                    }
                  }
                ></Marker>
              ))}

            <Polyline
              options={{
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
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
                  <div className="pr-3">{focusedPlace?.name || ''}</div>
                  <Image
                    src={focusedPlace?.icon || ''}
                    alt="icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="text-sm truncate">
                  {focusedPlace?.formatted_address || ''}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="pointer-events-auto bg-white/90 grow overflow-y-auto scrollbar-hide">
          <ul
            key={`day-${page}`}
            onScroll={(e) => {
              handleScroll(e.currentTarget.scrollTop);
            }}
            className="steps steps-vertical snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide pl-4 pr-2"
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
                    {flattenScheduleSlot(itinerary).details.name}
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
              className={'tab tab-lg' + (index === page ? ' tab-active' : '')}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;
