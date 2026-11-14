import { Building2, CircleDashed, ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react";

import {
  DECISION_TIME_TARGET_SECONDS,
  EXPECTED_GATES,
  VERDICTS,
  VERDICT_MEANING,
  type Scenario,
  type Verdict,
} from "@/lib/trivera-data";
import { cn } from "@/lib/utils";
import { Panel } from "./Panel";
import { Tag } from "./StatusBadge";

export type PreviewState = "none" | Verdict;

const VERDICT_STYLE: Record<Verdict, { box: string; text: string; icon: typeof ShieldCheck }> = {
  ALLOW: { box: "border-success/40 bg-success-soft", text: "text-success-strong", icon: ShieldCheck },
  VERIFY: { box: "border-warning/50 bg-warning-soft", text: "text-warning-strong", icon: ShieldQuestion },
  DENY: { box: "border-danger/40 bg-danger-soft", text: "text-danger-strong", icon: ShieldX },
};

const OPTIONS: { value: PreviewState; label: string }[] = [
  { value: "none", label: "Awaiting" },
  ...VERDICTS.map((v) => ({ value: v as PreviewState, label: v })),
];

function Placeholder({ children = "Pending API" }: { children?: string }) {
  return <span className="font-mono text-xs text-muted-foreground">{children}</span>;
}

export function DecisionResult({
  scenario,
  preview,
  onPreviewChange,
}: {
  scenario: Scenario | undefined;
  preview: PreviewState;
  onPreviewChange: (p: PreviewState) => void;
}) {
  const verdict = preview === "none" ? null : preview;
  const style = verdict ? VERDICT_STYLE[verdict] : null;
  const Icon = style?.icon ?? CircleDashed;

  return (
    <Panel
      id="decision"
      eyebrow={
        <span className="flex items-center gap-2">
          Decision result <Tag tone="warning">Illustrative only</Tag>
        </span>
      }
      title="Biometric decision"
      description="A demo shell state, not a biometric result. Real decisions come from the API."
    >
      <fieldset>
        <legend className="eyebrow mb-2">Preview state</legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-4">
          {OPTIONS.map((o) => {
            const id = `preview-${o.value}`;
            const checked = preview === o.value;
            return (
              <label
                key={o.value}
                htmlFor={id}
                className={cn(
                  "cursor-pointer rounded-lg px-2 py-2 text-center whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-ring",
                  checked && "bg-card text-foreground shadow-panel",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name="preview-state"
                  value={o.value}
                  checked={checked}
                  onChange={() => onPreviewChange(o.value)}
                  className="sr-only"
                />
                {o.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        className={cn(
          "relative mt-4 overflow-hidden rounded-xl border p-5",
          style ? style.box : "border-dashed border-input bg-muted/50",
        )}
      >
        {verdict && (
          <span
            aria-hidden
            className="demo-hatch pointer-events-none absolute inset-0 text-foreground"
          />
        )}
        <div className="relative flex items-start gap-4">
          <Icon
            aria-hidden
            className={cn("size-10 shrink-0", style ? style.text : "text-muted-foreground")}
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            {verdict ? (
              <>
                <p className="eyebrow">Demo state · not a biometric result</p>
                <p className={cn("font-display text-4xl font-bold tracking-tight", style?.text)}>
                  {verdict}
                </p>
                <p className="mt-1 text-sm text-foreground">{VERDICT_MEANING[verdict]}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">No decision</p>
                <p className="font-display text-2xl font-semibold text-foreground">Awaiting API</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Decisions appear here once the backend is wired. Pick a preview state to see the
                  layout.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Scenario</dt>
        <dd className="min-w-0 font-medium text-foreground">
          {scenario ? (
            <span className="flex flex-wrap items-center gap-2">
              {scenario.label} <Tag tone="info">Simulated</Tag>
            </span>
          ) : (
            <span className="text-muted-foreground">None selected</span>
          )}
        </dd>
        <dt className="text-muted-foreground">Mode</dt>
        <dd className="text-foreground">{scenario ? "Synthetic (demo)" : <Placeholder>—</Placeholder>}</dd>
      </dl>

      <div className="mt-5 space-y-5 border-t pt-5">
        <section aria-labelledby="reasons-title">
          <h3 id="reasons-title" className="text-sm font-semibold text-foreground">
            Reasons
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Plain-language reasons from the policy engine will be listed here. None are populated.
          </p>
        </section>

        <section aria-labelledby="gates-title">
          <h3 id="gates-title" className="text-sm font-semibold text-foreground">
            Evidence gates
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Expected gates from the brief. Final names come from docs/API.md.
          </p>
          <ul className="mt-2 divide-y rounded-lg border">
            {EXPECTED_GATES.map((g) => (
              <li key={g} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span className="min-w-0 text-foreground">{g}</span>
                <Placeholder />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="meta-title">
          <h3 id="meta-title" className="text-sm font-semibold text-foreground">
            Decision metadata
          </h3>
          <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
            <dt className="text-muted-foreground">Policy version</dt>
            <dd><Placeholder /></dd>
            <dt className="text-muted-foreground">Decision ID</dt>
            <dd><Placeholder /></dd>
            <dt className="text-muted-foreground">Evaluated at</dt>
            <dd><Placeholder /></dd>
            <dt className="text-muted-foreground">Decision time</dt>
            <dd className="flex flex-wrap items-center gap-2">
              <Placeholder>Unmeasured</Placeholder>
              <span className="text-xs text-muted-foreground">
                Target under {DECISION_TIME_TARGET_SECONDS} s
              </span>
            </dd>
          </dl>
        </section>
      </div>

      <section
        aria-labelledby="campus-title"
        className="mt-5 rounded-xl border bg-background p-4"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <h3 id="campus-title" className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
            <Building2 aria-hidden className="size-4 shrink-0 text-primary" />
            Campus access decision
          </h3>
          <Tag>Not evaluated</Tag>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Kept separate from the biometric result. Access rules aren't part of this shell.
        </p>
      </section>
    </Panel>
  );
}
