import { format } from "date-fns";
import { CalendarDays, ChevronDown, FilterX } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DATE_PRESET_LABEL, type DateRangeFilter } from "@/lib/filters";
import { STATUS_LABEL, type ImplementationStatus } from "@/lib/trivera-data";
import { cn } from "@/lib/utils";
import { STATUS_ICONS } from "./StatusBadge";

const STATUSES: ImplementationStatus[] = ["implemented", "simulated", "pending", "unmeasured"];
const PRESETS = ["all", "today", "7d", "30d"] as const;

export function describeDateFilter(filter: DateRangeFilter) {
  if (filter.preset !== "custom") return DATE_PRESET_LABEL[filter.preset];
  if (!filter.from) return "Custom range";
  const from = format(filter.from, "d MMM yyyy");
  if (!filter.to || filter.to.getTime() === filter.from.getTime()) return from;
  return `${from} – ${format(filter.to, "d MMM yyyy")}`;
}

export function FilterBar({
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  dateFilter: DateRangeFilter;
  onDateFilterChange: (f: DateRangeFilter) => void;
  statusFilter: ImplementationStatus[];
  onStatusFilterChange: (s: ImplementationStatus[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const isFiltered = dateFilter.preset !== "all" || statusFilter.length > 0;
  const selectedRange: DateRange | undefined =
    dateFilter.preset === "custom" && dateFilter.from
      ? { from: dateFilter.from, to: dateFilter.to }
      : undefined;

  return (
    <section
      aria-labelledby="filters-title"
      className="rounded-2xl border bg-card p-4 shadow-panel"
    >
      <h2 id="filters-title" className="sr-only">
        Dashboard filters
      </h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex min-w-0 flex-col gap-1.5">
            <span id="date-filter-label" className="eyebrow">
              Date range
            </span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  aria-labelledby="date-filter-label date-filter-value"
                  className="h-10 w-full justify-between gap-3 sm:w-64"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <CalendarDays aria-hidden className="text-primary" />
                    <span id="date-filter-value" className="truncate">
                      {describeDateFilter(dateFilter)}
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
                        variant={dateFilter.preset === p ? "secondary" : "ghost"}
                        aria-pressed={dateFilter.preset === p}
                        className="justify-start"
                        onClick={() => {
                          onDateFilterChange({ preset: p });
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
                    defaultMonth={selectedRange?.from}
                    disabled={{ after: new Date() }}
                    onSelect={(range) => {
                      if (!range?.from) {
                        onDateFilterChange({ preset: "all" });
                        return;
                      }
                      onDateFilterChange({ preset: "custom", from: range.from, to: range.to });
                    }}
                    className="pointer-events-auto p-3"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <span id="status-filter-label" className="eyebrow">
              Capability status
            </span>
            <ToggleGroup
              type="multiple"
              aria-labelledby="status-filter-label"
              value={statusFilter}
              onValueChange={(v) => onStatusFilterChange(v as ImplementationStatus[])}
              className="flex flex-wrap justify-start gap-1.5"
            >
              {STATUSES.map((s) => {
                const Icon = STATUS_ICONS[s];
                return (
                  <ToggleGroupItem
                    key={s}
                    value={s}
                    variant="outline"
                    className={cn(
                      "h-10 rounded-lg px-3 data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
                    )}
                  >
                    <Icon aria-hidden className="size-4" />
                    {STATUS_LABEL[s]}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {isFiltered ? "Filters apply to history, activity and the checklist." : "No filters applied."}
          </p>
          <Button
            variant="ghost"
            size="sm"
            disabled={!isFiltered}
            onClick={() => {
              onDateFilterChange({ preset: "all" });
              onStatusFilterChange([]);
            }}
          >
            <FilterX aria-hidden />
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
}
