import { Color } from "../../consts/colors";
import { VehicleTransmission, VehicleType } from "./types";

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

function translateVehicleTransmission(transmission: VehicleTransmission) {
  switch (transmission) {
    case VehicleTransmission.AUTOMATIC:
      return "Automático";
    case VehicleTransmission.CVT:
      return "CVT";
    case VehicleTransmission.DCT:
      return "DCT";
    case VehicleTransmission.MANUAL:
      return "Manual";
    default:
      return "Desconocido";
  }
}

function translateVehicleColor(color: Color): string {
  switch(color) {
    case 'black': return 'Negro';
    case 'white': return 'Blanco';
    case 'gray': return 'Gris';
    case 'blue': return 'Azul';
    case 'red': return 'Rojo';
    case 'green': return 'Verde';
    case 'yellow': return 'Amarillo';
    case 'silver': return 'Plateado';
    case 'bronze': return 'Bronce';
    case 'gold': return 'Dorado';
    case 'sand': return 'Arena';
    default: return color;
  }
}

export const VehicleHelpers = {
  translateVehicleType,
  translateVehicleTransmission,
  translateVehicleColor
};
