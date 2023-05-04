import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import arrowLeftCircle from '../../../../public/arrowleftcircle.svg';
import hamburger from '../../../../public/hamburger.svg';
import { DateTime } from 'luxon';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { PlanContext } from '@/contexts';
import { IItinerary, IPlan } from '@/types';

interface SearchResult {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
}

const GetItineraryValue = (itinerary: any, key: string) => {
  return itinerary.manual[key] || itinerary.system[key];
};

const initialPlan: IPlan = {
  name: '지수의 콩국수 여행기',
  num: 4,
  members: [],
  // 예산 설정, 단위는 원
  budget: 2000000,
  // 기간 설정
  period: 3, // 3일, 이게 필수
  startAt: new Date('2024-01-01'), // 이건 선택
  tags: ['바다', '식도락', '힐링'],
  // 일정
  itineraries: [
    [
      {
        type: 'place',
        system: {
          place: {
            name: '인천국제공항',
          },
          time: '2023-02-28 10:00:00',
        },
        manual: {},
      },

      {
        type: 'place',
        system: {
          // 추천에 의해 결정된 내용
          time: '2023-02-28 17:00:00',
          place: {
            name: '시부야',
          },
        },
        manual: {
          // 사용자에 의해 결정된 내용
        },
      },
      {
        type: 'transport',
        // 대충 구글 API 결과 그대로 저장하기 (맵에 그릴수 있는 정도로만)
        system: {},
        manual: {},
      },
    ],
    [
      {
        type: 'place',
        system: {
          // 추천에 의해 결정된 내용
          time: '2023-03-01 17:00:00',
        },
        manual: {
          // 사용자에 의해 결정된 내용
          place: {
            name: '돈키호테',
          },
        },
      },
      {
        type: 'place',
        system: {
          // 추천에 의해 결정된 내용
          time: '2023-03-01 20:00:00',
          place: {
            name: '도쿄타워',
          },
        },
        manual: {
          // 사용자에 의해 결정된 내용
        },
      },
      {
        type: 'place',
        system: {
          // 추천에 의해 결정된 내용
          time: '2023-03-01 22:00:00',
          place: {
            name: '규카츠 집',
          },
        },
        manual: {
          // 사용자에 의해 결정된 내용
        },
      },
    ],
  ],
  createdAt: new Date('2023-03-20 20:33:56'),
  updatedAt: new Date('2023-03-20 20:33:56'),
  deletedAt: undefined,
};

const ModifyNameModal: React.FC = () => {
  const { plan, setPlan } = useContext(PlanContext);
  const [name, setName] = useState(plan.name);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onClickOk = () => {
    setPlan({ ...plan, name });
  };

  return (
    <div>
      <input type="checkbox" id="modify-name-modal" className="modal-toggle" />
      <label htmlFor="modify-name-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">새로운 이름을 설정해주세요</h3>
          <input
            value={name}
            className="input input-bordered py-4"
            onChange={onChange}
          />
          <div>
            <label className="btn" htmlFor="modify-name-modal">
              취소
            </label>
            <label
              className="btn"
              htmlFor="modify-name-modal"
              onClick={onClickOk}
            >
              확인
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

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
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

  useEffect(() => {
    setPlan(initialPlan);
  }, [setPlan]);

  return (
    <div className="min-h-screen">
      <div className="flex justify-between">
        <button>
          <Image src={arrowLeftCircle} alt="back" width={32} height={32} />
        </button>
        <button>
          <Image src={hamburger} alt="menu" width={32} height={32} />
        </button>
      </div>
      <div>
        <div className="flex items-end">
          <div className="text-2xl font-bold">{plan.name}</div>
        </div>
        <div>
          {plan.startAt ? (
            <div>
              {DateTime.fromJSDate(plan.startAt).toFormat('yyyy년 MM월 dd일')} ~{' '}
              {DateTime.fromJSDate(plan.startAt)
                .plus({ days: plan.period })
                .toFormat('yyyy년 MM월 dd일')}
            </div>
          ) : (
            <div>
              {plan.period}박{plan.period}일
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
        <label htmlFor="modify-name-modal" className="link pl-2">
          편집
        </label>
      </div>
      <div className="divider"></div>
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
            center={center}
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
      </LoadScript>
      <div className="space-y-2 p-4">
        {plan.itineraries.map((itineraryDaily: IItinerary[], idx: number) => (
          <div key={`day-${idx}`}>
            <h1 className="font-bold">{`Day${idx + 1}`}</h1>
            {itineraryDaily
              .filter((itinerary: IItinerary) => itinerary.type === 'place')
              .map((itinerary: IItinerary, idx: number) => (
                <div className="py-1" key={`itinerary-${idx}`}>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <div />
                      <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                          <span className="text-l">{idx + 1}</span>
                        </div>
                      </div>
                      <div>100m</div>
                    </div>
                    <div className="card-body shadow-lg bg-[#fafcff]">
                      <h2 className="card-title">
                        {GetItineraryValue(itinerary, 'place').name}
                      </h2>
                      <p>place details</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <ModifyNameModal />
    </div>
  );
};

export default PlanPage;
