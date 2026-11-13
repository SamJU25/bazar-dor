import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { IProduct } from "../src/types/bazar.ts";
import {
  computeMarketSummary,
  filterAndSortProducts,
  getDirectionCounts,
  getTopMovers,
  groupProductsByCategory,
} from "../src/lib/products.ts";

function makeProduct(overrides: Partial<IProduct>): IProduct {
  return {
    id: 1,
    slug: "test-item",
    nameBn: "টেস্ট পণ্য",
    category: "sobji",
    categoryNameBn: "সবজি",
    categoryIcon: "🥬",
    unit: "kg",
    image: "🥬",
    today: 100,
    yesterday: 100,
    lastWeek: 95,
    lastMonth: 90,
    change: { dir: "flat", pct: 0 },
    markets: [],
    ...overrides,
  };
}

const sampleProducts: IProduct[] = [
  makeProduct({
    id: 1,
    slug: "alu",
    nameBn: "আলু",
    today: 30,
    change: { dir: "down", pct: 3.2 },
  }),
  makeProduct({
    id: 2,
    slug: "peyaj",
    nameBn: "পেঁয়াজ",
    today: 54,
    change: { dir: "up", pct: 12.5 },
  }),
  makeProduct({
    id: 3,
    slug: "ilish",
    nameBn: "ইলিশ মাছ",
    category: "mach",
    categoryNameBn: "মাছ",
    today: 1850,
    change: { dir: "up", pct: 5.0 },
  }),
  makeProduct({
    id: 4,
    slug: "roshun",
    nameBn: "রসুন",
    today: 125,
    change: { dir: "down", pct: 7.4 },
  }),
  makeProduct({
    id: 5,
    slug: "lobon",
    nameBn: "লবণ",
    today: 42,
    change: { dir: "flat", pct: 0 },
  }),
];

describe("filterAndSortProducts", () => {
  it("sorts prices numerically rather than lexicographically", () => {
    const asc = filterAndSortProducts(sampleProducts, { sortBy: "price-asc" });
    assert.deepEqual(
      asc.map((p) => p.today),
      [30, 42, 54, 125, 1850],
    );

    const desc = filterAndSortProducts(sampleProducts, { sortBy: "price-desc" });
    assert.deepEqual(
      desc.map((p) => p.today),
      [1850, 125, 54, 42, 30],
    );
  });

  it("preserves original order on default sort and does not mutate input", () => {
    const originalIds = sampleProducts.map((p) => p.id);
    const result = filterAndSortProducts(sampleProducts, { sortBy: "default" });
    assert.deepEqual(
      result.map((p) => p.id),
      originalIds,
    );
    assert.deepEqual(
      sampleProducts.map((p) => p.id),
      originalIds,
    );
  });

  it("filters by query across nameBn, categoryNameBn, and slug and by direction", () => {
    const byCategory = filterAndSortProducts(sampleProducts, { query: "মাছ" });
    assert.deepEqual(
      byCategory.map((p) => p.slug),
      ["ilish"],
    );

    const byDirection = filterAndSortProducts(sampleProducts, {
      direction: "down",
      sortBy: "price-asc",
    });
    assert.deepEqual(
      byDirection.map((p) => p.slug),
      ["alu", "roshun"],
    );

    const byCategoryFilter = filterAndSortProducts(sampleProducts, {
      category: "mach",
    });
    assert.deepEqual(
      byCategoryFilter.map((p) => p.slug),
      ["ilish"],
    );
  });
});

describe("getTopMovers & getDirectionCounts", () => {
  it("returns top movers sorted by absolute percentage change", () => {
    const risers = getTopMovers(sampleProducts, "up", 6);
    assert.deepEqual(
      risers.map((p) => p.slug),
      ["peyaj", "ilish"],
    );

    const fallers = getTopMovers(sampleProducts, "down", 1);
    assert.deepEqual(
      fallers.map((p) => p.slug),
      ["roshun"],
    );
  });

  it("computes counts per direction", () => {
    assert.deepEqual(getDirectionCounts(sampleProducts), {
      all: 5,
      up: 2,
      down: 2,
      flat: 1,
    });
  });
});

describe("computeMarketSummary", () => {
  it("computes min, max, average, and extreme markets across markets", () => {
    const product = makeProduct({
      today: 148,
      markets: [
        { market: "কারওয়ান বাজার", division: "ঢাকা", min: 146, max: 165 },
        { market: "আমতলী বাজার", division: "চট্টগ্রাম", min: 138, max: 155 },
      ],
    });

    const summary = computeMarketSummary(product);
    assert.equal(summary.minPrice, 138);
    assert.equal(summary.maxPrice, 165);
    assert.equal(summary.avgPrice, 151);
    assert.equal(summary.cheapestMarket?.market, "আমতলী বাজার");
    assert.equal(summary.costliestMarket?.market, "কারওয়ান বাজার");
  });

  it("falls back to today's price when markets array is empty", () => {
    const summary = computeMarketSummary(makeProduct({ today: 90, markets: [] }));
    assert.equal(summary.minPrice, 90);
    assert.equal(summary.maxPrice, 90);
    assert.equal(summary.avgPrice, 90);
    assert.equal(summary.cheapestMarket, undefined);
    assert.equal(summary.costliestMarket, undefined);
  });
});

describe("groupProductsByCategory", () => {
  it("groups products by category while preserving first-seen order", () => {
    const groups = groupProductsByCategory(sampleProducts);
    assert.deepEqual(
      groups.map((g) => ({
        category: g.category,
        slugs: g.items.map((i) => i.slug),
      })),
      [
        { category: "sobji", slugs: ["alu", "peyaj", "roshun", "lobon"] },
        { category: "mach", slugs: ["ilish"] },
      ],
    );
  });
});
