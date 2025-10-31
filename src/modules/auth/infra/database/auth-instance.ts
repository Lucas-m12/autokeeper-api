import { db } from "@/core/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, jwt, openAPI } from "better-auth/plugins";
import { emailService } from "../email";

export const auth = betterAuth({
  basePath: "/api/auth",
  appName: "AutoKeeper",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {provider: "pg", usePlural: true}),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: false, // User must verify email before signing in
    // Password reset now uses OTP instead of URL-based reset
    // sendResetPassword is disabled in favor of emailOTP plugin
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  plugins: [
    jwt({
      jwt: { expirationTime: 60 * 60 * 24 * 7 }, // 7 days
    }),
    openAPI(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        // Get user name from the email (basic fallback)
        const userName = email.split('@')[0];

        if (type === "email-verification") {
          await emailService.sendEmailVerificationOTP({
            to: email,
            otp,
            userName,
          });
        } else if (type === "forget-password") {
          await emailService.sendPasswordResetOTP({
            to: email,
            otp,
            userName,
          });
        }
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
    }),
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/api/auth') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]

                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

