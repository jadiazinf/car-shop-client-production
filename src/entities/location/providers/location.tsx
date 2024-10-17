import { ReactNode, useState } from "react";
import LocationContext from "../contexts/location";
import LocationModel from "../model";

function LocationProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<LocationModel | null>(null);

  return (
    <LocationContext.Provider value={{location: state, setLocation: setState}}>
      { props.children }
    </LocationContext.Provider>
  );
}

export default LocationProvider;
