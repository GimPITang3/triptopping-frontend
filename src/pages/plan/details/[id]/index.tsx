import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import api from '@/utils/AxiosInstance';
import { useRouter } from 'next/router';
import { PlanContext } from '@/contexts';
import arrowLeftCircle from '../../../../../public/arrowleftcircle.svg';
import home from '../../../../../public/home.svg';
import Image from 'next/image';
import { Place, Plan } from '@/types';
import {
  LoadScript,
  StandaloneSearchBox,
  GoogleMap,
  Marker,
} from '@react-google-maps/api';

const Topbar: FC = () => {
  const { plan } = useContext(PlanContext);
  return (
    <div className="mx-auto px-4">
      <div className="relative flex items-center justify-between h-12">
        <div className="flex-shrink-0 flex items-center font-bold text-xl">
          <Image
            src={arrowLeftCircle}
            alt="arrowLeftCircle"
            width={24}
            height={24}
          />
          <div>{plan.name}</div>
        </div>
      </div>
    </div>
  );
};

const Detail: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { plan, setPlan } = useContext(PlanContext);
  const [page, setPage] = useState(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [focusedPlace, setFocusedPlace] = useState<Place | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const containerStyle = {
    width: '90%',
    height: '400px',
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const handleScroll = (height: number) => {
    // magic number. please change.
    const idx = Math.floor(height / 64);
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
      api.get<Plan>(`/plans/${id}`).then((res) => {
        // console.log(res);
        setPlan(res.data);
      });
    }
  }, [id]);

  if (!plan.planId) {
    return <div></div>;
  }

  const itineraryDaily = plan.itinerary[page];
  return (
    <div>
      <Topbar />
      <ul
        key={`day-${page}`}
        onScroll={(e) => {
          handleScroll(e.currentTarget.scrollTop);
        }}
        className="steps steps-vertical snap-y snap-mandatory max-h-[85vh] overflow-auto scrollbar-hide"
      >
        {itineraryDaily
          .filter((itinerary) => itinerary.type === 'place')
          .map((itinerary, index) => (
            <li
              key={`it-${index}`}
              className="w-full step step-neutral snap-center"
            >
              <div>{itinerary.system && itinerary.system.details.name} </div>
            </li>
          ))}
        <div className="min-h-screen"></div>
      </ul>

      <LoadScript
        googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
        libraries={['places']}
      >
        <div className="h-full">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          ></GoogleMap>
        </div>
      </LoadScript>

      <div className="btn-group">
        {plan.itinerary.map((_value, index) => (
          <button
            key={`page-${index}`}
            onClick={() => setPage(index)}
            className={'btn' + (index === page ? ' btn-active' : '')}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Detail;
