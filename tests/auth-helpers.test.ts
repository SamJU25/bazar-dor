import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildAuthUrl,
  formatAuthActionError,
  formatOAuthErrorMessage,
  getSafeCallbackUrl,
  getUserInitials,
  resolveBaseUrl,
  resolveTrustedOrigins,
} from "../src/lib/auth-helpers.ts";

describe("getSafeCallbackUrl", () => {
  it("keeps valid relative product and profile paths", () => {
    assert.equal(getSafeCallbackUrl("/product/alu"), "/product/alu");
    assert.equal(
      getSafeCallbackUrl("/profile/update-profile?saved=1"),
      "/profile/update-profile?saved=1",
    );
  });

  it("rejects external, protocol-relative, backslash, encoded, control-char, and empty URLs", () => {
    assert.equal(getSafeCallbackUrl(null), "/");
    assert.equal(getSafeCallbackUrl(undefined), "/");
    assert.equal(getSafeCallbackUrl(""), "/");
    assert.equal(getSafeCallbackUrl("   "), "/");
    assert.equal(getSafeCallbackUrl("https://evil.com/phish"), "/");
    assert.equal(getSafeCallbackUrl("http://localhost:9999"), "/");
    assert.equal(getSafeCallbackUrl("//evil.com"), "/");
    assert.equal(getSafeCallbackUrl("///evil.com"), "/");
    assert.equal(getSafeCallbackUrl("/\\evil.com"), "/");
    assert.equal(getSafeCallbackUrl("/%2f/evil.com"), "/");
    assert.equal(getSafeCallbackUrl("/%5cevil.com"), "/");
    assert.equal(getSafeCallbackUrl("/product\r\nSet-Cookie"), "/");
    assert.equal(getSafeCallbackUrl("javascript:alert(1)"), "/");
  });
});

describe("buildAuthUrl", () => {
  it("omits callbackUrl when target is root", () => {
    assert.equal(buildAuthUrl("/signin", "/"), "/signin");
    assert.equal(buildAuthUrl("/signup", "/"), "/signup");
  });

  it("preserves safe callbackUrl and optional reason", () => {
    assert.equal(
      buildAuthUrl("/signup", "/product/peyaj"),
      "/signup?callbackUrl=%2Fproduct%2Fpeyaj",
    );
    assert.equal(
      buildAuthUrl("/signin", "/product/peyaj", "auth_required"),
      "/signin?reason=auth_required&callbackUrl=%2Fproduct%2Fpeyaj",
    );
  });

  it("strips unsafe callbackUrl before building URL", () => {
    assert.equal(buildAuthUrl("/signin", "https://evil.com"), "/signin");
  });
});

describe("getUserInitials", () => {
  it("extracts up to two uppercase initials and falls back to BD", () => {
    assert.equal(getUserInitials("Rahim Uddin"), "RU");
    assert.equal(getUserInitials("  sam  "), "S");
    assert.equal(getUserInitials("রহিম উদ্দিন"), "রউ");
    assert.equal(getUserInitials(""), "BD");
    assert.equal(getUserInitials(null), "BD");
  });
});

describe("resolveBaseUrl & resolveTrustedOrigins", () => {
  it("prefers BETTER_AUTH_URL, then VERCEL_PROJECT_PRODUCTION_URL, then VERCEL_URL", () => {
    assert.equal(
      resolveBaseUrl({
        BETTER_AUTH_URL: "https://bazar-dor.example.com/",
        VERCEL_PROJECT_PRODUCTION_URL: "bazar-dor.vercel.app",
      }),
      "https://bazar-dor.example.com",
    );
    assert.equal(
      resolveBaseUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "bazar-dor-sable-six.vercel.app",
      }),
      "https://bazar-dor-sable-six.vercel.app",
    );
    assert.equal(
      resolveBaseUrl({
        VERCEL_URL: "bazar-dor-git-main.vercel.app",
      }),
      "https://bazar-dor-git-main.vercel.app",
    );
    assert.equal(resolveBaseUrl({}), undefined);
  });

  it("builds a deduplicated list of trusted origins", () => {
    const origins = resolveTrustedOrigins({
      BETTER_AUTH_URL: "https://bazar-dor-sable-six.vercel.app/",
      NEXT_PUBLIC_BETTER_AUTH_URL: "https://bazar-dor-sable-six.vercel.app",
      VERCEL_BRANCH_URL: "bazar-dor-git-feature.vercel.app",
      VERCEL_URL: "bazar-dor-preview.vercel.app",
      VERCEL_PROJECT_PRODUCTION_URL: "bazar-dor-sable-six.vercel.app",
    });

    assert.deepEqual(origins, [
      "https://bazar-dor-sable-six.vercel.app",
      "https://bazar-dor-git-feature.vercel.app",
      "https://bazar-dor-preview.vercel.app",
    ]);
  });
});

describe("formatOAuthErrorMessage & formatAuthActionError", () => {
  it("returns null for empty values, maps known codes, and blocks reflected prose", () => {
    assert.equal(formatOAuthErrorMessage(null), null);
    assert.equal(formatOAuthErrorMessage("   "), null);
    assert.match(
      formatOAuthErrorMessage("invalid_code") ?? "",
      /invalid_code/,
    );
    assert.match(
      formatOAuthErrorMessage("custom_error_code") ?? "",
      /custom_error_code/,
    );
    const unsafe = formatOAuthErrorMessage("Click evil.com now") ?? "";
    assert.doesNotMatch(unsafe, /evil\.com/);
  });

  it("localizes common BetterAuth action errors cleanly", () => {
    assert.equal(
      formatAuthActionError("Invalid email or password", "fallback"),
      "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
    );
    assert.equal(
      formatAuthActionError("User already exists", "fallback"),
      "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি করা হয়েছে",
    );
    assert.equal(
      formatAuthActionError("Unknown internal error", "ব্যর্থ হয়েছে"),
      "ব্যর্থ হয়েছে",
    );
  });
});
