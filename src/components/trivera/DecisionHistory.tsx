import { FlaskConical, History, Radio, Repeat } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DateRangeFilter } from "@/lib/filters";
import { Panel } from "./Panel";
import { Tag } from "./StatusBadge";
import { describeDateFilter } from "./FilterBar";

const MODES = [
  {
    value: "synthetic",
    label: "Synthetic",
    icon: FlaskConical,
    tag: <Tag tone="info">Simulated</Tag>,
    text: "Decisions from the backend's synthetic scenarios. They are simulations, not detections.",
    empty: "No synthetic decisions yet. They load from the API once scenario routes are wired.",
  },
  {
    value: "replay",
    label: "Replay",
    icon: Repeat,
    tag: <Tag tone="warning">Pending</Tag>,
    text: "Decisions re-run from recorded evidence summaries.",
    empty: "No replay decisions. Replay needs recorded evidence and the API.",
  },
  {
    value: "live",
    label: "Live",
    icon: Radio,
    tag: <Tag tone="warning">Unavailable</Tag>,
    text: "Decisions from live camera capture.",
    empty: "Live mode is unavailable because camera capture isn't implemented.",
  },
] as const;

export function DecisionHistory({ dateFilter }: { dateFilter: DateRangeFilter }) {
  return (
    <Panel
      id="history"
      eyebrow="Decision history"
      title="Past decisions"
      description="Records load from the API once wired. None are stored or invented here."
      actions={<Tag>0 records</Tag>}
    >
      <Tabs defaultValue="synthetic">
        <TabsList className="grid h-auto w-full grid-cols-3">
          {MODES.map((m) => (
            <TabsTrigger key={m.value} value={m.value} className="gap-1.5 py-1.5">
              <m.icon aria-hidden className="size-4" />
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {MODES.map((m) => (
          <TabsContent key={m.value} value={m.value} className="mt-4">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {m.tag}
              <span>{m.text}</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-input px-6 py-10 text-center">
              <History aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
              <p className="font-medium text-foreground">No decisions</p>
              <p className="max-w-sm text-sm text-muted-foreground">{m.empty}</p>
              {dateFilter.preset !== "any" && (
                <p className="text-xs text-muted-foreground">
                  Showing: {describeDateFilter(dateFilter)}
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Panel>
  );
}
