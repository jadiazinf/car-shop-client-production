export enum VehicleType {
  MOTORBIKE = "motorbike",
  CAR = "car",
  VAN = "van",
  TRUCK = "truck",
}

export const VEHICLE_TYPES_ARR: { key: string; label: string }[] = [
  { key: "motorbike", label: "Moto" },
  { key: "car", label: "Carro" },
  { key: "van", label: "Camioneta" },
  { key: "truck", label: "Camión" },
];

export enum EngineType {
  DIESEL = "diesel",
  GAS = "gas",
  GASOLINE = "gasoline",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export const ENGINE_TYPE_ARR: { key: string; label: string }[] = [
  { key: "diesel", label: "Diesel" },
  { key: "gas", label: "Gas" },
  { key: "gasoline", label: "Gasolina" },
  { key: "hybrid", label: "Híbrido" },
];

export enum VehicleTransmission {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
  DCT = "dct",
  CVT = "cvt",
}

export const VEHICLE_TRANSMISSION_ARR: { key: string; label: string }[] = [
  { key: "automatic", label: "Automática" },
  { key: "manual", label: "Manual" },
  { key: "dct", label: "Transmisión de doble embrague" },
  { key: "cvt", label: "Transmisión variable continua" },
];
