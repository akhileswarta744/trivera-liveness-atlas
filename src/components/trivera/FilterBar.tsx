import { format } from "date-fns";
import { CalendarDays, ChevronDown, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ALL_STATUSES_LABEL,
  DATE_PRESET_LABEL,
  clearDateFilter,
  clearStatusFilter,
  isDefaultFilters,
  resetFilters,
  type DashboardFilters,
  type DateRangeFilter,
} from "@/lib/filters";
import { STATUS_LABEL, type ImplementationStatus } from "@/lib/trivera-data";
import { STATUS_ICONS } from "./StatusBadge";

const STATUSES: ImplementationStatus[] = ["implemented", "simulated", "pending", "unmeasured"];
const PRESETS = ["any", "today", "7d", "30d"] as const;
const ALL = "__all__";

export function describeDateFilter(filter: DateRangeFilter) {
  if (filter.preset !== "custom") return DATE_PRESET_LABEL[filter.preset];
  if (!filter.from) return "Custom range";
  const from = format(filter.from, "d MMM yyyy");
  if (!filter.to || filter.to.getTime() === filter.from.getTime()) return from;
  return `${from} – ${format(filter.to, "d MMM yyyy")}`;
}

const itemClass =
  "h-10 rounded-lg px-3 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground";

export function FilterBar({
  filters,
  onChange,
}: {
  filters: DashboardFilters;
  onChange: (f: DashboardFilters) => void;
}) {
  const [open, setOpen] = useState(false);
  const { date, statuses } = filters;
  const selectedRange: DateRange | undefined =
    date.preset === "custom" && date.from
      ? { from: date.from, ...(date.to ? { to: date.to } : {}) }
      : undefined;
  const statusValue = statuses.length === 0 ? [ALL] : statuses;

  return (
    <section aria-labelledby="filters-title" className="rounded-2xl border bg-card p-4 shadow-panel">
      <h2 id="filters-title" className="sr-only">
        Dashboard filters
      </h2>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span id="date-filter-label" className="eyebrow">
              Date range
            </span>
            <div className="flex items-center gap-1">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    aria-labelledby="date-filter-label date-filter-value"
                    className="h-10 min-w-0 flex-1 justify-between gap-3 sm:w-60 sm:flex-none"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <CalendarDays aria-hidden className="text-primary" />
                      <span id="date-filter-value" className="truncate">
                        {describeDateFilter(date)}
                      </span>
                    </span>
                    <ChevronDown aria-hidden className="text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div
                      role="group"
                      aria-label="Quick ranges"
                      className="flex flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0"
                    >
                      {PRESETS.map((p) => (
                        <Button
                          key={p}
                          size="sm"
                          variant={date.preset === p ? "secondary" : "ghost"}
                          aria-pressed={date.preset === p}
                          className="justify-start"
                          onClick={() => {
                            onChange({ ...filters, date: { preset: p } });
                            setOpen(false);
                          }}
                        >
                          {DATE_PRESET_LABEL[p]}
                        </Button>
                      ))}
                    </div>
                    <Calendar
                      mode="range"
                      selected={selectedRange}
                      {...(selectedRange?.from ? { defaultMonth: selectedRange.from } : {})}
                      disabled={{ after: new Date() }}
                      onSelect={(range) => {
                        if (!range?.from) {
                          onChange(clearDateFilter(filters));
                          return;
                        }
                        onChange({
                          ...filters,
                          date: {
                            preset: "custom",
                            from: range.from,
                            ...(range.to ? { to: range.to } : {}),
                          },
                        });
                      }}
                      className="pointer-events-auto p-3"
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 shrink-0"
                aria-label="Clear date range"
                title="Clear date range"
                disabled={date.preset === "any"}
                onClick={() => onChange(clearDateFilter(filters))}
              >
                <X aria-hidden />
              </Button>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <span id="status-filter-label" className="eyebrow">
              Capability status
            </span>
            <div className="flex flex-wrap items-center gap-1">
              <ToggleGroup
                type="multiple"
                variant="outline"
                aria-labelledby="status-filter-label"
                value={statusValue}
                onValueChange={(v) => {
                  // Choosing "All statuses" (or deselecting everything) clears statuses only.
                  const justPickedAll = v.includes(ALL) && !statusValue.includes(ALL);
                  const next = justPickedAll ? [] : (v.filter((x) => x !== ALL) as ImplementationStatus[]);
                  onChange({ ...filters, statuses: next });
                }}
                className="flex flex-wrap justify-start gap-1.5"
              >
                <ToggleGroupItem value={ALL} className={itemClass}>
                  {ALL_STATUSES_LABEL}
                </ToggleGroupItem>
                {STATUSES.map((s) => {
                  const Icon = STATUS_ICONS[s];
                  return (
                    <ToggleGroupItem key={s} value={s} className={itemClass}>
                      <Icon aria-hidden className="size-4" />
                      {STATUS_LABEL[s]}
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 shrink-0"
                aria-label="Clear status filter"
                title="Clear status filter"
                disabled={statuses.length === 0}
                onClick={() => onChange(clearStatusFilter(filters))}
              >
                <X aria-hidden />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 xl:justify-end">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            Filters history, activity and the checklist · placeholder data only
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={isDefaultFilters(filters)}
            onClick={() => onChange(resetFilters())}
          >
            <RotateCcw aria-hidden />
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}
