import { Ban, Info } from "lucide-react";

import { DECISION_TIME_TARGET_SECONDS, LIMITATIONS, NOT_SHOWN_ON_PURPOSE } from "@/lib/trivera-data";
import { Panel } from "./Panel";

export function Limitations() {
  return (
    <Panel
      id="limitations"
      eyebrow="Accuracy & limitations"
      title="What this prototype can't do yet"
      description="Read this before presenting. The backend is an M0 foundation."
    >
      <ul className="flex flex-col gap-2.5">
        {LIMITATIONS.map((l) => (
          <li key={l} className="flex gap-2.5 text-sm text-foreground">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{l}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border bg-muted/60 p-4">
        <h3 className="text-sm font-semibold text-foreground">Not shown, on purpose</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {NOT_SHOWN_ON_PURPOSE.map((n) => (
            <li
              key={n}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground"
            >
              <Ban aria-hidden className="size-3.5" />
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {DECISION_TIME_TARGET_SECONDS} seconds is a target. It stays a target until it's measured on
          the real pipeline.
        </p>
      </div>
    </Panel>
  );
}
