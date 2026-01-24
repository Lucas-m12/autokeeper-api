import { db } from "@/core/database";
import { logger } from "@/core/logger";
import {
  vehicleCatalogs,
  vehicleModels,
  vehicleBrands,
} from "@/core/database/schema";
import { eq, and, gt, gte, lte, or, like, desc } from "drizzle-orm";
import type {
  CatalogRepository,
  CatalogData,
  CatalogFilters,
  CreateCatalogData,
  PaginatedResult,
  CatalogSearchQuery,
  CatalogWithHierarchy,
} from "../../application/catalog.repository";

export class DrizzleCatalogRepository implements CatalogRepository {
  async findById(id: string): Promise<CatalogData | null> {
    const [catalog] = await db
      .select()
      .from(vehicleCatalogs)
      .where(eq(vehicleCatalogs.id, id));
    return catalog ?? null;
  }

  async findByModel(
    modelId: string,
    filters: CatalogFilters
  ): Promise<PaginatedResult<CatalogData>> {
    const { yearFrom, yearTo, cursor, limit = 20 } = filters;

    const conditions = [eq(vehicleCatalogs.modelId, modelId)];
    if (yearFrom) conditions.push(gte(vehicleCatalogs.year, yearFrom));
    if (yearTo) conditions.push(lte(vehicleCatalogs.year, yearTo));
    if (cursor) conditions.push(gt(vehicleCatalogs.id, cursor));

    const catalogs = await db
      .select()
      .from(vehicleCatalogs)
      .where(and(...conditions))
      .orderBy(vehicleCatalogs.id)
      .limit(limit + 1);

    const hasMore = catalogs.length > limit;
    const data = hasMore ? catalogs.slice(0, limit) : catalogs;

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
    };
  }

  async modelExists(modelId: string): Promise<boolean> {
    const [model] = await db
      .select({ id: vehicleModels.id })
      .from(vehicleModels)
      .where(eq(vehicleModels.id, modelId));
    return !!model;
  }

  async existsByModelYearVersion(
    modelId: string,
    year: number,
    version: string | null
  ): Promise<boolean> {
    const conditions = [
      eq(vehicleCatalogs.modelId, modelId),
      eq(vehicleCatalogs.year, year),
    ];

    if (version === null) {
      conditions.push(eq(vehicleCatalogs.version, null));
    } else {
      conditions.push(eq(vehicleCatalogs.version, version));
    }

    const [catalog] = await db
      .select({ id: vehicleCatalogs.id })
      .from(vehicleCatalogs)
      .where(and(...conditions));
    return !!catalog;
  }

  async create(data: CreateCatalogData): Promise<CatalogData> {
    const [catalog] = await db
      .insert(vehicleCatalogs)
      .values({
        modelId: data.modelId,
        year: data.year,
        version: data.version ?? null,
        engine: data.engine ?? null,
        fuel: data.fuel ?? null,
        transmission: data.transmission ?? null,
        createdBy: data.createdBy,
        source: "MANUAL",
      })
      .returning();

    logger.info("Catalog entry created", {
      catalogId: catalog.id,
      modelId: data.modelId,
      year: catalog.year,
      version: catalog.version,
      userId: data.createdBy,
    });

    return catalog;
  }

  async search(query: CatalogSearchQuery): Promise<CatalogWithHierarchy[]> {
    const conditions = [];

    if (query.brand) {
      conditions.push(like(vehicleBrands.name, `%${query.brand}%`));
    }
    if (query.model) {
      conditions.push(like(vehicleModels.name, `%${query.model}%`));
    }
    if (query.year) {
      conditions.push(eq(vehicleCatalogs.year, query.year));
    }

    const results = await db
      .select({
        id: vehicleCatalogs.id,
        modelId: vehicleCatalogs.modelId,
        year: vehicleCatalogs.year,
        version: vehicleCatalogs.version,
        engine: vehicleCatalogs.engine,
        fuel: vehicleCatalogs.fuel,
        transmission: vehicleCatalogs.transmission,
        source: vehicleCatalogs.source,
        createdBy: vehicleCatalogs.createdBy,
        createdAt: vehicleCatalogs.createdAt,
        updatedAt: vehicleCatalogs.updatedAt,
        modelName: vehicleModels.name,
        brandName: vehicleBrands.name,
      })
      .from(vehicleCatalogs)
      .innerJoin(vehicleModels, eq(vehicleCatalogs.modelId, vehicleModels.id))
      .innerJoin(vehicleBrands, eq(vehicleModels.brandId, vehicleBrands.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(vehicleCatalogs.year))
      .limit(20);

    return results;
  }
}

export const catalogRepository = new DrizzleCatalogRepository();
