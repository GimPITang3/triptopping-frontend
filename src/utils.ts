import { Place, ScheduleSlot, ScheduleType } from './types';

export function flattenScheduleSlot(schedule: ScheduleSlot): ScheduleType {
  return <ScheduleType>{
    type: schedule.type,
    ...schedule.system,
    ...schedule.manual,
  };
}

export function GetGoogleMapUrl(lat: number, lng: number, placeId: string) {
  return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}&query_place_id=${placeId}`;
}
