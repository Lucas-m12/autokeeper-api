export const CATALOG_SOURCES = {
  AI: "AI",
  MANUAL: "MANUAL",
  VERIFIED: "VERIFIED",
} as const;

export type CatalogSource = (typeof CATALOG_SOURCES)[keyof typeof CATALOG_SOURCES];

export function isValidCatalogSource(value: string): value is CatalogSource {
  return Object.values(CATALOG_SOURCES).includes(value as CatalogSource);
}

export const DEFAULT_CATALOG_SOURCE: CatalogSource = CATALOG_SOURCES.MANUAL;
