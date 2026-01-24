export interface BrandRepository {
  findById(id: string): Promise<BrandData | null>;
  findAll(filters: BrandFilters): Promise<PaginatedResult<BrandData>>;
  existsByNameAndType(name: string, type: string): Promise<boolean>;
  create(data: CreateBrandData): Promise<BrandData>;
}

export interface BrandData {
  id: string;
  name: string;
  type: string;
  logoUrl: string | null;
  verified: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandFilters {
  type?: string;
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
}

export interface CreateBrandData {
  name: string;
  type: string;
  logoUrl?: string;
  createdBy: string;
}
