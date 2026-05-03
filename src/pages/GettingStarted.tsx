import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { TRIGGER_ROUTES, MAIN_ROUTES } from "../routes";
import {
  Settings2,
  Zap,
  Bug,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "../lib/utils";

const STEPS = [
  {
    id: 1,
    icon: Settings2,
    title: "Configure the SDK",
    description:
      "The playground loads CX.Gaia directly from the Azure CDN. You only need an API key and the environment you want to test against.",
    items: [
      "Click the ⚙️ Settings button on the landing page",
      "Enter your API key (ask your team for a dev/uat key)",
      "Choose an environment: dev, uat, or prod",
      "Optionally set Target Attributes (userId, region, etc.)",
      "Click Save — you'll be redirected here automatically",
    ],
    action: null,
  },
  {
    id: 2,
    icon: Zap,
    title: "Test a Trigger",
    description:
      "CX.Gaia surveys appear based on trigger conditions. Pick a trigger type below and interact with the test page to fire it.",
    items: [
      "Scroll Depth — scroll down a long page to hit 25/50/75/100% milestones",
      "Click Trigger — click elements matching a CSS selector you specify",
      "Exit Intent — move your cursor to the top of the viewport",
      "Idle Detection — stop interacting for 10+ seconds",
      "Page View — navigate between sub-routes in the playground",
    ],
    action: {
      label: "Go to Trigger Tests",
      route: TRIGGER_ROUTES.SCROLL_DEPTH,
    },
  },
  {
    id: 3,
    icon: Bug,
    title: "Debug with the Tooling",
    description:
      "Once the SDK is initialized and a trigger fires, use the built-in debugging tools to inspect what happened.",
    items: [
      "Click the Terminal button (bottom-left) to open the Dev Tools drawer",
      "Console tab — real-time SDK logs + network requests",
      "Network tab → expand any row → copy as cURL to reproduce requests",
      "Errors tab — queue mock 401/500/network errors to test fallbacks",
      "Session tab — inspect all localStorage keys written by the SDK",
      "Share Session button (link icon in nav) — copy a URL to reproduce this exact config",
    ],
    action: null,
  },
];

export function GettingStarted() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const step = STEPS[activeStep];
  const StepIcon = step.icon;
  const isLast = activeStep === STEPS.length - 1;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Getting Started</h1>
        <p className="text-muted-foreground text-sm">
          Follow these 3 steps to start testing CX.Gaia embedded surveys.
        </p>
      </div>

      {/* Step pills */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(i)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                i === activeStep
                  ? "bg-primary text-primary-foreground border-primary"
                  : i < activeStep
                    ? "bg-green-500/10 text-green-600 border-green-500/30"
                    : "bg-muted text-muted-foreground border-border",
              )}
            >
              {i < activeStep ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <span className="w-3.5 h-3.5 flex items-center justify-center text-xs font-bold">
                  {s.id}
                </span>
              )}
              {s.title.split(" ").slice(0, 2).join(" ")}
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Active step card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 shrink-0">
            <StepIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              Step {step.id}: {step.title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {step.description}
            </p>
          </div>
        </div>

        <ul className="space-y-2.5">
          {step.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 pt-2">
          {step.action && (
            <Button
              onClick={() => navigate(step.action!.route)}
              variant="outline"
            >
              {step.action.label}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}

          {isLast ? (
            <Button onClick={() => navigate(MAIN_ROUTES.HOME)}>
              Go to Playground
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          ) : (
            <Button onClick={() => setActiveStep((s) => s + 1)}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </Button>
          )}

          {activeStep > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Scroll Depth", route: TRIGGER_ROUTES.SCROLL_DEPTH },
          { label: "Exit Intent", route: TRIGGER_ROUTES.EXIT_INTENT },
        ].map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.route)}
            className="p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/50 text-sm font-medium transition-colors text-left"
          >
            {link.label} →
          </button>
        ))}
      </div>
    </div>
  );
}
