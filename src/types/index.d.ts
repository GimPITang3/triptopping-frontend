import { PlaceData } from '@googlemaps/google-maps-services-js';

export interface IPlace {
  type: 'place';

  time: Date;
  duration: number;
  cost: number;

  details: Partial<IPlaceData>;
}

export interface ITransport {
  type: 'transport';

  time: Date;
  duration: number;
  cost: number;
}

export type ItineraryType = IPlace | Transport;

export type Itinerary<T> = T extends { type: string }
  ? {
      type: T['type'];
      system?: Partial<Omit<T, 'type'>>;
      manual?: Partial<Omit<T, 'type'>>;
    }
  : never;

export type ItinerarySlot = Itinerary<ItineraryType>;

export type ItinerariesDay = ItinerarySlot[];

export type Itineraries = ItinerariesDay[];

export interface IPlan {
  planId: string;
  name: string;
  author: Types.ObjectId;
  numberOfMembers: number;
  members: Types.ObjectId[];
  startDate?: Date;
  period: number;
  budget: number;
  tags: string[];
  itineraries: Itineraries;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
