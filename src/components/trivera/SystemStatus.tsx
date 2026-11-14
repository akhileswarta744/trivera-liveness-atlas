import { Link } from "@tanstack/react-router";
import { Camera, Cpu, RefreshCw, Server, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { CameraAvailability } from "@/hooks/use-camera-availability";
import type { ApiBaseSource } from "@/lib/api-config";
import { Panel } from "./Panel";
import { StatusBadge, Tag } from "./StatusBadge";

function StatusTile({
  icon: Icon,
  title,
  state,
  children,
}: {
  icon: typeof Server;
  title: string;
  state: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-xl border bg-background/60 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon aria-hidden className="size-4 shrink-0 text-primary" />
          <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {state}
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function cameraSummary(camera: CameraAvailability): { tag: ReactNode; text: string } {
  switch (camera.status) {
    case "checking":
      return { tag: <Tag>Checking</Tag>, text: "Asking the browser for camera devices…" };
    case "detected":
      return {
        tag: <Tag tone="info">Detected</Tag>,
        text: `The browser reports ${camera.count} camera${camera.count === 1 ? "" : "s"}. Capture is not supported in this shell.`,
      };
    case "none":
      return {
        tag: <Tag tone="warning">None found</Tag>,
        text: "No camera reported by the browser. Connect one, then re-check.",
      };
    case "unsupported":
      return { tag: <Tag tone="warning">Unavailable</Tag>, text: camera.reason };
    case "error":
      return { tag: <Tag tone="warning">Unavailable</Tag>, text: camera.reason };
  }
}

const CAPABILITIES = [
  { label: "Liveness (PAD)", status: "pending" as const },
  { label: "Face recognition", status: "pending" as const },
  { label: "Depth analysis", status: "pending" as const },
  { label: "Policy evaluation", status: "simulated" as const },
];

export function SystemStatus({
  apiBase,
  apiSource,
  apiReady,
  camera,
  onRecheckCamera,
}: {
  apiBase: string;
  apiSource: ApiBaseSource;
  apiReady: boolean;
  camera: CameraAvailability;
  onRecheckCamera: () => void;
}) {
  const cam = cameraSummary(camera);
  return (
    <Panel
      id="status"
      eyebrow="System"
      title="System status"
      description="What this shell can confirm today. Nothing here is a live health check."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatusTile
          icon={Server}
          title="API service"
          state={
            !apiReady ? (
              <Tag>Checking</Tag>
            ) : apiBase ? (
              <Tag tone="warning">Not connected</Tag>
            ) : (
              <Tag tone="warning">Not configured</Tag>
            )
          }
        >
          {apiBase ? (
            <>
              <p className="truncate font-mono text-xs text-foreground" title={apiBase}>
                {apiBase}
              </p>
              <p className="mt-1">
                {apiSource === "env" ? "From environment. " : "Saved in this browser. "}
                No requests are sent until routes are wired from docs/API.md.
              </p>
            </>
          ) : (
            <p>No API address set. Health can't be shown until the backend is wired.</p>
          )}
          <Link
            to="/setup"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {apiBase ? "Change API address" : "Set API address"}
          </Link>
        </StatusTile>

        <StatusTile icon={Camera} title="Camera" state={cam.tag}>
          <p aria-live="polite">{cam.text}</p>
          <Button
            variant="link"
            size="sm"
            className="mt-1 h-auto px-0"
            onClick={onRecheckCamera}
            disabled={camera.status === "checking"}
          >
            <RefreshCw aria-hidden />
            Re-check camera
          </Button>
        </StatusTile>

        <StatusTile
          icon={SlidersHorizontal}
          title="Registered calibrations"
          state={<Tag tone="warning">Unavailable</Tag>}
        >
          <p className="font-display text-2xl font-semibold text-foreground" aria-label="Count unknown">
            —
          </p>
          <p className="mt-1">The calibration registry lives in the backend. Count appears once wired.</p>
        </StatusTile>

        <StatusTile icon={Cpu} title="Biometric capabilities" state={<Tag tone="warning">Limited</Tag>}>
          <ul className="flex flex-col gap-2">
            {CAPABILITIES.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-foreground">{c.label}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </StatusTile>
      </div>
    </Panel>
  );
}
