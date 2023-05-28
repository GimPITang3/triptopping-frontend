import {
  PlaceData,
  DirectionsRoute,
} from '@googlemaps/google-maps-services-js';

export interface TranslatedPlaceData extends PlaceData {
  translated_name: string;
}

export interface Place {
  [key: string]: any;
  type: 'place';

  /** milli seconds */
  time?: number;
  /** milli seconds */
  duration?: number;
  cost?: number;

  details?: Partial<TranslatedPlaceData>;
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

export interface LatLng {
  lat: number;
  lng: number;
}

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
  loc: LatLng;
  itinerary: Itinerary;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  excludes?: string[];
  loc?: LatLng;
  routes?: DirectionsRoute[][];
}

export interface User {
  userId: string;
  nickname: string;
  email: string;
  introduce: string;
}

export interface Article {
  articleId: string;
  title: string;
  author: User;
  plan?: Plan;
  content: string;
  likes: number;
  comments: Comment[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  author: User;
  content: string;
  createdAt: Date;
}

export interface PaginationOptionsDto {
  skip: number;
  limit: number;
}

export interface PaginationResponseDto<T> {
  items: T[];

  skip: number;
  limit: number;
  total: number;
}
