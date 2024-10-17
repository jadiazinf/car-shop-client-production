import { createContext } from "react";
import VehicleModel from "../model";

interface IVehicleContextProps {
  vehicle: VehicleModel | null;
  setVehicle: React.Dispatch<VehicleModel>
}

const VehicleContext = createContext({} as IVehicleContextProps);

export default VehicleContext;
