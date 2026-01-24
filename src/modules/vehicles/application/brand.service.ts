import type { BrandRepository } from "./brand.repository";
import { brandRepository } from "../infra/database/drizzle-brand.repository";
import { logger } from "@/core/logger";
import {
  BrandNotFoundError,
  BrandAlreadyExistsError,
  ValidationError,
} from "./errors";
import { isValidVehicleType } from "../domain";

export class BrandService {
  constructor(private repository: BrandRepository = brandRepository) {}

  async listBrands(filters: {
    type?: string;
    search?: string;
    cursor?: string;
    limit?: number;
  }) {
    return this.repository.findAll({
      type: filters.type,
      search: filters.search,
      cursor: filters.cursor,
      limit: filters.limit ?? 20,
    });
  }

  async getBrand(id: string) {
    const brand = await this.repository.findById(id);
    if (!brand) {
      logger.warn("Brand not found", { brandId: id });
      throw new BrandNotFoundError();
    }
    return brand;
  }

  async createBrand(
    userId: string,
    input: { name: string; type: string; logoUrl?: string }
  ) {
    if (!isValidVehicleType(input.type)) {
      logger.warn("Invalid vehicle type", { type: input.type, userId });
      throw new ValidationError("Invalid vehicle type. Must be CARRO or MOTO.");
    }

    const exists = await this.repository.existsByNameAndType(
      input.name,
      input.type
    );
    if (exists) {
      logger.warn("Brand already exists", {
        name: input.name,
        type: input.type,
        userId,
      });
      throw new BrandAlreadyExistsError();
    }

    return this.repository.create({
      name: input.name,
      type: input.type,
      logoUrl: input.logoUrl,
      createdBy: userId,
    });
  }
}

export const brandService = new BrandService();
