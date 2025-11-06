import { db } from "@/core/database";
import { users } from "@/core/database/schema/users";
import { logger } from "@/core/logger";
import {
  emailService,
  OTPVerificationEmail,
  PasswordResetEmail
} from "@/modules/channels/infra/email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, jwt, openAPI } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  basePath: "/api/auth",
  appName: "AutoKeeper",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {provider: "pg", usePlural: true}),
  logger: {
    log: (level, message, ...args) => {
      logger.raw(`[${level}] ${message}`, ...args);
    },
  },
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
        // Get user name from database
        const [user] = await db
          .select({ name: users.name })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const userName = user?.name ?? email.split('@')[0];
        logger.info(`Sending ${type} email to ${email}`);

        // TODO: Change to send email async (using a queue or a job)
        if (type === "email-verification") {
          await emailService.send({
            to: email,
            subject: "Código de verificação - AutoKeeper",
            template: OTPVerificationEmail,
            props: { userName, otp },
          });
        } else if (type === "forget-password") {
          await emailService.send({
            to: email,
            subject: "Redefinição de senha - AutoKeeper",
            template: PasswordResetEmail,
            props: { userName, otp },
          });
        }
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 300, // 5 minutes
      allowedAttempts: 3,
      storeOTP: 'hashed',
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

// Only include these routes in OpenAPI docs
const ALLOWED_ROUTES = [
    '/sign-up/email',
    '/sign-in/email',
    '/sign-out',
    '/get-session',
    '/email-otp/verify-email',
    '/email-otp/send-verification-otp',
    '/forget-password/email-otp',
    '/email-otp/check-verification-otp',
    '/email-otp/reset-password'
]

export const OpenAPI = {
    getPaths: (prefix = '/api/auth') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                // Only include whitelisted routes
                if (!ALLOWED_ROUTES.includes(path)) continue

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

