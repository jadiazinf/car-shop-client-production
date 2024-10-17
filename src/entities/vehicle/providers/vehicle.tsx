import { ReactNode, useState } from "react";
import VehicleModel from "../model";
import VehicleContext from "../contexts/vehicle";

function VehicleProvider(props: { children: ReactNode }) {

  const [ state, setState ] = useState<VehicleModel | null>(null);

  return (
    <VehicleContext.Provider value={{vehicle: state, setVehicle: setState}}>
      { props.children }
    </VehicleContext.Provider>
  );

}

export default VehicleProvider;
