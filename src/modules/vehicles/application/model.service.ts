import type { ModelRepository } from "./model.repository";
import { logger } from "@/core/logger";
import {
  BrandNotFoundError,
  ModelNotFoundError,
  ValidationError,
} from "./errors";
import { isValidVehicleType } from "../domain";

export class ModelService {
  constructor(private repository: ModelRepository) {}

  async listModelsByBrand(brandId: string, filters: {
    type?: string;
    cursor?: string;
    limit?: number;
  }) {
    const brandExists = await this.repository.brandExists(brandId);
    if (!brandExists) {
      logger.warn("Brand not found for model listing", { brandId });
      throw new BrandNotFoundError();
    }

    return this.repository.findByBrand(brandId, filters);
  }

  async getModel(id: string) {
    const model = await this.repository.findById(id);
    if (!model) {
      logger.warn("Model not found", { modelId: id });
      throw new ModelNotFoundError();
    }
    return model;
  }

  async createModel(
    userId: string,
    brandId: string,
    input: { name: string; type: string }
  ) {
    if (!isValidVehicleType(input.type)) {
      logger.warn("Invalid vehicle type for model", {
        type: input.type,
        brandId,
        userId,
      });
      throw new ValidationError("Invalid vehicle type");
    }

    const brandExists = await this.repository.brandExists(brandId);
    if (!brandExists) {
      logger.warn("Brand not found for model creation", { brandId, userId });
      throw new BrandNotFoundError();
    }

    const exists = await this.repository.existsByBrandAndName(
      brandId,
      input.name
    );
    if (exists) {
      logger.warn("Model already exists for brand", {
        brandId,
        name: input.name,
        userId,
      });
      throw new ValidationError("Model already exists for this brand");
    }

    return this.repository.create({
      brandId,
      name: input.name,
      type: input.type,
      createdBy: userId,
    });
  }
}

export const modelService = new ModelService(
  // Will be injected via module index
  null as unknown as ModelRepository
);
