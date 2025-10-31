import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { accountsRoutes } from "../modules/accounts/infra/http/routes";
import { auth, OpenAPI } from "../modules/auth/infra/database/auth-instance";
import { vehiclesRoutes } from "../modules/vehicles/infra/http/routes";

export const app = new Elysia({ prefix: "/api" })
  .get("/", () => ({
    name: "AutoKeeper API",
    version: "1.0.0",
    tagline: "Mantenha seus veículos em dia.",
  }))
  .use(openapi({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
    }
  }))
  .all("/auth/*", ({ request }) => auth.handler(request))
  .use(accountsRoutes)
  .use(vehiclesRoutes)
  .listen(process.env.APP_PORT || 3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
