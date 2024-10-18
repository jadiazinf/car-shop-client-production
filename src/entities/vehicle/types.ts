export enum VehicleType {
  THIRD_TYPE = 'third_type',
  FOURTH_TYPE = 'fourth_type',
  FIFTH = 'fith_type',
  TSP = 'tsp'
};

export const VEHICLE_TYPES_ARR: {key: string; label: string}[] = [
  {key: 'third_type', label: 'Menor a 2.500 KGs'},
  {key: 'fourth_type', label: 'Entre 2.500 y 6.000 KGs'},
  {key: 'fifth_type', label: 'Entre 6.000 y 9.000 KGs'},
  {key: 'tsp', label: 'Más de 9.000 KGs'}
];

export enum EngineType {
  DIESEL = 'diesel',
  GAS = 'gas',
  GASOLINE = 'gasoline',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid'
};

export const ENGINE_TYPE_ARR: {key: string; label: string}[] = [
  {key: 'diesel', label: 'Diesel'},
  {key: 'gas', label: 'Gas'},
  {key: 'gasoline', label: 'Gasolina'},
  {key: 'hybrid', label: 'Híbrido'}
];

export enum VehicleTransmission {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  DCT = 'dct',
  CVT = 'cvt'
};

export const VEHICLE_TRANSMISSION_ARR: {key: string; label: string}[] = [
  {key: 'automatic', label: 'Automática'},
  {key: 'manual', label: 'Manual'},
  {key: 'dct', label: 'Transmisión de doble embrague'},
  {key: 'cvt', label: 'Transmisión variable continua'}
];
