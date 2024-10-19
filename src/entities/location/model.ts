import { LocationType } from "./types";

type LocationModel = {
  id?: number;
  name: string;
  location_type: LocationType;
  parent_id?: number;
  parent?: LocationModel | null;
}

export default LocationModel;
