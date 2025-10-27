import { authMiddleware } from "@auth/infra/http/middleware";
import { Elysia, t } from "elysia";

export const vehiclesRoutes = new Elysia({ prefix: "/vehicles" })
  .use(authMiddleware)
  .get("/", () => {
    // TODO: Implement actual vehicle listing with user filtering and pagination
    // This is a placeholder implementation

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
      description: "Retrieves all vehicles for the authenticated user (MVP: max 1 vehicle for free plan)",
      tags: ["Vehicles"]
    }
  })
  .post("/", ({ body }) => {
    // TODO: Implement actual vehicle creation with plan limit validation
    // This is a placeholder implementation
    return {
      id: "veh-" + Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString(),
    };
  }, {
    body: t.Object({
      type: t.Union([
        t.Literal("car"),
        t.Literal("motorcycle"),
        t.Literal("truck")
      ]),
      plate: t.Optional(t.String()),
      year: t.Number(),
      model: t.String(),
      km: t.Optional(t.Number()),
    }),
    detail: {
      summary: "Create vehicle",
      description: "Creates a new vehicle. MVP free plan allows only 1 vehicle per user.",
      tags: ["Vehicles"]
    }
  });
