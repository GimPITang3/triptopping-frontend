import { LatLng } from '@/types';
import api from './axiosClient';

export const getRecommendPlaces = async (pos: LatLng) => {
  // const resp = await api.get(`/places/recommend`, {
  //   params: { lat: pos.lat, lng: pos.lng },
  // });
  // return resp.data;

  return [{ name: 'hi' }, { name: 'hello' }, { name: 'bye' }];
};
