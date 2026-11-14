import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  id,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: {
  id: string;
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "min-w-0 scroll-mt-20 rounded-2xl border bg-card p-4 shadow-panel sm:p-6",
        className,
      )}
    >
      <header className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h2 id={`${id}-title`} className="text-lg font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
