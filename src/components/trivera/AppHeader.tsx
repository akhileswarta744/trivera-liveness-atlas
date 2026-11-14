import { Link, useRouterState } from "@tanstack/react-router";
import { FlaskConical, Server } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApiBase } from "@/lib/api-config";
import { cn } from "@/lib/utils";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/setup": "Setup",
};

export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { apiBase, ready } = useApiBase();
  const title = TITLES[pathname] ?? "Trivera";

  return (
    <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger aria-label="Toggle navigation" className="shrink-0" />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <p className="truncate font-display text-sm font-semibold text-foreground sm:text-base">
            <span className="hidden text-muted-foreground sm:inline">Trivera / </span>
            {title}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-info-soft px-2.5 py-1 text-xs font-medium text-info-strong">
            <FlaskConical aria-hidden className="size-3.5" />
            <span>
              Demo<span className="hidden sm:inline"> shell · simulated</span>
            </span>
          </span>
          <Link
            to="/setup"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-accent",
              "border-warning/45 bg-warning-soft text-warning-strong",
            )}
            aria-label={
              ready && apiBase ? "API address set, not connected. Open setup." : "API not configured. Open setup."
            }
          >
            <Server aria-hidden className="size-3.5" />
            <span className="hidden sm:inline">
              {ready && apiBase ? "API not connected" : "API not configured"}
            </span>
            <span className="sm:hidden">API</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
