import { Elysia, t } from "elysia";
import { authMiddleware } from "@auth/infra/http/middleware";
import { User } from "@auth/infra/database/auth-instance";
import { profileService } from "../../application/profile.service";
import { ProfileNotFoundError, ValidationError } from "../../application/errors";

export const accountsRoutes = new Elysia({ prefix: "/accounts" })
  .use(authMiddleware)

  .get("/profile", async (ctx) => {
    const user = (ctx as unknown as { user: User }).user;

    try {
      return await profileService.getProfile(user.id);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        ctx.set.status = 404;
        throw error;
      }
      throw error;
    }
  }, {
    detail: {
      summary: "Get user profile",
      description: "Retrieves the authenticated user's profile including timezone and preferences",
      tags: ["Accounts"]
    }
  })

  .patch("/profile", async (ctx) => {
    const user = (ctx as unknown as { user: User }).user;

    try {
      return await profileService.updateProfile(user.id, ctx.body);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        ctx.set.status = 404;
        throw error;
      }
      if (error instanceof ValidationError) {
        ctx.set.status = 400;
        throw error;
      }
      throw error;
    }
  }, {
    body: t.Partial(t.Object({
      name: t.String({ minLength: 1 }),
      socialName: t.Nullable(t.String()),
      timezone: t.String({ minLength: 1 }),
      preferences: t.Record(t.String(), t.Any()),
    })),
    detail: {
      summary: "Update user profile",
      description: "Updates the authenticated user's name, timezone, and/or preferences",
      tags: ["Accounts"]
    }
  });
