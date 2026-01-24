export interface ModelRepository {
  findById(id: string): Promise<ModelData | null>;
  findByBrand(brandId: string, filters: ModelFilters): Promise<PaginatedResult<ModelData>>;
  existsByBrandAndName(brandId: string, name: string): Promise<boolean>;
  brandExists(brandId: string): Promise<boolean>;
  create(data: CreateModelData): Promise<ModelData>;
}

export interface ModelData {
  id: string;
  brandId: string;
  name: string;
  type: string;
  verified: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelFilters {
  type?: string;
  cursor?: string;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
}

export interface CreateModelData {
  brandId: string;
  name: string;
  type: string;
  createdBy: string;
}
