import { useCallback, useEffect, useState } from "react";

export type CameraAvailability =
  | { status: "checking" }
  | { status: "unsupported"; reason: string }
  | { status: "none" }
  | { status: "detected"; count: number }
  | { status: "error"; reason: string };

/**
 * Asks the browser whether any video input exists. Does not request permission,
 * open a stream or capture frames.
 */
export function useCameraAvailability() {
  const [state, setState] = useState<CameraAvailability>({ status: "checking" });

  const check = useCallback(async () => {
    setState({ status: "checking" });
    if (!window.isSecureContext) {
      setState({ status: "unsupported", reason: "Camera access needs HTTPS or localhost." });
      return;
    }
    if (!navigator.mediaDevices?.enumerateDevices) {
      setState({ status: "unsupported", reason: "This browser doesn't expose camera devices." });
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const count = devices.filter((d) => d.kind === "videoinput").length;
      setState(count > 0 ? { status: "detected", count } : { status: "none" });
    } catch {
      setState({ status: "error", reason: "The browser couldn't list camera devices." });
    }
  }, []);

  useEffect(() => {
    void check();
    const md = navigator.mediaDevices;
    if (!md?.addEventListener) return;
    const onChange = () => void check();
    md.addEventListener("devicechange", onChange);
    return () => md.removeEventListener("devicechange", onChange);
  }, [check]);

  return { camera: state, recheck: check };
}
