/**
 * Static, known project state for the Trivera frontend shell.
 * Nothing here is an API response. Statuses describe what the M0 backend and this
 * shell actually do today; update them only when a capability is really delivered.
 */

export type ImplementationStatus = "implemented" | "simulated" | "pending" | "unmeasured";

export const STATUS_LABEL: Record<ImplementationStatus, string> = {
  implemented: "Implemented",
  simulated: "Simulated",
  pending: "Pending",
  unmeasured: "Unmeasured",
};

export type ScenarioKind = "spoof" | "policy";

export interface Scenario {
  id: string;
  kind: ScenarioKind;
  label: string;
  summary: string;
  /** What a future detector or policy gate would need to look at. Descriptive only. */
  note: string;
}

export const SPOOF_SCENARIOS: Scenario[] = [
  {
    id: "printed-photo",
    kind: "spoof",
    label: "Printed photo",
    summary: "A paper print of the enrolled person held to the camera.",
    note: "A real detector would look for flat texture, print grain and missing depth.",
  },
  {
    id: "screen-photo",
    kind: "spoof",
    label: "Photo on a screen",
    summary: "A still image of the person shown on a phone, tablet or monitor.",
    note: "A real detector would look for screen glare, moiré and bezel edges.",
  },
  {
    id: "replay-video",
    kind: "spoof",
    label: "Replay video",
    summary: "A recorded video of the person played back to the camera.",
    note: "A real detector would look for playback artifacts and unnatural motion.",
  },
  {
    id: "mask",
    kind: "spoof",
    label: "Mask",
    summary: "A worn mask made to resemble the enrolled person.",
    note: "A real detector would look for material, edge and depth inconsistencies.",
  },
];

export const POLICY_SCENARIOS: Scenario[] = [
  {
    id: "missing-sensors",
    kind: "policy",
    label: "Missing sensors",
    summary: "Required sensor evidence is absent from the request.",
    note: "Tests how policy handles incomplete evidence.",
  },
  {
    id: "stale-evidence",
    kind: "policy",
    label: "Stale evidence",
    summary: "Evidence is older than the freshness window.",
    note: "Tests the evidence-freshness gate.",
  },
  {
    id: "rgb-only",
    kind: "policy",
    label: "RGB-only input",
    summary: "Only a colour camera stream, with no depth or IR evidence.",
    note: "Tests fallback when stronger sensors are unavailable.",
  },
  {
    id: "no-face",
    kind: "policy",
    label: "No face",
    summary: "No face is present in the evidence.",
    note: "Tests the face-count gate.",
  },
  {
    id: "multiple-faces",
    kind: "policy",
    label: "Multiple faces",
    summary: "More than one face is present in the evidence.",
    note: "Tests the face-count gate.",
  },
  {
    id: "uncertain-pad",
    kind: "policy",
    label: "Uncertain PAD",
    summary: "Presentation-attack evidence is inconclusive.",
    note: "Tests the step-up path for uncertain liveness.",
  },
  {
    id: "pad-attack",
    kind: "policy",
    label: "PAD attack",
    summary: "Evidence summary reports a presentation attack.",
    note: "Tests the attack-rejection path.",
  },
  {
    id: "identity-mismatch",
    kind: "policy",
    label: "Identity mismatch",
    summary: "Evidence summary reports the face doesn't match the claimed identity.",
    note: "Tests the identity gate.",
  },
  {
    id: "missing-calibration",
    kind: "policy",
    label: "Missing calibration",
    summary: "No registered calibration for the device or sensor.",
    note: "Tests the calibration gate.",
  },
];

export const ALL_SCENARIOS: Scenario[] = [...SPOOF_SCENARIOS, ...POLICY_SCENARIOS];

export function findScenario(id: string | null): Scenario | undefined {
  if (!id) return undefined;
  return ALL_SCENARIOS.find((s) => s.id === id);
}

export type Verdict = "ALLOW" | "VERIFY" | "DENY";
export const VERDICTS: Verdict[] = ["ALLOW", "VERIFY", "DENY"];

/** Definitions of what each verdict would mean. Not results. */
export const VERDICT_MEANING: Record<Verdict, string> = {
  ALLOW: "Would mean every evidence gate passed and the person was judged live and matched.",
  VERIFY:
    "Would mean evidence was incomplete or uncertain, so a fallback check is needed before deciding.",
  DENY: "Would mean a gate failed decisively, such as a detected attack or identity mismatch.",
};

/** Gate names expected from the brief. Final names come from docs/API.md. */
export const EXPECTED_GATES = [
  "Face count",
  "Evidence freshness",
  "Sensor coverage",
  "Calibration",
  "Presentation attack (PAD)",
  "Identity match",
] as const;

export interface ChecklistItem {
  id: string;
  group: "Spoof coverage" | "Decision & fallback" | "Core biometrics" | "Performance" | "Frontend";
  label: string;
  status: ImplementationStatus;
  note: string;
}

export const CHALLENGE_CHECKLIST: ChecklistItem[] = [
  {
    id: "spoof-printed",
    group: "Spoof coverage",
    label: "Printed photo attack",
    status: "simulated",
    note: "Synthetic scenario only. No detector analyses real images.",
  },
  {
    id: "spoof-screen",
    group: "Spoof coverage",
    label: "Photo shown on a screen",
    status: "simulated",
    note: "Synthetic scenario only.",
  },
  {
    id: "spoof-replay",
    group: "Spoof coverage",
    label: "Replay video attack",
    status: "simulated",
    note: "Synthetic scenario only.",
  },
  {
    id: "spoof-mask",
    group: "Spoof coverage",
    label: "Mask attack",
    status: "simulated",
    note: "Synthetic scenario only.",
  },
  {
    id: "clear-decision",
    group: "Decision & fallback",
    label: "Clear ALLOW / VERIFY / DENY decision",
    status: "simulated",
    note: "Backend M0 evaluates synthetic evidence summaries. Shown here as illustrative states until wired.",
  },
  {
    id: "fallback",
    group: "Decision & fallback",
    label: "Fallback for missing or weak evidence",
    status: "simulated",
    note: "Missing sensors, stale evidence, RGB-only and uncertain PAD exist as synthetic scenarios.",
  },
  {
    id: "campus-separate",
    group: "Decision & fallback",
    label: "Campus access kept separate from biometric result",
    status: "implemented",
    note: "The shell shows it in its own panel. No access rules are evaluated.",
  },
  {
    id: "pad",
    group: "Core biometrics",
    label: "Live-person detection (PAD)",
    status: "pending",
    note: "Not implemented in the backend.",
  },
  {
    id: "face-recognition",
    group: "Core biometrics",
    label: "Face recognition / identity match",
    status: "pending",
    note: "Not implemented in the backend.",
  },
  {
    id: "depth",
    group: "Core biometrics",
    label: "Depth analysis",
    status: "pending",
    note: "Not implemented in the backend.",
  },
  {
    id: "camera-capture",
    group: "Core biometrics",
    label: "Live camera capture",
    status: "pending",
    note: "No capture contract yet. The shell only checks whether the browser sees a camera.",
  },
  {
    id: "timing",
    group: "Performance",
    label: "Decision in under 2 seconds",
    status: "unmeasured",
    note: "Target only. No decision time has been measured.",
  },
  {
    id: "accuracy",
    group: "Performance",
    label: "Attack and bona fide error rates",
    status: "unmeasured",
    note: "No calibrated evaluation exists. No accuracy figures are shown.",
  },
  {
    id: "shell",
    group: "Frontend",
    label: "Dashboard shell",
    status: "implemented",
    note: "Layout, scenario selection and illustrative decision states.",
  },
  {
    id: "api",
    group: "Frontend",
    label: "API integration",
    status: "pending",
    note: "Waiting for the backend and docs/API.md.",
  },
];

export const DECISION_TIME_TARGET_SECONDS = 2;

export function countByStatus(items: ChecklistItem[]): Record<ImplementationStatus, number> {
  const counts: Record<ImplementationStatus, number> = {
    implemented: 0,
    simulated: 0,
    pending: 0,
    unmeasured: 0,
  };
  for (const item of items) counts[item.status] += 1;
  return counts;
}

export const LIMITATIONS = [
  "No working liveness detection. Spoof types are synthetic scenarios, not detections.",
  "No face recognition or identity verification.",
  "No depth analysis.",
  "No live camera capture. The shell only checks whether the browser can see a camera.",
  "No calibrated performance measurements. Decision time and accuracy are unmeasured.",
  "No API calls are made. Routes and schemas will be wired from docs/API.md.",
];

export const NOT_SHOWN_ON_PURPOSE = [
  "Confidence scores",
  "Accuracy percentages",
  "Decision-time measurements",
  "Real decision records",
];
