import { PlanContext } from '@/contexts';
import { useRouter } from 'next/router';
import { 
  FC,
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';

interface SearchResult {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
}

const Num: FC = () => {
  const router = useRouter();
  const { plan, setPlan } = useContext(PlanContext);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [countryName, setCountryName] = useState('');
  const [cityName, setCityName] = useState('');

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setCenter(center);
    setMap(map);
    setMarker(new google.maps.Marker);
    setGeocoder(new google.maps.Geocoder);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setGeocoder(null);
    setMarker(null);
  }, []);

  const onSearchBoxLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
    searchBox?.setBounds(map?.getBounds() as google.maps.LatLngBounds);
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
    geocode({ location: place.geometry.location });
  }, [searchBox, map]);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const clear = () => {
    marker?.setMap(null);
  }

  const onClickGeocode = (e: google.maps.MapMouseEvent) => {
    geocode({ location: e.latLng });
  }

  const geocode = (req: google.maps.GeocoderRequest) => {
    clear();

    if(!geocoder || !map || !marker) return;

    geocoder
      .geocode(req)
      .then((res) => {
        const { results } = res;

        map.setCenter(results[0].geometry.location);
        marker.setPosition(results[0].geometry.location);
        marker.setMap(map);
        console.log(results);
        for (let i=0; i<results[0].address_components.length; i++) {
          for (let j=0;j<results[0].address_components[i].types.length;j++) {
            if(results[0].address_components[i].types[j] == "country")
            {
              setCountryName(results[0].address_components[i].long_name);
            }
            if(results[0].address_components[i].types[j] == "administrative_area_level_1")
            {
              setCityName(results[0].address_components[i].long_name);
            }
          }
        }
        return results;
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
  }

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="font-bold text-3xl mb-8">{plan.name}</div>
      <div className="flex-grow">
        <div className="text-xl my-4">어디로 여행가세요?</div>
        <div className="flex py-8 justify-center">
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
                  onChange={(e) => console.log(e.target.value)}
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
                onClick={onClickGeocode}
                onUnmount={onUnmount}
              >
                
              </GoogleMap>
            </div>
          </LoadScript>
        </div>
        <div className="flex text-xl my-4 justify-center">{countryName + ' ' + cityName} (으)로 여행갈래요.</div>
      </div>
      <div className="flex w-full space-x-4">
        <button
          className="flex-1 btn"
          onClick={() => router.push('/plan/new/num')}
        >
          뒤로가기
        </button>
        <button
          className="flex-1 btn btn-primary"
          onClick={() => router.push('/plan/new/budget')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Num;
