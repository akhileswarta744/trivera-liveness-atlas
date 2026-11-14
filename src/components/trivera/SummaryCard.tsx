import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Reusable headline metric card. Values must come from known project state, never invented. */
export function SummaryCard({
  icon: Icon,
  label,
  value,
  unit,
  badge,
  hint,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit?: string;
  badge?: ReactNode;
  hint: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-2xl border bg-card p-4 shadow-panel",
        className,
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Icon aria-hidden className="size-4" />
          </span>
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
        </div>
        {badge}
      </div>
      <p className="font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>}
      </p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
