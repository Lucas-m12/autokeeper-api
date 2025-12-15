import { db } from "@/core/database";
import { users } from "@/core/database/schema/users";
import { usersProfile } from "@/core/database/schema/users-profile";
import { logger } from "@/core/logger";
import { emailQueueService } from "@/modules/channels/infra/email/email-queue.service";
import { expo } from "@better-auth/expo";
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
  user: {
    additionalFields: {
      socialName: {
        type: "string",
        required: false,
        input: true,
      },
      planType: {
        type: "string",
        required: true,
        defaultValue: "free",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            logger.info(`Creating profile for user ${user.id}`);

            await db.insert(usersProfile).values({
              userId: user.id,
              timezone: "America/Sao_Paulo",
              preferences: {},
            });

            logger.info(`Profile created successfully for user ${user.id}`);
          } catch (error) {
            // Log error but don't throw - allow user creation to succeed
            logger.error(
              `Failed to create profile for user ${user.id}: ${error instanceof Error ? error.message : String(error)}`
            );
          }
        },
      },
    },
  },
  logger: {
    log: (level, message, ...args) => {
      logger.raw(`[${level}] ${message}`, ...args);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET_KEY as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
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
          .select({
            name: users.name,
            socialName: users.socialName
          })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const userName = user?.socialName ?? user?.name ?? email.split('@')[0];
        logger.info(`Queueing ${type} email to ${email}`);

        if (type === "email-verification") {
          await emailQueueService.queueEmail({
            to: email,
            subject: "Código de verificação - AutoKeeper",
            templateName: "otp-verification",
            props: { userName, otp },
          });
        } else if (type === "forget-password") {
          await emailQueueService.queueEmail({
            to: email,
            subject: "Redefinição de senha - AutoKeeper",
            templateName: "password-reset",
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
    expo()
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
  trustedOrigins: [
    'autokeeper://*',
    'exp://192.168.3.32:8081',
    'exp://*',
  ]
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

// Only include these routes in OpenAPI docs
const ALLOWED_ROUTES = [
    '/sign-up/email',
    '/sign-in/email',
    '/sign-in/social',
    '/callback/google',
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

