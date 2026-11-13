import { createAuthClient } from "better-auth/react";

const clientBaseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BETTER_AUTH_URL || undefined;

const authClient = createAuthClient({
  baseURL: clientBaseURL,
});

export const { signIn, signUp, signOut, updateUser, useSession } = authClient;
