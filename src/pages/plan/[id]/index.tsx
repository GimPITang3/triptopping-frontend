import { PlanContext } from '@/contexts';
import { IItinerary, IPlan } from '@/types';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import arrowLeftCircle from '../../../../public/arrowleftcircle.svg';
import hamburger from '../../../../public/hamburger.svg';
import dash from '../../../../public/dash.svg';
import plus from '../../../../public/plus.svg';
import Datepicker from 'react-tailwindcss-datepicker';

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
  const [tabIndex, setTabIndex] = useState(0);
  const [tag, setTag] = useState('');
  const [selected, setSelected] = useState(true);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setPlan({ ...plan, name: e.target.value });
  };

  const onChangeNum = (plus: boolean) => {
    if (plus) {
      setPlan({ ...plan, num: plan.num + 1 });
    } else {
      if (plan.num > 1) {
        setPlan({ ...plan, num: plan.num - 1 });
      }
    }
  };

  const addBudget = (num: number) => {
    setPlan({ ...plan, budget: plan.budget + num });
  };
  const changeEnteredBudget = (e: ChangeEvent<HTMLInputElement>) => {
    const budgetValue = parseInt(e.target.value.replace(/\,/g, ''));
    setPlan({ ...plan, budget: budgetValue });
  };

  const onChangePeriod = (plus: boolean) => {
    if (plus) {
      setPlan({ ...plan, period: plan.period + 1 });
    } else {
      if (plan.period > 1) {
        setPlan({ ...plan, period: plan.period - 1 });
      }
    }
  };

  const handleValueChange = (newValue: any) => {
    const s = DateTime.fromISO(newValue.startDate);
    const e = DateTime.fromISO(newValue.endDate);
    const period = e.diff(s, 'days').days;
    setPlan({ ...plan, startAt: s.toJSDate(), period: period });
  };

  const addTag = () => {
    if (!tag) {
      return;
    }
    setPlan({ ...plan, tags: [...plan.tags, tag] });
    setTag('');
  };

  const GetTab = () => {
    switch (tabIndex) {
      case 0:
        return (
          <div>
            <h3 className="text-lg font-bold">새로운 이름을 설정해주세요</h3>
            <input
              value={plan.name}
              className="input input-bordered py-4"
              onChange={onChangeName}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <h3 className="text-lg font-bold">인원 수를 설정해주세요</h3>

            <div className="flex py-8 justify-center">
              <button
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangeNum(false)}
              >
                <Image width={32} height={32} src={dash} alt="-" />
              </button>
              <div className="text-4xl font-bold self-center mx-16 rounded">
                {plan.num}
              </div>
              <button
                className="btn btn-outline hover:bg-slate-300"
                onClick={() => onChangeNum(true)}
              >
                <Image width={32} height={32} src={plus} alt="+" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-bold">예산을 설정해주세요</h3>

            <div className="flex flex-col py-8 max-w-md mx-auto">
              <div className="form-control flex-shrink">
                <label className="input-group flex">
                  <span>금액</span>
                  <input
                    type="text"
                    value={plan.budget.toLocaleString()}
                    onChange={changeEnteredBudget}
                    className="input input-bordered text-right grow"
                  />
                  <span>원</span>
                </label>
              </div>
              <div
                className="inline-flex rounded-md shadow-sm flex-shrink"
                role="group"
              >
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(10000)}
                >
                  +1만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(50000)}
                >
                  +5만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(100000)}
                >
                  +10만
                </button>
                <button
                  type="button"
                  className="grow px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={() => addBudget(1000000)}
                >
                  +100만
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="flex-grow">
              <div className="flex justify-center">
                <div className="tabs tabs-boxed bg-white">
                  <a
                    className={`tab tab-lg ${selected ? 'tab-active' : ''}`}
                    onClick={() => setSelected(true)}
                  >
                    날짜를 정했어요
                  </a>
                  <a
                    className={`tab tab-lg ${selected ? '' : 'tab-active'}`}
                    onClick={() => setSelected(false)}
                  >
                    기간만 정할게요
                  </a>
                </div>
              </div>

              {selected ? (
                <div>
                  <div className="text-xl my-8">
                    출발 - 도착 날짜를 입력해주세요!
                  </div>
                  <Datepicker
                    value={{
                      startDate:
                        plan.startAt === undefined ? null : plan.startAt,
                      endDate:
                        plan.startAt === undefined
                          ? null
                          : DateTime.fromJSDate(plan.startAt)
                              .plus({ day: plan.period })
                              .toJSDate(),
                    }}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </div>
              ) : (
                <div>
                  <div className="text-xl my-8">
                    며칠간 여행하시는지 알려주세요!
                  </div>
                  <div className="flex py-8 justify-center">
                    <button
                      disabled={plan.startAt !== undefined}
                      className="btn btn-outline hover:bg-slate-300"
                      onClick={() => onChangePeriod(false)}
                    >
                      <Image width={32} height={32} src={dash} alt="-" />
                    </button>
                    <div className="text-4xl font-bold self-center mx-16 rounded">
                      {plan.period}
                    </div>
                    <button
                      disabled={plan.startAt !== undefined}
                      className="btn btn-outline hover:bg-slate-300"
                      onClick={() => onChangePeriod(true)}
                    >
                      <Image width={32} height={32} src={plus} alt="+" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-bold">태그를 설정해주세요</h3>
            <div>
              <label
                htmlFor="search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  autoComplete="off"
                  value={tag}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') addTag();
                  }}
                  onChange={(e) => setTag(e.target.value)}
                  type="text"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search"
                  required
                />
                <button
                  onClick={() => addTag()}
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  추가
                </button>
              </div>
            </div>
            <div className="space-x-2">
              {plan.tags.map((tag, index) => (
                <div key={`tag-${index}`} className="badge badge-outline">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <div>
      <input type="checkbox" id="modify-name-modal" className="modal-toggle" />
      <label htmlFor="modify-name-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="tabs tabs-boxed">
            <a
              onClick={() => setTabIndex(0)}
              className={'tab ' + (tabIndex === 0 ? 'tab-active' : '')}
            >
              이름
            </a>
            <a
              onClick={() => setTabIndex(1)}
              className={'tab ' + (tabIndex === 1 ? 'tab-active' : '')}
            >
              인원 수
            </a>
            <a
              onClick={() => setTabIndex(2)}
              className={'tab ' + (tabIndex === 2 ? 'tab-active' : '')}
            >
              예산
            </a>
            <a
              onClick={() => setTabIndex(3)}
              className={'tab ' + (tabIndex === 3 ? 'tab-active' : '')}
            >
              날짜
            </a>
            <a
              onClick={() => setTabIndex(4)}
              className={'tab ' + (tabIndex === 4 ? 'tab-active' : '')}
            >
              태그
            </a>
          </div>
          {GetTab()}
          <div>
            <label className="btn" htmlFor="modify-name-modal">
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
          <div className="py-4" key={`day-${idx}`}>
            <h1 className="font-bold text-xl">{`Day${idx + 1}`}</h1>
            {itineraryDaily
              .filter((itinerary: IItinerary) => itinerary.type === 'place')
              .map((itinerary: IItinerary, idx: number) => (
                <div className="py-1" key={`itinerary-${idx}`}>
                  <div className="flex items-center space-x-4 h-[124px]">
                    <div className="flex flex-col h-full">
                      <div className="h-6"></div>
                      <div className="grow mx-auto flex items-center justify-center">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                            <span className="text-l">{idx + 1}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative top-4">100m</div>
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
