import { PlaceData } from '@googlemaps/google-maps-services-js';

export interface Place {
  [key: string]: any;
  type: 'place';

  /** milli seconds */
  time?: number;
  /** milli seconds */
  duration?: number;
  cost?: number;

  details?: Partial<PlaceData>;
}

export interface Transport {
  [key: string]: any;
  type: 'transport';

  /** milli seconds */
  time?: number;
  /** milli seconds */
  duration?: number;
  cost?: number;
}

export type ScheduleType = Place | Transport;

export type Schedule<T> = T extends { type: string }
  ? {
      type: T['type'];
      system?: Partial<Omit<T, 'type'>>;
      manual?: Partial<Omit<T, 'type'>>;
    }
  : never;

export type ScheduleSlot = Schedule<ScheduleType>;

export type ItineraryDaily = ScheduleSlot[];

export type Itinerary = ItineraryDaily[];

export interface Plan {
  planId: string;
  name: string;
  author: Types.ObjectId;
  numberOfMembers: number;
  members: Types.ObjectId[];
  startDate?: Date;
  period: number;
  budget: number;
  tags: string[];
  itinerary: Itinerary;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface User {
  userId: string;
  nickname: string;
}