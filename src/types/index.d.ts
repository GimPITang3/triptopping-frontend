export interface IPlan {
  name: string;
  num: number;
  members: string[];
  budget: number;
  period: number;
  startAt?: Date;
  tags: string[];
  itineraries: IItinerary[][];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IItinerary {
  type: string;
  system: any;
  manual: any;
}
