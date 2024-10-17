import { ReactNode, useState } from "react";
import PlaceContext from "../contexts/place";
import { Place } from "../types";

function PlaceProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<Place | null>(null);

  return (
    <PlaceContext.Provider value={{place: state, setPlace: setState}}>
      { props.children }
    </PlaceContext.Provider>
  );
}

export default PlaceProvider;
