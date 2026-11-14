import { describe, expect, it } from "vitest";

import {
  DATE_PRESET_LABEL,
  clearDateFilter,
  clearStatusFilter,
  defaultFilters,
  isWithinDateRange,
  resetFilters,
  type DashboardFilters,
} from "@/lib/filters";

const customised: DashboardFilters = {
  date: { preset: "30d" },
  statuses: ["pending", "simulated"],
};

describe("dashboard filters", () => {
  it("starts on Last 7 days and All statuses", () => {
    const f = defaultFilters();
    expect(DATE_PRESET_LABEL[f.date.preset as "7d"]).toBe("Last 7 days");
    expect(f.statuses).toEqual([]);
  });

  it("clearing the date selects Any time and keeps the status filter", () => {
    const f = clearDateFilter(customised);
    expect(f.date.preset).toBe("any");
    expect(DATE_PRESET_LABEL.any).toBe("Any time");
    expect(f.statuses).toEqual(["pending", "simulated"]);
  });

  it("clearing the status selects All statuses and keeps the date range", () => {
    const f = clearStatusFilter(customised);
    expect(f.statuses).toEqual([]);
    expect(f.date).toEqual({ preset: "30d" });
  });

  it("reset restores Last 7 days and All statuses", () => {
    const f = resetFilters();
    expect(f.date.preset).toBe("7d");
    expect(f.statuses).toEqual([]);
  });

  it("Last 7 days includes 6 days ago and excludes 7 days ago", () => {
    const now = new Date(2026, 10, 14, 12, 0, 0);
    const sixDaysAgo = new Date(2026, 10, 8, 9, 0, 0).getTime();
    const sevenDaysAgo = new Date(2026, 10, 7, 23, 0, 0).getTime();
    expect(isWithinDateRange(sixDaysAgo, { preset: "7d" }, now)).toBe(true);
    expect(isWithinDateRange(sevenDaysAgo, { preset: "7d" }, now)).toBe(false);
  });
});
