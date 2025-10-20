import Elysia from "elysia";
import { auth, Session, User } from "../database/auth-instance";

export const authMiddleware = new Elysia({ name: "authMiddleware" })
  .derive(async ({ request, set }) => {
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
      if (!session) {
        set.status = 401;
        throw new Error("Unauthorized");
      }
      return {
        user: session.user as User,
        session: (session as Session).session,
      };
    } catch (error) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
  });