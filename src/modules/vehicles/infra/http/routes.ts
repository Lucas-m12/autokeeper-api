import { User } from "@auth/infra/database/auth-instance";
import { authMiddleware } from "@auth/infra/http/middleware";
import { Elysia, t } from "elysia";
import { BrandService } from "../../application/brand.service";
import { CatalogService } from "../../application/catalog.service";
import { VehicleError } from "../../application/errors";
import { ModelService } from "../../application/model.service";
import {
  brandRepository,
  catalogRepository,
  modelRepository,
} from "../database";

const brandSvc = new BrandService(brandRepository);
const modelSvc = new ModelService(modelRepository);
const catalogSvc = new CatalogService(catalogRepository);

type SetContext = {
  status: number;
};

function handleError(error: unknown, set: SetContext) {
  if (error instanceof VehicleError) {
    set.status = error.status;
  }
  throw error;
}

export const vehiclesRoutes = new Elysia({ prefix: "/vehicles" })
  .use(authMiddleware)

  // === USER VEHICLES (placeholder - TODO: implement) ===

  .get("/", () => {
    return {
      vehicles: [
        {
          id: "veh-1",
          type: "car",
          plate: "ABC1234",
          year: 2020,
          model: "Honda Civic",
          km: 45000,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    };
  }, {
    detail: {
      summary: "List vehicles",
      description:
        "Retrieves all vehicles for the authenticated user (MVP: max 1 vehicle for free plan)",
      tags: ["Vehicles"],
    },
  })
  .post(
    "/",
    ({ body }) => {
      return {
        id: "veh-" + Math.random().toString(36).substr(2, 9),
        ...body,
        createdAt: new Date().toISOString(),
      };
    },
    {
      body: t.Object({
        type: t.Union([
          t.Literal("car"),
          t.Literal("motorcycle"),
          t.Literal("truck"),
        ]),
        plate: t.Optional(t.String()),
        year: t.Number(),
        model: t.String(),
        km: t.Optional(t.Number()),
      }),
      detail: {
        summary: "Create vehicle",
        description:
          "Creates a new vehicle. MVP free plan allows only 1 vehicle per user.",
        tags: ["Vehicles"],
      },
    }
  )

  // === BRANDS ===

  .get(
    "/brands",
    ({ query }) => {
      return brandSvc.listBrands(query);
    },
    {
      query: t.Object({
        type: t.Optional(t.Union([t.Literal("CARRO"), t.Literal("MOTO")])),
        search: t.Optional(t.String()),
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "List vehicle brands",
        description:
          "Returns cursor-paginated list of vehicle brands with filtering. Use nextCursor from response to fetch next page.",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .post(
    "/brands",
    async ({ body, set, ...ctx }) => {
      try {
        const user = (ctx as unknown as { user: User }).user;
        return await brandSvc.createBrand(user.id, body);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        type: t.Union([t.Literal("CARRO"), t.Literal("MOTO")]),
        logoUrl: t.Optional(t.String({ format: "uri" })),
      }),
      detail: {
        summary: "Create vehicle brand",
        description:
          "Creates a new brand. Brand+type must be unique. User-created brands are unverified.",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .get(
    "/brands/:brandId",
    async ({ params, set }) => {
      try {
        return await brandSvc.getBrand(params.brandId);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ brandId: t.String({ format: "uuid" }) }),
      detail: {
        summary: "Get brand by ID",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )

  // === MODELS ===

  .get(
    "/brands/:brandId/models",
    async ({ params, query, set }) => {
      try {
        return await modelSvc.listModelsByBrand(params.brandId, query);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ brandId: t.String() }),
      query: t.Object({
        type: t.Optional(t.Union([t.Literal("CARRO"), t.Literal("MOTO")])),
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "List models by brand",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .post(
    "/brands/:brandId/models",
    async ({ params, body, set, ...ctx }) => {
      try {
        const user = (ctx as unknown as { user: User }).user;
        return await modelSvc.createModel(user.id, params.brandId, body);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ brandId: t.String() }),
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        type: t.Union([t.Literal("CARRO"), t.Literal("MOTO")]),
      }),
      detail: {
        summary: "Create model",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .get(
    "/models/:modelId",
    async ({ params, set }) => {
      try {
        return await modelSvc.getModel(params.modelId);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ modelId: t.String({ format: "uuid" }) }),
      detail: {
        summary: "Get model by ID",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )

  // === CATALOGS ===

  .get(
    "/models/:modelId/catalogs",
    async ({ params, query, set }) => {
      try {
        return await catalogSvc.listCatalogsByModel(params.modelId, query);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ modelId: t.String() }),
      query: t.Object({
        yearFrom: t.Optional(t.Number()),
        yearTo: t.Optional(t.Number()),
        cursor: t.Optional(t.String()),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "List catalogs by model",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .post(
    "/models/:modelId/catalogs",
    async ({ params, body, set, ...ctx }) => {
      try {
        const user = (ctx as unknown as { user: User }).user;
        return await catalogSvc.createCatalog(user.id, params.modelId, body);
      } catch (error) {
        handleError(error, set as SetContext);
      }
    },
    {
      params: t.Object({ modelId: t.String() }),
      body: t.Object({
        year: t.Number(),
        version: t.Optional(t.String()),
        engine: t.Optional(t.String()),
        fuel: t.Optional(t.String()),
        transmission: t.Optional(t.String()),
      }),
      detail: {
        summary: "Create catalog entry",
        tags: ["Vehicles", "Catalog"],
      },
    }
  )
  .get(
    "/catalogs/search",
    ({ query }) => {
      return catalogSvc.searchCatalogs(query);
    },
    {
      query: t.Object({
        brand: t.Optional(t.String()),
        model: t.Optional(t.String()),
        year: t.Optional(t.Number()),
      }),
      detail: {
        summary: "Search catalogs",
        description: "Returns top 20 results matching the search criteria",
        tags: ["Vehicles", "Catalog"],
      },
    }
  );
