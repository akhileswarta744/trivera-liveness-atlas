import { useSyncExternalStore } from "react";

/**
 * Recent activity for this browser session. Placeholder rows describe the shell's state;
 * session rows are real UI actions taken in this tab. Nothing here comes from the API.
 */
export type ActivityKind = "placeholder" | "session";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  /** Epoch ms, only for session rows. */
  at?: number;
}

const PLACEHOLDER_ROWS: ActivityEntry[] = [
  {
    id: "ph-api",
    kind: "placeholder",
    title: "API integration pending",
    detail: "Activity from the backend appears here once docs/API.md is wired.",
  },
  {
    id: "ph-scenarios",
    kind: "placeholder",
    title: "Synthetic scenarios ready to explore",
    detail: "13 demo-only scenarios are available. None have been run against the backend.",
  },
  {
    id: "ph-camera",
    kind: "placeholder",
    title: "Live capture not available",
    detail: "Camera capture waits on a capture contract from the backend.",
  },
];

const MAX_SESSION_ROWS = 20;
let sessionRows: ActivityEntry[] = [];
let snapshot: ActivityEntry[] = [...PLACEHOLDER_ROWS];
const listeners = new Set<() => void>();
let counter = 0;

function emit() {
  snapshot = [...sessionRows, ...PLACEHOLDER_ROWS];
  for (const l of listeners) l();
}

export function logActivity(title: string, detail: string) {
  counter += 1;
  sessionRows = [
    { id: `s-${Date.now()}-${counter}`, kind: "session" as const, title, detail, at: Date.now() },
    ...sessionRows,
  ].slice(0, MAX_SESSION_ROWS);
  emit();
}

export function clearSessionActivity() {
  sessionRows = [];
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot = [...PLACEHOLDER_ROWS];

export function useActivity() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
}
