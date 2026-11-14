# Trivera — face liveness & authentication prototype (frontend shell)

Frontend shell for the HID Hackathon liveness challenge. The M0 backend evaluates synthetic
evidence summaries only; this shell makes **no API calls** and shows no real detection results.

## Run locally

```sh
bun install        # or: npm install
bun run dev        # or: npm run dev
bun run test       # unit tests for filter rules and status labels
```

Optional default API address (can also be set on the Setup page, saved per browser):

```sh
# .env
VITE_TRIVERA_API_BASE=http://localhost:8000
```

## Wiring the API (pending)

Exact routes and schemas are intentionally not guessed. Once the backend and `docs/API.md`
exist, wire: service health + calibrations (System status), scenario list/run (Scenarios),
verdict + reasons + gates + policy version + metadata (Decision result), records by mode
(History), and a capture contract (Authentication demo). Static project state lives in
`src/lib/trivera-data.ts`; the API base is read via `useApiBase()` in `src/lib/api-config.ts`.

## Challenge status

| Feature | Status |
| --- | --- |
| Dashboard shell, scenario selection, filters | Implemented |
| Printed photo / screen / replay / mask | Simulated |
| ALLOW / VERIFY / DENY decision, fallback handling | Simulated (illustrative) |
| API integration, live camera capture | Pending |
| Liveness (PAD), face recognition, depth analysis | Pending |
| Decision under 2 s, accuracy | Unmeasured |
