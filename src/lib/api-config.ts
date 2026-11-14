import { useCallback, useEffect, useState } from "react";

export const API_BASE_STORAGE_KEY = "trivera.apiBase";
const CHANGE_EVENT = "trivera:api-base-change";

export type ApiBaseResult = { ok: true; value: string } | { ok: false; error: string };

/** Validates a user-entered API base. Empty input clears it. Trailing slashes are removed. */
export function normalizeApiBase(input: string): ApiBaseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: true, value: "" };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false, error: "Enter a full address starting with http:// or https://" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Use an http:// or https:// address." };
  }
  return { ok: true, value: url.toString().replace(/\/+$/, "") };
}

const ENV_DEFAULT = ((import.meta.env["VITE_TRIVERA_API_BASE"] as string | undefined) ?? "").trim();

export type ApiBaseSource = "saved" | "env" | "none";

export function useApiBase() {
  const [state, setState] = useState<{ value: string; source: ApiBaseSource; ready: boolean }>({
    value: "",
    source: "none",
    ready: false,
  });

  const read = useCallback(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(API_BASE_STORAGE_KEY);
    } catch {
      saved = null;
    }
    if (saved) setState({ value: saved, source: "saved", ready: true });
    else if (ENV_DEFAULT) {
      const env = normalizeApiBase(ENV_DEFAULT);
      setState({ value: env.ok ? env.value : "", source: env.ok ? "env" : "none", ready: true });
    } else setState({ value: "", source: "none", ready: true });
  }, []);

  useEffect(() => {
    read();
    const onChange = () => read();
    window.addEventListener("storage", onChange);
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(CHANGE_EVENT, onChange);
    };
  }, [read]);

  const save = useCallback((value: string) => {
    try {
      if (value) window.localStorage.setItem(API_BASE_STORAGE_KEY, value);
      else window.localStorage.removeItem(API_BASE_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { apiBase: state.value, source: state.source, ready: state.ready, save, envDefault: ENV_DEFAULT };
}
