export interface CatalogRepository {
  findById(id: string): Promise<CatalogData | null>;
  findByModel(modelId: string, filters: CatalogFilters): Promise<PaginatedResult<CatalogData>>;
  modelExists(modelId: string): Promise<boolean>;
  existsByModelYearVersion(
    modelId: string,
    year: number,
    version: string | null
  ): Promise<boolean>;
  create(data: CreateCatalogData): Promise<CatalogData>;
  search(query: CatalogSearchQuery): Promise<CatalogWithHierarchy[]>;
}

export interface CatalogData {
  id: string;
  modelId: string;
  year: number;
  version: string | null;
  engine: string | null;
  fuel: string | null;
  transmission: string | null;
  source: string;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CatalogFilters {
  yearFrom?: number;
  yearTo?: number;
  cursor?: string;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
}

export interface CreateCatalogData {
  modelId: string;
  year: number;
  version?: string;
  engine?: string;
  fuel?: string;
  transmission?: string;
  createdBy: string;
}

export interface CatalogSearchQuery {
  brand?: string;
  model?: string;
  year?: number;
}

export interface CatalogWithHierarchy extends CatalogData {
  modelName: string;
  brandName: string;
}
