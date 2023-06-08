import { FC, useCallback, useEffect, useState } from 'react';
import { LatLng } from '@/types';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { getRecommendPlaces } from '@/services/mapService';
import { PlaceData } from '@googlemaps/google-maps-services-js';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const FastRecommend: FC = () => {
  const [pos, setPos] = useState<LatLng>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [recommendPlaces, setRecommendPlaces] = useState<Partial<PlaceData>[]>(
    [],
  );

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
          // await new Promise((resolve) => setTimeout(resolve, 50));
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
      {recommendPlaces.map((place, idx) => (
        <div key={`recommend-${idx}`}>{place.name}</div>
      ))}
    </div>
  );
};

export default FastRecommend;
