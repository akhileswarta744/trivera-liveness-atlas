import type { ImplementationStatus } from "./trivera-data";

export type DatePreset = "all" | "today" | "7d" | "30d" | "custom";

export interface DateRangeFilter {
  preset: DatePreset;
  from?: Date;
  to?: Date;
}

export const DATE_PRESET_LABEL: Record<Exclude<DatePreset, "custom">, string> = {
  all: "All time",
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

/** Resolves a filter to inclusive [start, end] bounds, or null for "all time". */
export function resolveDateRange(
  filter: DateRangeFilter,
  now: Date = new Date(),
): { start: Date; end: Date } | null {
  switch (filter.preset) {
    case "all":
      return null;
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "7d": {
      const start = startOfDay(now);
      start.setDate(start.getDate() - 6);
      return { start, end: endOfDay(now) };
    }
    case "30d": {
      const start = startOfDay(now);
      start.setDate(start.getDate() - 29);
      return { start, end: endOfDay(now) };
    }
    case "custom": {
      if (!filter.from) return null;
      return { start: startOfDay(filter.from), end: endOfDay(filter.to ?? filter.from) };
    }
  }
}

export function isWithinDateRange(at: number, filter: DateRangeFilter, now: Date = new Date()) {
  const range = resolveDateRange(filter, now);
  if (!range) return true;
  return at >= range.start.getTime() && at <= range.end.getTime();
}

export function matchesStatusFilter(status: ImplementationStatus, selected: ImplementationStatus[]) {
  return selected.length === 0 || selected.includes(status);
}
