export const FUEL_TYPES = {
  GASOLINA: "GASOLINA",
  ETANOL: "ETANOL",
  FLEX: "FLEX",
  DIESEL: "DIESEL",
  ELETRICO: "ELETRICO",
  HIBRIDO: "HIBRIDO",
} as const;

export type FuelType = (typeof FUEL_TYPES)[keyof typeof FUEL_TYPES];

export function isValidFuelType(value: string): value is FuelType {
  return Object.values(FUEL_TYPES).includes(value as FuelType);
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  GASOLINA: "Gasolina",
  ETANOL: "Etanol",
  FLEX: "Flex",
  DIESEL: "Diesel",
  ELETRICO: "Elétrico",
  HIBRIDO: "Híbrido",
};
