import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { emailService } from "../email";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  appName: "AutoKeeper",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
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
})

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

