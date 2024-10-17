export enum VehicleType {
  THIRD_TYPE = 'Less than 2.500 KGs',
  FOURTH_TYPE = 'Between 2.500 and 6.000 KGs',
  FIFTH = 'Between 6.000 KGs and 9000 KGs',
  TSP = 'More than 9000 KGs'
};

export const VEHICLE_TYPES_ARR: string[] = Object.values(VehicleType);

export enum EngineType {
  DIESEL = 'Diesel',
  GAS = 'Gas',
  GASOLINE = 'Gasoline',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid'
};

export const ENGINE_TYPE_ARR: string[] = Object.values(EngineType);

export enum VehicleTransmission {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual',
  DCT = 'Dual Clutch Transmission',
  CVT = 'Continuously Variable Transmission'
};

export const VEHICLE_TRANSMISSION_ARR: string[] = Object.values(VehicleTransmission);
