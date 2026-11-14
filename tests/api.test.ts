import { describe, it, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  CatalogUnavailableError,
  getCategories,
  getCategoryBySlug,
  getCategoryPageData,
  getProductBySlugOrId,
  getProductBySlugOrIdStrict,
  getProducts,
} from "../src/lib/api.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("api helpers", () => {
  it("falls back to secondary API URL when primary returns an error payload", async () => {
    const calledUrls: string[] = [];
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = String(input);
      calledUrls.push(url);
      if (url.includes("openapi.programming-hero.com")) {
        return new Response(JSON.stringify({ error: "Upstream unavailable" }), {
          status: 200,
        });
      }
      return new Response(
        JSON.stringify([{ id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" }]),
        { status: 200 },
      );
    }) as typeof fetch;

    const categories = await getCategories();
    assert.equal(categories.length, 1);
    assert.equal(categories[0].slug, "chal");
    assert.equal(calledUrls.length, 2);
  });

  it("returns null for unknown category slug", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify([{ id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" }]),
        { status: 200 },
      )) as typeof fetch;

    assert.equal((await getCategoryBySlug("chal"))?.nameBn, "চাল");
    assert.equal(await getCategoryBySlug("unknown"), null);
  });

  it("returns empty array when all API endpoints fail", async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      globalThis.fetch = (async () =>
        new Response("Server Error", { status: 500 })) as typeof fetch;

      const products = await getProducts("chal");
      assert.deepEqual(products, []);
    } finally {
      console.error = originalError;
    }
  });

  it("matches product by slug or numeric id", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify([
          {
            id: 1,
            slug: "sorno-machi-chal",
            nameBn: "স্বর্ণমাছি চাল",
            category: "chal",
            categoryNameBn: "চাল",
            categoryIcon: "🍚",
            unit: "kg",
            image: "🍚",
            today: 148,
            yesterday: 145,
            lastWeek: 142,
            lastMonth: 138,
            change: { dir: "up", pct: 2.1 },
            markets: [],
          },
        ]),
        { status: 200 },
      )) as typeof fetch;

    assert.equal(
      (await getProductBySlugOrId("sorno-machi-chal"))?.id,
      1,
    );
    assert.equal(
      (await getProductBySlugOrId("1"))?.slug,
      "sorno-machi-chal",
    );
    assert.equal(await getProductBySlugOrId("missing-slug"), null);
  });

  it("throws CatalogUnavailableError on strict loaders when all endpoints fail", async () => {
    globalThis.fetch = (async () =>
      new Response("Server Error", { status: 500 })) as typeof fetch;

    await assert.rejects(
      () => getCategoryPageData("chal"),
      CatalogUnavailableError,
    );
    await assert.rejects(
      () => getProductBySlugOrIdStrict("alu"),
      CatalogUnavailableError,
    );
  });

  it("returns null category or product on strict loaders when upstream is healthy but slug misses", async () => {
    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes("/categories")) {
        return new Response(
          JSON.stringify([
            { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
            { broken: true },
          ]),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify([{ badRecord: true }]), {
        status: 200,
      });
    }) as typeof fetch;

    const categoryResult = await getCategoryPageData("missing");
    assert.equal(categoryResult.category, null);
    assert.equal(categoryResult.categories.length, 1);

    const productResult = await getProductBySlugOrIdStrict("missing-item");
    assert.equal(productResult, null);
  });
});
