export const TRANSMISSION_TYPES = {
  MANUAL: "MANUAL",
  AUTOMATICO: "AUTOMATICO",
  CVT: "CVT",
  AUTOMATIZADO: "AUTOMATIZADO",
} as const;

export type TransmissionType = (typeof TRANSMISSION_TYPES)[keyof typeof TRANSMISSION_TYPES];

export function isValidTransmissionType(value: string): value is TransmissionType {
  return Object.values(TRANSMISSION_TYPES).includes(value as TransmissionType);
}

export const TRANSMISSION_TYPE_LABELS: Record<TransmissionType, string> = {
  MANUAL: "Manual",
  AUTOMATICO: "Automático",
  CVT: "CVT",
  AUTOMATIZADO: "Automatizado",
};
