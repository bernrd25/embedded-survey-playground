import { useState, useEffect } from "react";
import { sdkMonitor, type SDKLog } from "../lib/sdkMonitor";
import type { MockResponse } from "../lib/sdkMonitor";
import { Button } from "../components/Button";
import { AlertCircle, Trash2, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";

type Scenario = {
  label: string;
  description: string;
  icon: string;
  colorClass: string;
  mock: MockResponse;
};

const SCENARIOS: Scenario[] = [
  {
    label: "401 Unauthorized",
    description: "SDK receives an auth failure — tests re-auth / graceful fail",
    icon: "🔐",
    colorClass: "border-yellow-500/40 hover:border-yellow-500",
    mock: {
      kind: "response",
      status: 401,
      body: { error: "Unauthorized", message: "Invalid or expired API key" },
      label: "401 Unauthorized",
    },
  },
  {
    label: "403 Forbidden",
    description: "SDK is authenticated but denied access",
    icon: "🚫",
    colorClass: "border-orange-500/40 hover:border-orange-500",
    mock: {
      kind: "response",
      status: 403,
      body: { error: "Forbidden", message: "Access denied for this resource" },
      label: "403 Forbidden",
    },
  },
  {
    label: "404 Not Found",
    description: "Survey config not found for this API key",
    icon: "🔍",
    colorClass: "border-blue-500/40 hover:border-blue-500",
    mock: {
      kind: "response",
      status: 404,
      body: { error: "Not Found", message: "No survey configuration found" },
      label: "404 Not Found",
    },
  },
  {
    label: "500 Server Error",
    description: "Backend is down — tests SDK resilience",
    icon: "💥",
    colorClass: "border-red-500/40 hover:border-red-500",
    mock: {
      kind: "response",
      status: 500,
      body: { error: "Internal Server Error", message: "Service unavailable" },
      label: "500 Server Error",
    },
  },
  {
    label: "Network Error",
    description: "Fetch throws a TypeError — simulates offline / DNS failure",
    icon: "📡",
    colorClass: "border-red-700/40 hover:border-red-700",
    mock: {
      kind: "error",
      message: "Failed to fetch (simulated network error)",
      label: "Network Error",
    },
  },
  {
    label: "Empty Response",
    description: "200 OK but empty body — tests empty config handling",
    icon: "📭",
    colorClass: "border-slate-500/40 hover:border-slate-500",
    mock: {
      kind: "response",
      status: 200,
      body: {},
      label: "Empty Response",
    },
  },
];

export function ErrorSimulator() {
  const [queueLength, setQueueLength] = useState(0);
  const [recentLogs, setRecentLogs] = useState<SDKLog[]>([]);
  const [triggeredScenario, setTriggeredScenario] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const existing = sdkMonitor
      .getLogs()
      .filter(
        (l) =>
          l.message.includes("[MOCKED]") ||
          l.eventType === "error" ||
          l.eventType === "api_response",
      )
      .slice(-20);
    setRecentLogs(existing);

    const unsubscribe = sdkMonitor.subscribeToLogs((log) => {
      if (
        log.message.includes("[MOCKED]") ||
        log.eventType === "error" ||
        log.eventType === "api_response"
      ) {
        setRecentLogs((prev) => [...prev.slice(-19), log]);
      }
    });

    return unsubscribe;
  }, []);

  const handleQueueScenario = (scenario: Scenario) => {
    sdkMonitor.queueMock(scenario.mock);
    setQueueLength(sdkMonitor.getMockQueueLength());
    setTriggeredScenario(scenario.label);
    setTimeout(() => setTriggeredScenario(null), 1500);
  };

  const handleClearQueue = () => {
    sdkMonitor.clearMocks();
    setQueueLength(0);
  };

  const levelColor: Record<string, string> = {
    error: "text-red-400",
    warn: "text-yellow-400",
    info: "text-blue-400",
    log: "text-slate-300",
    debug: "text-slate-500",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h1 className="text-2xl font-bold">Error Scenario Simulator</h1>
          {queueLength > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
              {queueLength} mock{queueLength > 1 ? "s" : ""} queued
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Queue a mock response for the next SDK API call. Trigger an SDK action
          (navigation, scroll, etc.) to consume it.
        </p>
      </div>

      {/* Queue status bar */}
      {queueLength > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <WifiOff className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive flex-1">
            <strong>
              {queueLength} mock response{queueLength > 1 ? "s" : ""}
            </strong>{" "}
            waiting — trigger any SDK action to consume{" "}
            {queueLength > 1 ? "them" : "it"}.
          </p>
          <Button size="sm" variant="outline" onClick={handleClearQueue}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Queue
          </Button>
        </div>
      )}

      {queueLength === 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
          <Wifi className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-sm text-muted-foreground">
            No mocks queued — SDK will make real API calls.
          </p>
        </div>
      )}

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.label}
            onClick={() => handleQueueScenario(scenario)}
            className={cn(
              "text-left p-4 rounded-lg border-2 bg-card transition-all duration-150 space-y-2 group",
              scenario.colorClass,
              triggeredScenario === scenario.label &&
                "ring-2 ring-primary scale-95",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{scenario.icon}</span>
              <span className="font-semibold text-sm">{scenario.label}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {scenario.description}
            </p>
            <div className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Click to queue →
            </div>
          </button>
        ))}
      </div>

      {/* Live Response Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            SDK Response Log
            <span className="text-xs text-muted-foreground font-normal">
              (mocked + error responses)
            </span>
          </h2>
        </div>

        <div className="rounded-lg border border-border bg-slate-950 font-mono text-xs p-3 min-h-[140px] max-h-72 overflow-y-auto space-y-1">
          {recentLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">
              Queue a scenario, then trigger an SDK action to see responses
              here.
            </p>
          ) : (
            recentLogs.map((log) => {
              const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              return (
                <div key={log.id} className="flex gap-2">
                  <span className="text-slate-500 shrink-0">{time}</span>
                  <span
                    className={cn(
                      "flex-1",
                      levelColor[log.level] ?? "text-slate-300",
                      log.message.includes("[MOCKED]") && "italic",
                    )}
                  >
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
