export const VEHICLE_TYPES = {
  CARRO: "CARRO",
  MOTO: "MOTO",
} as const;

export type VehicleType = (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES];

export function isValidVehicleType(value: string): value is VehicleType {
  return Object.values(VEHICLE_TYPES).includes(value as VehicleType);
}

export const DEFAULT_VEHICLE_TYPE: VehicleType = VEHICLE_TYPES.CARRO;
