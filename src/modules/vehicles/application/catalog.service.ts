import type { CatalogRepository } from "./catalog.repository";
import { logger } from "@/core/logger";
import { ModelNotFoundError, ValidationError } from "./errors";

export class CatalogService {
  constructor(private repository: CatalogRepository) {}

  async listCatalogsByModel(modelId: string, filters: {
    yearFrom?: number;
    yearTo?: number;
    cursor?: string;
    limit?: number;
  }) {
    const modelExists = await this.repository.modelExists(modelId);
    if (!modelExists) {
      logger.warn("Model not found for catalog listing", { modelId });
      throw new ModelNotFoundError();
    }

    return this.repository.findByModel(modelId, filters);
  }

  async createCatalog(
    userId: string,
    modelId: string,
    input: {
      year: number;
      version?: string;
      engine?: string;
      fuel?: string;
      transmission?: string;
    }
  ) {
    const modelExists = await this.repository.modelExists(modelId);
    if (!modelExists) {
      logger.warn("Model not found for catalog creation", { modelId, userId });
      throw new ModelNotFoundError();
    }

    const currentYear = new Date().getFullYear();
    if (input.year < 1950 || input.year > currentYear + 1) {
      logger.warn("Invalid year for catalog", {
        year: input.year,
        modelId,
        userId,
      });
      throw new ValidationError(
        `Year must be between 1950 and ${currentYear + 1}`
      );
    }

    const exists = await this.repository.existsByModelYearVersion(
      modelId,
      input.year,
      input.version ?? null
    );
    if (exists) {
      logger.warn("Catalog entry already exists", {
        modelId,
        year: input.year,
        version: input.version,
        userId,
      });
      throw new ValidationError(
        "Catalog entry already exists for this model, year, and version"
      );
    }

    return this.repository.create({
      modelId,
      year: input.year,
      version: input.version,
      engine: input.engine,
      fuel: input.fuel,
      transmission: input.transmission,
      createdBy: userId,
    });
  }

  async searchCatalogs(query: {
    brand?: string;
    model?: string;
    year?: number;
  }) {
    return this.repository.search(query);
  }
}

export const catalogService = new CatalogService(
  // Will be injected via module index
  null as unknown as CatalogRepository
);
