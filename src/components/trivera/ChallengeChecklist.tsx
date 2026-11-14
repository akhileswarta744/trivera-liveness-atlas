import { ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { matchesStatusFilter } from "@/lib/filters";
import {
  CHALLENGE_CHECKLIST,
  STATUS_LABEL,
  type ChecklistItem,
  type ImplementationStatus,
} from "@/lib/trivera-data";
import { Panel } from "./Panel";
import { StatusBadge } from "./StatusBadge";

export function ChallengeChecklist({
  statusFilter,
  onClearStatusFilter,
}: {
  statusFilter: ImplementationStatus[];
  onClearStatusFilter: () => void;
}) {
  const visible = CHALLENGE_CHECKLIST.filter((i) => matchesStatusFilter(i.status, statusFilter));
  const groups = visible.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <Panel
      id="checklist"
      eyebrow="Challenge checklist"
      title="HID challenge coverage"
      description="Each item reflects the current project state. Detection is not implemented."
    >
      {statusFilter.length > 0 && (
        <p className="mb-3 text-xs text-muted-foreground" aria-live="polite">
          Showing {visible.length} of {CHALLENGE_CHECKLIST.length} ·{" "}
          {statusFilter.map((s) => STATUS_LABEL[s]).join(", ")}
        </p>
      )}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-input px-6 py-10 text-center">
          <ListChecks aria-hidden className="size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="font-medium text-foreground">No items match</p>
          <Button variant="outline" size="sm" onClick={onClearStatusFilter}>
            Show all statuses
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {Object.entries(groups).map(([group, items]) => (
            <section key={group} aria-label={group}>
              <h3 className="eyebrow mb-2">{group}</h3>
              <ul className="divide-y rounded-xl border">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-3 py-3 sm:px-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.note}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Panel>
  );
}
