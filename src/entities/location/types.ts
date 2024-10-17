import LocationModel from "./model";

export enum LocationType {
  COUNTRY = 'country',
  STATE = 'state',
  CITY = 'city',
  TOWN = 'town'
};

export type Place = {
  country: LocationModel | null;
  state: LocationModel | null;
  city: LocationModel | null;
  town: LocationModel | null;
}
