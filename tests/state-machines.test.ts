import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_CATALOG_FILTER_STATE,
  asyncActionReducer,
  catalogFilterReducer,
  deriveCatalogView,
  isActionBusy,
  resolveSessionGateState,
  socialAuthReducer,
} from "../src/lib/state-machines.ts";
import type { IProduct } from "../src/types/bazar.ts";

const SAMPLE_PRODUCTS: IProduct[] = [
  {
    id: 1,
    slug: "miniket-rice",
    nameBn: "মিনিকেট চাল",
    category: "rice",
    categoryNameBn: "চাল",
    categoryIcon: "🌾",
    unit: "kg",
    image: "🍚",
    today: 78,
    yesterday: 75,
    lastWeek: 74,
    lastMonth: 72,
    change: { dir: "up", pct: 4.0 },
    markets: [],
  },
  {
    id: 2,
    slug: "potato",
    nameBn: "আলু",
    category: "vegetables",
    categoryNameBn: "সবজি",
    categoryIcon: "🥬",
    unit: "kg",
    image: "🥔",
    today: 30,
    yesterday: 32,
    lastWeek: 34,
    lastMonth: 35,
    change: { dir: "down", pct: -6.2 },
    markets: [],
  },
];

describe("asyncActionReducer", () => {
  it("guards against duplicate SUBMIT while submitting or redirecting", () => {
    const submitting = asyncActionReducer({ status: "idle" }, { type: "SUBMIT" });
    assert.deepEqual(submitting, { status: "submitting" });
    assert.equal(isActionBusy(submitting), true);

    const dup = asyncActionReducer(submitting, { type: "SUBMIT" });
    assert.equal(dup, submitting);

    const redirecting = asyncActionReducer(submitting, { type: "SUCCEED" });
    assert.deepEqual(redirecting, { status: "redirecting" });
    assert.equal(isActionBusy(redirecting), true);

    const dupAfterSuccess = asyncActionReducer(redirecting, { type: "SUBMIT" });
    assert.equal(dupAfterSuccess, redirecting);
  });

  it("transitions to error with message and clears cleanly on RESET or retry", () => {
    const submitting = asyncActionReducer({ status: "idle" }, { type: "SUBMIT" });
    const errored = asyncActionReducer(submitting, {
      type: "FAIL",
      message: "Invalid credentials",
    });
    assert.deepEqual(errored, { status: "error", message: "Invalid credentials" });
    assert.equal(isActionBusy(errored), false);

    assert.deepEqual(asyncActionReducer(errored, { type: "SUBMIT" }), {
      status: "submitting",
    });
    assert.deepEqual(asyncActionReducer(errored, { type: "RESET" }), {
      status: "idle",
    });
  });
});

describe("socialAuthReducer", () => {
  it("locks duplicate OAuth starts while redirecting", () => {
    const started = socialAuthReducer(
      { status: "idle" },
      { type: "START", provider: "google" },
    );
    assert.deepEqual(started, { status: "redirecting", provider: "google" });

    const duplicate = socialAuthReducer(started, {
      type: "START",
      provider: "facebook",
    });
    assert.equal(duplicate, started);

    const failed = socialAuthReducer(started, {
      type: "FAIL",
      provider: "google",
      message: "OAuth unavailable",
    });
    assert.deepEqual(failed, {
      status: "error",
      provider: "google",
      message: "OAuth unavailable",
    });
  });
});

describe("resolveSessionGateState", () => {
  it("resolves loading, unauthenticated, and authenticated states exclusively", () => {
    assert.deepEqual(resolveSessionGateState(true, { id: "1" }), {
      status: "loading",
    });
    assert.deepEqual(resolveSessionGateState(false, null), {
      status: "unauthenticated",
    });
    assert.deepEqual(resolveSessionGateState(false, { id: "1", name: "Sam" }), {
      status: "authenticated",
      user: { id: "1", name: "Sam" },
    });
  });
});

describe("catalogFilterReducer & deriveCatalogView", () => {
  it("distinguishes upstream-empty from empty-search, empty-filtered, and populated", () => {
    assert.equal(
      deriveCatalogView([], INITIAL_CATALOG_FILTER_STATE).status,
      "upstream-empty",
    );

    const searchEmpty = deriveCatalogView(SAMPLE_PRODUCTS, {
      query: "নাগরিক",
      category: "all",
      direction: "all",
      sortBy: "default",
    });
    assert.equal(searchEmpty.status, "empty-search");

    const filterEmpty = deriveCatalogView(SAMPLE_PRODUCTS, {
      query: "আলু",
      category: "all",
      direction: "up",
      sortBy: "default",
    });
    assert.equal(filterEmpty.status, "empty-filtered");
    assert.equal(filterEmpty.hasActiveFilters, true);

    const populated = deriveCatalogView(SAMPLE_PRODUCTS, {
      query: "",
      category: "all",
      direction: "up",
      sortBy: "price-desc",
    });
    assert.equal(populated.status, "populated");
    assert.equal(populated.visibleProducts.length, 1);
    assert.equal(populated.visibleProducts[0].slug, "miniket-rice");

    const categoryFiltered = deriveCatalogView(SAMPLE_PRODUCTS, {
      query: "",
      category: "vegetables",
      direction: "all",
      sortBy: "default",
    });
    assert.equal(categoryFiltered.status, "populated");
    assert.equal(categoryFiltered.hasActiveFilters, true);
    assert.deepEqual(
      categoryFiltered.visibleProducts.map((p) => p.slug),
      ["potato"],
    );
  });

  it("resets filters cleanly to initial state and supports HYDRATE_FROM_URL", () => {
    const withCategory = catalogFilterReducer(INITIAL_CATALOG_FILTER_STATE, {
      type: "SET_CATEGORY",
      category: "chal",
    });
    const modified = catalogFilterReducer(withCategory, {
      type: "SET_DIRECTION",
      direction: "down",
    });
    assert.deepEqual(
      catalogFilterReducer(modified, { type: "RESET_FILTERS" }),
      INITIAL_CATALOG_FILTER_STATE,
    );

    const hydrated = catalogFilterReducer(INITIAL_CATALOG_FILTER_STATE, {
      type: "HYDRATE_FROM_URL",
      state: {
        query: "চাল",
        category: "rice",
        direction: "up",
        sortBy: "price-asc",
      },
    });
    assert.deepEqual(hydrated, {
      query: "চাল",
      category: "rice",
      direction: "up",
      sortBy: "price-asc",
    });
  });
});
