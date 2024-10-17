import { createContext } from "react";
import { Place } from "../types";

interface IPlaceContextProps {
  place: Place | null;
  setPlace: React.Dispatch<Place>;
}

const PlaceContext = createContext<IPlaceContextProps>({} as IPlaceContextProps);

export default PlaceContext;
