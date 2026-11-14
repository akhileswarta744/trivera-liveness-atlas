import { Link } from "@tanstack/react-router";
import { AlertTriangle, Aperture, ScanFace } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CameraAvailability } from "@/hooks/use-camera-availability";
import { Panel } from "./Panel";
import { Tag } from "./StatusBadge";
import { cameraSummary } from "./SystemStatus";

export function AuthDemo({
  camera,
  onChooseScenario,
}: {
  camera: CameraAvailability;
  onChooseScenario: () => void;
}) {
  const cam = cameraSummary(camera);
  return (
    <Panel
      id="authenticate"
      eyebrow="Authentication demo"
      title="Capture evidence"
      description="Live capture and API integration are pending. Use a simulated scenario to explore decisions."
      actions={<Tag tone="warning">Capture pending</Tag>}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div
          className="demo-hatch relative grid aspect-video place-items-center overflow-hidden rounded-xl border-2 border-dashed border-input bg-muted text-muted-foreground"
          role="img"
          aria-label="Camera preview area. Live capture is not available in this shell."
        >
          <div className="flex flex-col items-center gap-2 px-6 text-center">
            <ScanFace aria-hidden className="size-10 text-primary/70" strokeWidth={1.5} />
            <p className="text-sm font-medium text-foreground">Live capture pending</p>
            <p className="text-xs">No frames are captured or sent.</p>
          </div>
          <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs">
            Camera: {cam.tag}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <Button
              size="lg"
              disabled
              aria-describedby="capture-unavailable"
              className="w-full"
            >
              <Aperture aria-hidden />
              Capture
            </Button>
            <p id="capture-unavailable" className="mt-2 text-xs text-muted-foreground">
              Capture isn't supported in this shell. It needs the backend capture contract from
              docs/API.md.
            </p>
          </div>

          <div
            role="status"
            className="rounded-xl border border-warning/45 bg-warning-soft p-4 text-sm text-warning-strong"
          >
            <p className="flex items-center gap-2 font-semibold">
              <AlertTriangle aria-hidden className="size-4 shrink-0" />
              Evidence unavailable
            </p>
            <p className="mt-1">No evidence has been captured, so no decision can be made. You can:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>pick a simulated scenario to see how the decision panel will look,</li>
              <li>set the API address so it's ready when the backend lands.</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={onChooseScenario}>
                Choose a scenario
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/setup">Open setup</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
