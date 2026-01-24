import { db } from "@/core/database";
import { logger } from "@/core/logger";
import { vehicleModels, vehicleBrands } from "@/core/database/schema";
import { eq, and, gt } from "drizzle-orm";
import type {
  ModelRepository,
  ModelData,
  ModelFilters,
  CreateModelData,
  PaginatedResult,
} from "../../application/model.repository";

export class DrizzleModelRepository implements ModelRepository {
  async findById(id: string): Promise<ModelData | null> {
    const [model] = await db.select().from(vehicleModels).where(eq(vehicleModels.id, id));
    return model ?? null;
  }

  async findByBrand(brandId: string, filters: ModelFilters): Promise<PaginatedResult<ModelData>> {
    const { type, cursor, limit = 20 } = filters;

    const conditions = [eq(vehicleModels.brandId, brandId)];
    if (type) conditions.push(eq(vehicleModels.type, type));
    if (cursor) conditions.push(gt(vehicleModels.id, cursor));

    const models = await db
      .select()
      .from(vehicleModels)
      .where(and(...conditions))
      .orderBy(vehicleModels.id)
      .limit(limit + 1);

    const hasMore = models.length > limit;
    const data = hasMore ? models.slice(0, limit) : models;

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
    };
  }

  async existsByBrandAndName(brandId: string, name: string): Promise<boolean> {
    const [model] = await db
      .select({ id: vehicleModels.id })
      .from(vehicleModels)
      .where(and(eq(vehicleModels.brandId, brandId), eq(vehicleModels.name, name)));
    return !!model;
  }

  async brandExists(brandId: string): Promise<boolean> {
    const [brand] = await db
      .select({ id: vehicleBrands.id })
      .from(vehicleBrands)
      .where(eq(vehicleBrands.id, brandId));
    return !!brand;
  }

  async create(data: CreateModelData): Promise<ModelData> {
    const [model] = await db
      .insert(vehicleModels)
      .values({
        brandId: data.brandId,
        name: data.name,
        type: data.type,
        createdBy: data.createdBy,
        verified: false,
      })
      .returning();

    logger.info("Model created", {
      modelId: model.id,
      brandId: data.brandId,
      name: model.name,
      type: model.type,
      userId: data.createdBy,
    });

    return model;
  }
}

export const modelRepository = new DrizzleModelRepository();
