# Embedded Survey Playground

A local developer tool for testing and debugging the **ConcentrixCX Embedded Survey SDK** across different environments, configurations, and trigger scenarios.

Live: [bernrd25.github.io/embedded-survey-playground](https://bernrd25.github.io/embedded-survey-playground/)

---

## Getting Started

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build
npm run preview    # preview production build locally
npm run deploy     # build + publish to GitHub Pages
```

---

## Setup

On first load, a **SDK Setup** dialog appears. Fill in:

| Field | Description |
|---|---|
| **Target API** | `Distribution API (v1)` or `Embedded Management API (v2)` |
| **Environment** | LOCAL / Dev / UAT / PROD — sets the CDN link automatically |
| **API Key** | Your SDK API key (stored in `localStorage`) |
| **Debug Mode** | Enables verbose SDK logging in the browser console |
| **Target Attributes** | Key/value pairs passed to the SDK (userId, region, etc.) |

Config is persisted to `localStorage` and restored on reload. Use **Profiles** to save and switch between multiple configurations. The **JSON** button lets you import/export the full config as JSON.

---

## Advanced Setup

The collapsible **Advanced Setup** panel (right column of the dialog) lets you open multiple sessions alongside the main playground tab when you click **Launch Playground**.

| Setting | Description |
|---|---|
| **Mode** | `Tabs` — new browser tabs sharing sessionStorage; `Windows` — sized popup windows; `Isolated` — independent storage per tab via URL param |
| **Target page** | Which playground route the extra sessions open to |
| **Count** | Number of extra sessions to open (0 = none, main tab only) |
| **Per-tab overrides** | Merge additional attributes on top of base config for each extra session |

Setting count to `0` (default) launches only the current tab with no extras.

---

## Playground Pages

| Route | Description |
|---|---|
| `/playground` | Main SDK sandbox |
| `/playground/dashboard` | Overview dashboard |
| `/playground/getting-started` | Onboarding guide |
| `/playground/templates/*` | Pre-built survey templates (Customer Feedback, Employee Survey, NPS, etc.) |
| `/playground/simulation` | Simulated embed environment |
| `/playground/embedded` | Full embedded mode |

### Trigger Tests

| Route | Description |
|---|---|
| `/playground/triggers/scroll-depth` | Fire survey at scroll depth % |
| `/playground/triggers/click-trigger` | Fire survey on element click |
| `/playground/triggers/exit-intent` | Fire survey on exit intent |
| `/playground/triggers/idle-detection` | Fire survey after user is idle |
| `/playground/triggers/page-view` | Fire survey on page view |

---

## Developer Tools

- **SDK Debug Panel** — real-time event log, SDK health badge, and config inspector
- **DevTools Drawer** — collapsible drawer with trigger event timeline and config diff
- **Command Palette** — quick navigation (`⌘K`)
- **Session Manager** — inspect and manage active SDK sessions
- **Error Simulator** — trigger SDK error states for testing

---

## Sharing a Config

The **Share** button (top bar) copies a `?session=` URL to clipboard. Opening that URL seeds sessionStorage automatically and redirects to the correct route — useful for sharing exact SDK states with teammates.

---

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Radix UI primitives
- React Hook Form + Zod
- Zustand
- React Router v7
- Sonner (toasts)
- Lucide icons
