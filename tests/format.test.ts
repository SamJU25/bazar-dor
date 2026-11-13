import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatBnNumber,
  formatDhakaDateBn,
  formatPriceBn,
  formatShortUnitBn,
  formatUnitBn,
} from "../src/lib/format.ts";

describe("format utilities", () => {
  it("formats numbers and prices using Bengali numerals", () => {
    assert.equal(formatBnNumber(148), "১৪৮");
    assert.equal(formatBnNumber(1850), "১,৮৫০");
    assert.equal(formatBnNumber(148.5, 1), "১৪৮.৫");
    assert.equal(formatPriceBn(148), "৳ ১৪৮");
    assert.equal(formatPriceBn(1850), "৳ ১,৮৫০");
    assert.equal(formatPriceBn(148.5, 1), "৳ ১৪৮.৫");
  });

  it("maps units to full and short Bengali labels with safe fallback", () => {
    assert.equal(formatUnitBn("kg"), "প্রতি কেজি");
    assert.equal(formatUnitBn("litre"), "প্রতি লিটার");
    assert.equal(formatUnitBn("dozen"), "প্রতি ডজন");
    assert.equal(formatUnitBn("piece"), "প্রতি পিস");
    assert.equal(formatUnitBn("bundle"), "bundle");

    assert.equal(formatShortUnitBn("kg"), "কেজি");
    assert.equal(formatShortUnitBn("litre"), "লিটার");
    assert.equal(formatShortUnitBn("dozen"), "ডজন");
    assert.equal(formatShortUnitBn("piece"), "পিস");
    assert.equal(formatShortUnitBn("bundle"), "bundle");
  });

  it("formats a Dhaka calendar date in Bengali", () => {
    const formatted = formatDhakaDateBn(new Date("2026-11-14T00:00:00Z"));
    assert.ok(formatted.includes("২০২৬"));
  });
});
