import { FC, useCallback, useEffect, useState } from 'react';
import { LatLng, TranslatedPlaceData } from '@/types';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { getRecommendPlaces } from '@/services/mapService';
import { PlaceData } from '@googlemaps/google-maps-services-js';
import { GetGoogleMapUrl } from '@/utils';
import haversineDistance from 'haversine-distance';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const FastRecommend: FC = () => {
  const [pos, setPos] = useState<LatLng>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [recommendPlaces, setRecommendPlaces] = useState<
    Partial<TranslatedPlaceData>[]
  >([]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          // TODO... very strange...
          // console.log(localStorage);
          await new Promise((resolve) => setTimeout(resolve, 100));
          const recommends = await getRecommendPlaces({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setRecommendPlaces(recommends);
        },
        (err) => console.log(err),
        { timeout: 1000 },
      );
    }
  }, []);

  if (pos.lat === 0 && pos.lng === 0) return <div>loading...</div>;
  return (
    <div>
      <LoadScript
        googleMapsApiKey="AIzaSyDPoOWUBAYwH31p72YcFFFiyJ5576f1i3E"
        libraries={['places']}
      >
        <GoogleMap
          options={{ disableDefaultUI: true }}
          mapContainerStyle={containerStyle}
          center={pos}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={pos}></Marker>
          {recommendPlaces.map((place, idx) => (
            <Marker
              key={`recommend-${idx}`}
              position={place.geometry?.location || { lat: 0, lng: 0 }}
              label={`${idx + 1}`}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <ul className="m-3">
        {recommendPlaces.map((place, idx) => {
          const dist = haversineDistance(
            pos,
            place.geometry?.location || { lat: 0, lng: 0 },
          );
          const distString =
            dist > 1000
              ? `${Math.floor(dist / 1000)}.${Math.floor(
                  (dist % 1000) / 100,
                )}km`
              : `${Math.floor(dist % 1000)}m`;
          return (
            <li key={`recommend-${idx}`}>
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
                    <div className="relative top-4 h-[24px]"></div>
                  </div>
                  <div className="card-body rounded-lg shadow-md bg-[#ffffff] shadow-pink-300">
                    <h2 className="card-title">
                      <p className="flex-1 line-clamp-1">
                        {place
                          ? place.translated_name || place.name || '테스트'
                          : '자동 추천 일정'}
                      </p>
                      <p className="flex-1 line-clamp-1">{distString}</p>
                    </h2>
                    <a
                      className="line-clamp-1"
                      target="_blank"
                      href={
                        place
                          ? GetGoogleMapUrl(
                              place.geometry?.location.lat || 0,
                              place.geometry?.location.lng || 0,
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
        })}
      </ul>
    </div>
  );
};

export default FastRecommend;
