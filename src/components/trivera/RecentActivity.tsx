import { formatDistanceToNow } from "date-fns";
import { Activity, MousePointerClick, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearSessionActivity, useActivity } from "@/lib/activity";
import { isWithinDateRange, type DateRangeFilter } from "@/lib/filters";
import { Panel } from "./Panel";
import { Tag } from "./StatusBadge";
import { describeDateFilter } from "./FilterBar";

export function RecentActivity({ dateFilter }: { dateFilter: DateRangeFilter }) {
  const entries = useActivity();
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const sessionCount = entries.filter((e) => e.kind === "session").length;
  const visible = entries.filter(
    (e) => e.kind === "placeholder" || (e.at !== undefined && isWithinDateRange(e.at, dateFilter)),
  );
  const hiddenCount = entries.length - visible.length;

  return (
    <Panel
      id="activity"
      eyebrow="Recent activity"
      title="Activity"
      description="Placeholder rows plus actions taken in this browser tab. No backend activity."
      actions={
        sessionCount > 0 ? (
          <Button variant="ghost" size="sm" onClick={clearSessionActivity}>
            Clear
          </Button>
        ) : undefined
      }
    >
      {dateFilter.preset !== "any" && (
        <p className="mb-3 text-xs text-muted-foreground">
          {describeDateFilter(dateFilter)} · undated placeholders always show
          {hiddenCount > 0 ? ` · ${hiddenCount} hidden by filter` : ""}
        </p>
      )}
      <ol className="flex flex-col gap-1" aria-label="Activity entries">
        {visible.map((e) => (
          <li key={e.id} className="flex gap-3 rounded-lg p-2 hover:bg-muted/60">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              {e.kind === "session" ? (
                <MousePointerClick aria-hidden className="size-4" />
              ) : (
                <StickyNote aria-hidden className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="text-sm font-medium text-foreground">{e.title}</p>
                {e.kind === "session" && e.at ? (
                  <time
                    dateTime={new Date(e.at).toISOString()}
                    className="text-xs whitespace-nowrap text-muted-foreground"
                  >
                    {formatDistanceToNow(e.at, { addSuffix: true })}
                  </time>
                ) : (
                  <Tag>Placeholder</Tag>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{e.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {sessionCount === 0 && (
        <p className="mt-3 flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
          <Activity aria-hidden className="size-3.5" />
          Your actions in this tab, like choosing a scenario, will appear above.
        </p>
      )}
    </Panel>
  );
}
