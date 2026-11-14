import { cache } from "react";
import { headers } from "next/headers";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { resolveBaseUrl, resolveTrustedOrigins } from "@/lib/auth-helpers";

function resolveMongoUri(): string {
  const configured = process.env.MONGO_URI?.trim();
  if (configured) return configured;
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (process.env.NODE_ENV !== "production" || isBuildPhase) {
    return "mongodb://127.0.0.1:27017/bazar-dor";
  }
  throw new Error(
    "MONGO_URI is required in production. Set it in your environment variables.",
  );
}

const MONGO_URI = resolveMongoUri();

const globalForMongo = globalThis as unknown as {
  __bazarDorMongoClient?: MongoClient;
};

const client =
  globalForMongo.__bazarDorMongoClient ??
  new MongoClient(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    maxPoolSize: 10,
  });

globalForMongo.__bazarDorMongoClient = client;

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
  const configured = process.env.BETTER_AUTH_SECRET?.trim();
  if (configured) {
    if (process.env.NODE_ENV === "production" && configured.length < 32) {
      console.warn(
        "BETTER_AUTH_SECRET is shorter than 32 characters; rotate to >= 32 bytes for stronger signing.",
      );
    }
    return configured;
  }
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (process.env.NODE_ENV !== "production" || isBuildPhase) {
    return "dev-build-only-secret-change-in-production-32chars";
  }
  throw new Error(
    "BETTER_AUTH_SECRET is required in production. Set it in your environment variables.",
  );
}

const CONTROL_CHAR_REGEX = /[\u0000-\u001f\u007f-\u009f]/;

function sanitizeUserName(raw: unknown, allowFallback: boolean): string {
  const trimmed =
    typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "";
  if (CONTROL_CHAR_REGEX.test(trimmed)) {
    throw new APIError("BAD_REQUEST", {
      message: "নামে অনুমোদিত নয় এমন অক্ষর রয়েছে",
    });
  }
  if (!trimmed) {
    if (allowFallback) return "ব্যবহারকারী";
    throw new APIError("BAD_REQUEST", {
      message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
    });
  }
  if (trimmed.length > 80) {
    if (allowFallback) return trimmed.slice(0, 80);
    throw new APIError("BAD_REQUEST", {
      message: "নাম সর্বোচ্চ ৮০ অক্ষরের মধ্যে হতে হবে",
    });
  }
  if (!allowFallback && trimmed.length < 2) {
    throw new APIError("BAD_REQUEST", {
      message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
    });
  }
  return trimmed;
}

function sanitizeAvatarUrl(raw: unknown): string | null | undefined {
  if (raw === undefined || raw === null) return raw;
  if (typeof raw !== "string") {
    throw new APIError("BAD_REQUEST", {
      message: "অবৈধ প্রোফাইল ছবির লিংক",
    });
  }
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.length > 2048 || CONTROL_CHAR_REGEX.test(trimmed)) {
    throw new APIError("BAD_REQUEST", {
      message: "অবৈধ প্রোফাইল ছবির লিংক",
    });
  }
  try {
    const parsed = new URL(trimmed);
    const isLocalHttp =
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
    if (parsed.protocol !== "https:" && !isLocalHttp) {
      throw new APIError("BAD_REQUEST", {
        message: "ছবির লিংকটি অবশ্যই https:// দিয়ে শুরু হতে হবে",
      });
    }
    return parsed.toString();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("BAD_REQUEST", {
      message: "সঠিক URL ফরম্যাটে প্রোফাইল ছবির লিংক দিন",
    });
  }
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
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
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
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 300, max: 5 },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    ipAddress: {
      ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            name: sanitizeUserName(user.name, true),
            image:
              user.image !== undefined
                ? sanitizeAvatarUrl(user.image)
                : user.image,
          },
        }),
      },
      update: {
        before: async (user) => {
          const nextData = { ...user };
          if (user.name !== undefined) {
            nextData.name = sanitizeUserName(user.name, false);
          }
          if (user.image !== undefined) {
            nextData.image = sanitizeAvatarUrl(user.image);
          }
          return { data: nextData };
        },
      },
    },
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

/** Per-request memoized session lookup for Server Components and generateMetadata. */
export const getCachedServerSession = cache(async () =>
  getServerSession(await headers()),
);

/** Pings the auth database with a short timeout for operational health checks. */
export async function checkAuthDatabaseHealth(): Promise<boolean> {
  try {
    await Promise.race([
      db.command({ ping: 1 }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database ping timeout")), 3000),
      ),
    ]);
    return true;
  } catch {
    return false;
  }
}
