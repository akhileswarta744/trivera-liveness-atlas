import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, History, ListChecks, Timer, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { AuthDemo } from "@/components/trivera/AuthDemo";
import { ChallengeChecklist } from "@/components/trivera/ChallengeChecklist";
import { DecisionHistory } from "@/components/trivera/DecisionHistory";
import { DecisionResult, type PreviewState } from "@/components/trivera/DecisionResult";
import { FilterBar, describeDateFilter } from "@/components/trivera/FilterBar";
import { Limitations } from "@/components/trivera/Limitations";
import { RecentActivity } from "@/components/trivera/RecentActivity";
import { Scenarios } from "@/components/trivera/Scenarios";
import { StatusBadge } from "@/components/trivera/StatusBadge";
import { SummaryCard } from "@/components/trivera/SummaryCard";
import { SystemStatus } from "@/components/trivera/SystemStatus";
import { useCameraAvailability } from "@/hooks/use-camera-availability";
import { logActivity } from "@/lib/activity";
import { useApiBase } from "@/lib/api-config";
import { ALL_STATUSES_LABEL, defaultFilters, type DashboardFilters } from "@/lib/filters";
import {
  ALL_SCENARIOS,
  CHALLENGE_CHECKLIST,
  DECISION_TIME_TARGET_SECONDS,
  POLICY_SCENARIOS,
  SPOOF_SCENARIOS,
  STATUS_LABEL,
  countByStatus,
  findScenario,
} from "@/lib/trivera-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trivera dashboard — Face liveness demo shell" },
      {
        name: "description",
        content:
          "Explore simulated spoof scenarios, illustrative decisions and HID challenge coverage for the Trivera liveness prototype.",
      },
      { property: "og:title", content: "Trivera dashboard — Face liveness demo shell" },
      {
        property: "og:description",
        content:
          "Simulated spoof scenarios, illustrative ALLOW / VERIFY / DENY states and honest challenge coverage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const VERDICT_CHIP: Record<Exclude<PreviewState, "none">, string> = {
  ALLOW: "bg-success-soft text-success-strong border-success/40",
  VERIFY: "bg-warning-soft text-warning-strong border-warning/50",
  DENY: "bg-danger-soft text-danger-strong border-danger/40",
};

function focusScenarios() {
  const section = document.getElementById("scenarios");
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
  const target =
    section?.querySelector<HTMLInputElement>('input[name="scenario"]:checked') ??
    section?.querySelector<HTMLInputElement>('input[name="scenario"]');
  target?.focus({ preventScroll: true });
}

function Dashboard() {
  const { apiBase, source, ready } = useApiBase();
  const { camera, recheck } = useCameraAvailability();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState>("none");
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const scenario = findScenario(scenarioId);
  const counts = countByStatus(CHALLENGE_CHECKLIST);

  const selectScenario = (id: string | null) => {
    setScenarioId(id);
    const s = findScenario(id);
    logActivity(
      s ? `Selected scenario: ${s.label}` : "Cleared scenario",
      s ? "Simulated. No detection ran." : "No scenario selected.",
    );
  };

  const changePreview = (p: PreviewState) => {
    setPreview(p);
    logActivity(
      p === "none" ? "Preview set to Awaiting" : `Preview state: ${p}`,
      "Illustrative demo state, not a biometric result.",
    );
  };

  const changeFilters = (f: DashboardFilters) => {
    setFilters(f);
    const statusText =
      f.statuses.length === 0 ? ALL_STATUSES_LABEL : f.statuses.map((s) => STATUS_LABEL[s]).join(", ");
    logActivity("Filters changed", `${describeDateFilter(f.date)} · ${statusText}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 pt-5 pb-28 sm:px-6 sm:pt-8 lg:pb-12">
      <section id="overview" aria-labelledby="page-title" className="scroll-mt-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">HID Hackathon · Face liveness & authentication</p>
            <h1 id="page-title" className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
              Trivera liveness dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Tell a live person from printed photos, screens, replays and masks, with a clear
              decision in under {DECISION_TIME_TARGET_SECONDS} seconds. This is the frontend shell:
              outcomes below are simulations.
            </p>
          </div>
        </div>

        <div
          role="note"
          className="mt-5 flex gap-3 rounded-2xl border border-warning/50 bg-warning-soft p-4 text-sm text-warning-strong"
        >
          <TriangleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          <p>
            <strong className="font-semibold">Simulation only.</strong> The M0 backend evaluates
            synthetic evidence summaries. There is no working liveness detection, face recognition,
            depth analysis or measured performance, and this shell makes no API calls yet.
          </p>
        </div>

        <div className="mt-5">
          <FilterBar filters={filters} onChange={changeFilters} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={FlaskConical}
            label="Scenarios available"
            value={ALL_SCENARIOS.length}
            badge={<StatusBadge status="simulated" />}
            hint={`${SPOOF_SCENARIOS.length} spoof types and ${POLICY_SCENARIOS.length} policy cases. Demo only.`}
          />
          <SummaryCard
            icon={History}
            label="Decisions recorded"
            value="0"
            badge={<StatusBadge status="pending" />}
            hint="History loads from the API once it's wired."
          />
          <SummaryCard
            icon={Timer}
            label="Decision time"
            value={`< ${DECISION_TIME_TARGET_SECONDS}`}
            unit="s target"
            badge={<StatusBadge status="unmeasured" />}
            hint="A target, not a measurement."
          />
          <SummaryCard
            icon={ListChecks}
            label="Challenge items implemented"
            value={counts.implemented}
            unit={`of ${CHALLENGE_CHECKLIST.length}`}
            badge={<StatusBadge status="implemented" />}
            hint={`${counts.simulated} simulated · ${counts.pending} pending · ${counts.unmeasured} unmeasured`}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-6">
        <SystemStatus
          apiBase={apiBase}
          apiSource={source}
          apiReady={ready}
          camera={camera}
          onRecheckCamera={() => {
            void recheck();
            logActivity("Re-checked camera", "Asked the browser for camera devices.");
          }}
        />

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            <AuthDemo camera={camera} onChooseScenario={focusScenarios} />
            <Scenarios selectedId={scenarioId} onSelect={selectScenario} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-20">
              <DecisionResult scenario={scenario} preview={preview} onPreviewChange={changePreview} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <DecisionHistory dateFilter={filters.date} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <RecentActivity dateFilter={filters.date} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <ChallengeChecklist
              statusFilter={filters.statuses}
              onClearStatusFilter={() => changeFilters({ ...filters, statuses: [] })}
            />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <Limitations />
          </div>
        </div>
      </div>

      {(scenario || preview !== "none") && (
        <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
          <div className="flex items-center gap-3 rounded-2xl border bg-card/95 p-3 shadow-lift backdrop-blur">
            <div className="min-w-0 flex-1">
              <p className="eyebrow">Current demo state</p>
              <p className="truncate text-sm font-medium text-foreground">
                {scenario ? scenario.label : "No scenario"}
                <span className="text-muted-foreground"> · simulated</span>
              </p>
            </div>
            {preview !== "none" && (
              <span
                className={cn(
                  "shrink-0 rounded-md border px-2 py-1 font-display text-xs font-bold",
                  VERDICT_CHIP[preview],
                )}
              >
                {preview}
              </span>
            )}
            <a
              href="#decision"
              className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              View decision
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
