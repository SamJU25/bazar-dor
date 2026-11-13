import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { resolveBaseUrl, resolveTrustedOrigins } from "@/lib/auth-helpers";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bazar-dor";

const globalForMongo = globalThis as unknown as {
  __bazarDorMongoClient?: MongoClient;
};

const client =
  globalForMongo.__bazarDorMongoClient ?? new MongoClient(MONGO_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__bazarDorMongoClient = client;
}

function resolveDbName(uri: string): string {
  try {
    const parsed = new URL(uri);
    const dbFromUri = parsed.pathname.replace(/^\/+/, "").split("/")[0];
    return dbFromUri || "bazar-dor";
  } catch {
    return "bazar-dor";
  }
}

function resolveAuthSecret(): string | undefined {
  if (process.env.BETTER_AUTH_SECRET) {
    return process.env.BETTER_AUTH_SECRET;
  }
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (process.env.NODE_ENV !== "production" || isBuildPhase) {
    return "dev-build-only-secret-change-in-production-32chars";
  }
  throw new Error(
    "BETTER_AUTH_SECRET is required in production. Set it in your environment variables.",
  );
}

function buildSocialProviders() {
  const providers: NonNullable<
    Parameters<typeof betterAuth>[0]["socialProviders"]
  > = {};

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.facebook = {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    };
  }

  return providers;
}

const db = client.db(resolveDbName(MONGO_URI));
const authEnv = {
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
};
const baseURL = resolveBaseUrl(authEnv);
const trustedOrigins = resolveTrustedOrigins(authEnv);

export const auth = betterAuth({
  secret: resolveAuthSecret(),
  baseURL,
  trustedOrigins: trustedOrigins.length > 0 ? trustedOrigins : undefined,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  onAPIError: {
    errorURL: "/signin",
  },
  socialProviders: buildSocialProviders(),
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [nextCookies()],
});

/** Safely reads the active BetterAuth session from incoming request headers. */
export async function getServerSession(requestHeaders: Headers) {
  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}
