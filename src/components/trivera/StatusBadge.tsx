import { CheckCircle2, CircleDashed, Clock3, FlaskConical } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { STATUS_LABEL, type ImplementationStatus } from "@/lib/trivera-data";

export const STATUS_STYLES: Record<ImplementationStatus, string> = {
  implemented: "bg-success-soft text-success-strong border-success/30",
  simulated: "bg-info-soft text-info-strong border-primary/25",
  pending: "bg-warning-soft text-warning-strong border-warning/45",
  unmeasured: "bg-muted text-muted-foreground border-border",
};

export const STATUS_ICONS = {
  implemented: CheckCircle2,
  simulated: FlaskConical,
  pending: Clock3,
  unmeasured: CircleDashed,
} as const;

export function StatusBadge({
  status,
  className,
}: {
  status: ImplementationStatus;
  className?: string;
}) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {STATUS_LABEL[status]}
    </span>
  );
}

type TagTone = "info" | "warning" | "neutral" | "success" | "danger";

const TAG_TONES: Record<TagTone, string> = {
  info: "bg-info-soft text-info-strong border-primary/20",
  warning: "bg-warning-soft text-warning-strong border-warning/40",
  neutral: "bg-muted text-muted-foreground border-border",
  success: "bg-success-soft text-success-strong border-success/30",
  danger: "bg-danger-soft text-danger-strong border-danger/30",
};

export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: TagTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[0.6875rem] font-medium tracking-wide uppercase",
        TAG_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
