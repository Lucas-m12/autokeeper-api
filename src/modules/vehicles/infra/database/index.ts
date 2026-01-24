import { DrizzleBrandRepository } from "./drizzle-brand.repository";
import { DrizzleModelRepository } from "./drizzle-model.repository";
import { DrizzleCatalogRepository } from "./drizzle-catalog.repository";

export const brandRepository = new DrizzleBrandRepository();
export const modelRepository = new DrizzleModelRepository();
export const catalogRepository = new DrizzleCatalogRepository();

export { DrizzleBrandRepository } from "./drizzle-brand.repository";
export { DrizzleModelRepository } from "./drizzle-model.repository";
export { DrizzleCatalogRepository } from "./drizzle-catalog.repository";
