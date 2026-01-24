export class VehicleError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
  }
}

export class BrandNotFoundError extends VehicleError {
  constructor() {
    super("BRAND_NOT_FOUND", "Brand not found", 404);
  }
}

export class ModelNotFoundError extends VehicleError {
  constructor() {
    super("MODEL_NOT_FOUND", "Model not found", 404);
  }
}

export class CatalogNotFoundError extends VehicleError {
  constructor() {
    super("CATALOG_NOT_FOUND", "Catalog entry not found", 404);
  }
}

export class BrandAlreadyExistsError extends VehicleError {
  constructor() {
    super("BRAND_EXISTS", "Brand already exists with this name and type", 409);
  }
}

export class ValidationError extends VehicleError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message, 400);
  }
}
