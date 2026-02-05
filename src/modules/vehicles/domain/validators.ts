const LICENSE_PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const RENAVAM_REGEX = /^[0-9]{9,11}$/;
const MIN_YEAR = 1950;
const MAX_KM = 9999999;
const MAX_INTERVAL_MONTHS = 120;

export function isValidLicensePlate(licensePlate: string): boolean {
  return LICENSE_PLATE_REGEX.test(licensePlate);
}

export function isValidYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= MIN_YEAR && year <= currentYear + 1;
}

export function isValidKm(km: number | null | undefined): boolean {
  if (km === null || km === undefined) return true;
  return km >= 0 && km <= MAX_KM;
}

export function isValidRenavam(renavam: string | null | undefined): boolean {
  if (renavam === null || renavam === undefined) return true;
  return RENAVAM_REGEX.test(renavam);
}

export function isValidIntervalKm(km: number | null | undefined): boolean {
  if (km === null || km === undefined) return true;
  return km > 0;
}

export function isValidIntervalMonths(months: number | null | undefined): boolean {
  if (months === null || months === undefined) return true;
  return months > 0 && months <= MAX_INTERVAL_MONTHS;
}

export function isValidCost(cost: number | string | null | undefined): boolean {
  if (cost === null || cost === undefined) return true;
  const numericCost = typeof cost === "string" ? parseFloat(cost) : cost;
  return !isNaN(numericCost) && numericCost >= 0;
}
