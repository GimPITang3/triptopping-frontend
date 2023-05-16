import { PlanContext } from '@/contexts';
import { Place, Plan } from '@/types';
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
import { getPlanDetails } from '@/services/plansService';
import { TopbarContainer } from '@/components/TopbarContainer';

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
      // console.log(plan.itinerary[page][idx].system?.details.name);
      return plan.itinerary[page][idx].system?.details || null;
    });
  };

  useEffect(() => {
    if (id) {
      getPlanDetails(`${id}`).then((plan) => {
        setPlan(plan);
        console.log(plan.itinerary[0][0].system?.details);
        setFocusedPlace(plan.itinerary[0][0].system?.details || null);
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
                    itinerary.system?.details.geometry?.location || {
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
                    itinerary.system?.details.geometry?.location || {
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

      <div className="absolute top-0 left-0 flex flex-col w-full z-10 items-start pointer-events-none h-screen">
        <div className="backdrop-blur-sm bg-white/80 w-full pointer-events-auto">
          <Topbar />
        </div>
        <div className="pointer-events-auto bg-white/90 grow overflow-y-auto scrollbar-hide">
          <ul
            key={`day-${page}`}
            onScroll={(e) => {
              handleScroll(e.currentTarget.scrollTop);
            }}
            className="steps steps-vertical snap-y snap-mandatory h-full overflow-y-auto scrollbar-hide"
          >
            {itineraryDaily
              .filter((itinerary) => itinerary.type === 'place')
              .map((itinerary, index) => (
                <li
                  key={`it-${index}`}
                  className="step step-neutral snap-always snap-start h-24"
                >
                  <div>{itinerary.system && itinerary.system.details.name}</div>
                </li>
              ))}
            <li className="h-screen"></li>
          </ul>
        </div>
        <div className="tabs tabs-boxed justify-center backdrop-blur-sm bg-white/80 pointer-events-auto w-full">
          {plan.itinerary.map((_value, index) => (
            <button
              key={`page-${index}`}
              onClick={() => setPage(index)}
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
