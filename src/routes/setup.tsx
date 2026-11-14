import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Server, Terminal } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Panel } from "@/components/trivera/Panel";
import { StatusBadge, Tag } from "@/components/trivera/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logActivity } from "@/lib/activity";
import { normalizeApiBase, useApiBase } from "@/lib/api-config";
import type { ImplementationStatus } from "@/lib/trivera-data";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Setup — Trivera API address and run notes" },
      {
        name: "description",
        content:
          "Set the Trivera backend address and see what must be wired once the backend and docs/API.md are available.",
      },
      { property: "og:title", content: "Setup — Trivera API address and run notes" },
      {
        property: "og:description",
        content: "Configure the API address placeholder and follow the local run notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SetupPage,
});

const WIRING: { area: string; needs: string }[] = [
  { area: "System status", needs: "Service health and registered calibrations." },
  { area: "Spoof scenarios", needs: "List of synthetic scenarios and a way to run one." },
  { area: "Decision result", needs: "Verdict, reasons, evidence gates, policy version and metadata." },
  { area: "Decision history", needs: "Past decisions with their mode (synthetic, replay, live)." },
  { area: "Authentication demo", needs: "A capture contract before any camera frames are sent." },
];

const SUMMARY: { label: string; status: ImplementationStatus }[] = [
  { label: "Dashboard shell, scenario selection, filters", status: "implemented" },
  { label: "Spoof types and policy scenarios", status: "simulated" },
  { label: "ALLOW / VERIFY / DENY decision states", status: "simulated" },
  { label: "API integration and live camera capture", status: "pending" },
  { label: "Liveness, face recognition, depth analysis", status: "pending" },
  { label: "Decision under 2 seconds, accuracy", status: "unmeasured" },
];

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre
        aria-label={label}
        className="overflow-x-auto rounded-xl bg-navy p-4 pr-12 font-mono text-sm leading-relaxed text-navy-foreground"
      >
        <code>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        aria-label={copied ? "Copied" : `Copy: ${label}`}
        className="absolute top-2 right-2 text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </Button>
    </div>
  );
}

function SetupPage() {
  const { apiBase, source, ready, save, envDefault } = useApiBase();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (ready) setDraft(apiBase);
  }, [ready, apiBase]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = normalizeApiBase(draft);
    if (!result.ok) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setError(null);
    save(result.value);
    setDraft(result.value);
    setMessage(result.value ? "Saved in this browser. No request was sent." : "API address cleared.");
    logActivity(
      result.value ? "API address saved" : "API address cleared",
      result.value ? `${result.value} · not connected` : "No API address set.",
    );
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pt-5 pb-12 sm:px-6 sm:pt-8">
      <p className="eyebrow">Setup</p>
      <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
        API address and run notes
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        This is a frontend shell. Exact routes and data shapes get wired once the backend and
        docs/API.md are available.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        <Panel
          id="api-base"
          eyebrow="Configuration"
          title="API base address"
          description="Where the Trivera backend will run. Saving only stores the address; nothing is called."
          actions={<Tag tone="warning">{ready && apiBase ? "Not connected" : "Not configured"}</Tag>}
        >
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
            <Label htmlFor="api-base-input">API base URL</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Server
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="api-base-input"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="http://localhost:8000"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setError(null);
                    setMessage(null);
                  }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby="api-base-help api-base-feedback"
                  className="h-10 pl-9 font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="h-10 flex-1 sm:flex-none">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 flex-1 sm:flex-none"
                  disabled={!apiBase && !draft}
                  onClick={() => {
                    setDraft("");
                    save("");
                    setError(null);
                    setMessage("API address cleared.");
                    logActivity("API address cleared", "No API address set.");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
            <p id="api-base-help" className="text-xs text-muted-foreground">
              {source === "env"
                ? "Currently from VITE_TRIVERA_API_BASE. Saving here overrides it in this browser."
                : envDefault
                  ? "Overrides VITE_TRIVERA_API_BASE in this browser."
                  : "You can also set VITE_TRIVERA_API_BASE in a .env file."}
            </p>
            <p id="api-base-feedback" aria-live="polite" className="text-sm">
              {error && <span className="text-danger-strong">{error}</span>}
              {message && <span className="text-success-strong">{message}</span>}
            </p>
          </form>
        </Panel>

        <Panel
          id="run"
          eyebrow="Local run"
          title="Run the shell locally"
          description="Needs Bun or Node.js 20+."
          actions={<Terminal aria-hidden className="size-5 text-primary" />}
        >
          <div className="flex flex-col gap-4">
            <CodeBlock label="Install and start" code={"bun install\nbun run dev"} />
            <p className="text-sm text-muted-foreground">
              Open the address the dev server prints. With npm, use <code className="font-mono">npm install</code>{" "}
              and <code className="font-mono">npm run dev</code>. Optional default API address:
            </p>
            <CodeBlock label=".env file" code={"VITE_TRIVERA_API_BASE=http://localhost:8000"} />
            <CodeBlock label="Run tests" code={"bun run test"} />
          </div>
        </Panel>

        <Panel
          id="wiring"
          eyebrow="Pending integration"
          title="What gets wired from docs/API.md"
          description="Routes and response shapes are intentionally not guessed."
        >
          <ul className="divide-y rounded-xl border">
            {WIRING.map((w) => (
              <li key={w.area} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{w.area}</p>
                  <p className="text-xs text-muted-foreground">{w.needs}</p>
                </div>
                <StatusBadge status="pending" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel id="summary" eyebrow="Status summary" title="Live, simulated, pending, unmeasured">
          <ul className="flex flex-col gap-2">
            {SUMMARY.map((s) => (
              <li key={s.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm">
                <span className="min-w-0 text-foreground">{s.label}</span>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
