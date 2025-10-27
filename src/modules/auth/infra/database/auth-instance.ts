import { db } from "@/core/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt } from "better-auth/plugins";
import { emailService } from "../email";

export const auth = betterAuth({
  appName: "AutoKeeper",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {provider: "pg", usePlural: true}),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }) => {
      await emailService.sendPasswordReset({
        to: user.email,
        resetUrl: url,
        userName: user.name,
      });
    },
    resetPasswordTokenExpiresIn: 10 * 60, // 10 minutes
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  plugins: [
    jwt({
      jwt: { expirationTime: 60 * 60 * 24 * 7 }, // 7 days
    })
  ],
  advanced: {
    database: {
      generateId: false,
    },
  }
})

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

