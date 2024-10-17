import { createContext } from "react";
import LocationModel from "../model";

interface ILocationContextProps {
  location: LocationModel | null;
  setLocation: React.Dispatch<LocationModel>;
}

const LocationContext = createContext({} as ILocationContextProps);

export default LocationContext;
