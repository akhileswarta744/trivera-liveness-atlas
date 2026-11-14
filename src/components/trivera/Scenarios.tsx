import {
  CameraOff,
  Check,
  CircleHelp,
  Clapperboard,
  Clock,
  MonitorSmartphone,
  Play,
  Printer,
  ScanFace,
  ShieldAlert,
  SlidersHorizontal,
  UserX,
  Users,
  VenetianMask,
  Webcam,
  X,
  type LucideIcon,
} from "lucide-react";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { POLICY_SCENARIOS, SPOOF_SCENARIOS, type Scenario } from "@/lib/trivera-data";
import { cn } from "@/lib/utils";
import { Panel } from "./Panel";
import { Tag } from "./StatusBadge";

const ICONS: Record<string, LucideIcon> = {
  "printed-photo": Printer,
  "screen-photo": MonitorSmartphone,
  "replay-video": Clapperboard,
  mask: VenetianMask,
  "missing-sensors": CameraOff,
  "stale-evidence": Clock,
  "rgb-only": Webcam,
  "no-face": ScanFace,
  "multiple-faces": Users,
  "uncertain-pad": CircleHelp,
  "pad-attack": ShieldAlert,
  "identity-mismatch": UserX,
  "missing-calibration": SlidersHorizontal,
};

const GROUP_NAME = "scenario";

function ScenarioCard({
  scenario,
  selected,
  onSelect,
  compact,
}: {
  scenario: Scenario;
  selected: boolean;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const Icon = ICONS[scenario.id] ?? ScanFace;
  const inputId = `scenario-${scenario.id}`;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group relative flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl border bg-card p-4 transition-all",
        "hover:border-primary/50 hover:shadow-panel",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
        selected && "border-primary bg-accent shadow-lift ring-1 ring-primary",
        compact && "p-3",
      )}
    >
      <input
        id={inputId}
        type="radio"
        name={GROUP_NAME}
        value={scenario.id}
        checked={selected}
        onChange={() => onSelect(scenario.id)}
        className="sr-only"
        aria-labelledby={`${inputId}-title`}
        aria-describedby={`${inputId}-desc`}
      />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary transition-colors",
              selected && "bg-primary text-primary-foreground",
              compact && "size-8",
            )}
          >
            <Icon aria-hidden className="size-4.5" />
          </span>
          <span id={`${inputId}-title`} className="min-w-0 font-semibold text-foreground">
            {scenario.label}
          </span>
        </div>
        <span
          aria-hidden
          className={cn(
            "grid size-5 shrink-0 place-items-center rounded-full border border-input bg-card",
            selected && "border-primary bg-primary text-primary-foreground",
          )}
        >
          {selected && <Check className="size-3.5" strokeWidth={3} />}
        </span>
      </div>
      <p id={`${inputId}-desc`} className="text-sm text-muted-foreground">
        {scenario.summary}
        {!compact && <span className="mt-1 block text-xs">{scenario.note}</span>}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {scenario.kind === "spoof" ? (
          <Tag tone="info">Simulated</Tag>
        ) : (
          <>
            <Tag tone="info">Demo only</Tag>
            <Tag tone="warning">Contract pending</Tag>
          </>
        )}
      </div>
    </label>
  );
}

export const Scenarios = forwardRef<
  HTMLFieldSetElement,
  { selectedId: string | null; onSelect: (id: string | null) => void }
>(function Scenarios({ selectedId, onSelect }, ref) {
  return (
    <Panel
      id="scenarios"
      eyebrow="Spoof scenarios"
      title="Choose a simulated scenario"
      description="Synthetic scenarios only. Selecting one shows how the decision panel will look; no detection runs."
      actions={
        selectedId ? (
          <Button variant="ghost" size="sm" onClick={() => onSelect(null)}>
            <X aria-hidden />
            Clear
          </Button>
        ) : undefined
      }
    >
      <fieldset ref={ref} tabIndex={-1} className="flex flex-col gap-6 focus:outline-none">
        <legend className="sr-only">Scenario</legend>
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            Presentation attacks
            <Tag tone="info">Simulated</Tag>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {SPOOF_SCENARIOS.map((s) => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                selected={selectedId === s.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
            Synthetic policy scenarios
            <Tag tone="warning">Pending contract validation</Tag>
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            These mirror the backend's synthetic evidence cases. Exact names and outcomes are
            confirmed once docs/API.md is available.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {POLICY_SCENARIOS.map((s) => (
              <ScenarioCard
                key={s.id}
                scenario={s}
                selected={selectedId === s.id}
                onSelect={onSelect}
                compact
              />
            ))}
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-2 rounded-xl border bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="run-unavailable" className="text-sm text-muted-foreground">
          Running a scenario against the backend needs the scenario routes from docs/API.md.
        </p>
        <Button variant="outline" disabled aria-describedby="run-unavailable" className="shrink-0">
          <Play aria-hidden />
          Run on backend
        </Button>
      </div>
    </Panel>
  );
});
