export const VEHICLE_STATUS = {
  ACTIVE: "ACTIVE",
  SOLD: "SOLD",
  DELETED: "DELETED",
} as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export function isValidVehicleStatus(value: string): value is VehicleStatus {
  return Object.values(VEHICLE_STATUS).includes(value as VehicleStatus);
}

export const DEFAULT_VEHICLE_STATUS: VehicleStatus = VEHICLE_STATUS.ACTIVE;
