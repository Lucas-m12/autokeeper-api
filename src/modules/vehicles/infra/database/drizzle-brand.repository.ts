import { db } from "@/core/database";
import { logger } from "@/core/logger";
import { vehicleBrands } from "@/core/database/schema";
import { eq, like, and, desc, gt } from "drizzle-orm";
import type {
  BrandRepository,
  BrandData,
  BrandFilters,
  CreateBrandData,
  PaginatedResult,
} from "../../application/brand.repository";

export class DrizzleBrandRepository implements BrandRepository {
  async findById(id: string): Promise<BrandData | null> {
    const [brand] = await db.select().from(vehicleBrands).where(eq(vehicleBrands.id, id));
    return brand ?? null;
  }

  async findAll(filters: BrandFilters): Promise<PaginatedResult<BrandData>> {
    const { type, search, cursor, limit = 20 } = filters;

    const conditions = [];
    if (type) conditions.push(eq(vehicleBrands.type, type));
    if (search) conditions.push(like(vehicleBrands.name, `%${search}%`));
    if (cursor) conditions.push(gt(vehicleBrands.id, cursor));

    const brands = await db
      .select()
      .from(vehicleBrands)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(vehicleBrands.id)
      .limit(limit + 1);

    const hasMore = brands.length > limit;
    const data = hasMore ? brands.slice(0, limit) : brands;

    return {
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
    };
  }

  async existsByNameAndType(name: string, type: string): Promise<boolean> {
    const [brand] = await db
      .select({ id: vehicleBrands.id })
      .from(vehicleBrands)
      .where(and(eq(vehicleBrands.name, name), eq(vehicleBrands.type, type)));
    return !!brand;
  }

  async create(data: CreateBrandData): Promise<BrandData> {
    const [brand] = await db
      .insert(vehicleBrands)
      .values({
        name: data.name,
        type: data.type,
        logoUrl: data.logoUrl ?? null,
        createdBy: data.createdBy,
        verified: false,
      })
      .returning();

    logger.info("Brand created", {
      brandId: brand.id,
      name: brand.name,
      type: brand.type,
      userId: data.createdBy,
    });

    return brand;
  }
}

export const brandRepository = new DrizzleBrandRepository();
