import { Elysia } from "elysia";
import { accountsRoutes } from "../modules/accounts/infra/http/routes";
import { auth } from "../modules/auth/infra/database/auth-instance";
import { vehiclesRoutes } from "../modules/vehicles/infra/http/routes";

export const app = new Elysia({ prefix: "/api" })
  .get("/", () => ({
    name: "AutoKeeper API",
    version: "1.0.0",
    tagline: "Mantenha seus veículos em dia.",
  }))
  .all("/auth/*", ({ request }) => auth.handler(request))
  .use(accountsRoutes)
  .use(vehiclesRoutes)
  .listen(process.env.APP_PORT || 3333);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
