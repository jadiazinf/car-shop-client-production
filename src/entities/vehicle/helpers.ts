import { VehicleType } from "./types";

function translateVehicleType(vehicleType: VehicleType) {
  switch (vehicleType) {
    case VehicleType.CAR:
      return "Carro";
    case VehicleType.VAN:
      return "Camioneta";
    case VehicleType.TRUCK:
      return "Camión";
    case VehicleType.MOTORBIKE:
      return "Moto";
    default:
      return "Unknown";
  }
}

export const VehicleHelpers = {
  translateVehicleType,
};
