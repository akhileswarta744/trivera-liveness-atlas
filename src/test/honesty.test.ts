import { describe, expect, it } from "vitest";

import { normalizeApiBase } from "@/lib/api-config";
import { CHALLENGE_CHECKLIST } from "@/lib/trivera-data";

const status = (id: string) => CHALLENGE_CHECKLIST.find((i) => i.id === id)?.status;

describe("challenge checklist reflects M0 state", () => {
  it("marks every spoof type as simulated, not implemented", () => {
    for (const id of ["spoof-printed", "spoof-screen", "spoof-replay", "spoof-mask"]) {
      expect(status(id)).toBe("simulated");
    }
  });

  it("keeps liveness, face recognition, depth and capture pending", () => {
    for (const id of ["pad", "face-recognition", "depth", "camera-capture"]) {
      expect(status(id)).toBe("pending");
    }
  });

  it("treats the under-two-second target as unmeasured", () => {
    expect(status("timing")).toBe("unmeasured");
    expect(status("accuracy")).toBe("unmeasured");
  });
});

describe("API base address", () => {
  it("strips trailing slashes", () => {
    expect(normalizeApiBase("http://localhost:8000/")).toEqual({
      ok: true,
      value: "http://localhost:8000",
    });
  });

  it("rejects non-http addresses", () => {
    expect(normalizeApiBase("ftp://example.com").ok).toBe(false);
    expect(normalizeApiBase("localhost:8000").ok).toBe(false);
  });

  it("treats empty input as cleared", () => {
    expect(normalizeApiBase("   ")).toEqual({ ok: true, value: "" });
  });
});
