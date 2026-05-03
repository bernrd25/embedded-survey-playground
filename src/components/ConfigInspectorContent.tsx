import {
  Check,
  AlertCircle,
  Copy,
  Download,
  Eye,
  EyeOff,
  RefreshCcw,
  Zap,
  ArrowDown,
  LogOut,
  Clock,
  MousePointerClick,
} from "lucide-react";
import { Label } from "./Label";
import { Separator } from "./Seperator";
import { Progress } from "./Progress";
import { extractActiveEventPerPath } from "../lib/extractActiveEventPerPath";
import type { Config } from "../store";

interface ConfigInspectorContentProps {
  info: Config[] | null;
  validationErrors: string[];
  showRawJSON: boolean;
  setShowRawJSON: (v: boolean) => void;
  copiedSection: string | null;
  copyToClipboard: (text: string, section: string) => void;
  downloadConfig: (config: Config[]) => void;
  handleSetInfo: () => void;
  activeTriggers: Set<string>;
  scrollDepth: number;
  scrollMilestones: number[];
  cursorY: number;
  exitAttempts: number;
  isIdle: boolean;
  idleTime: number;
  idleThreshold: number;
  triggerScrollDepth: (depth: number) => void;
  triggerClick: (selector: string) => void;
  triggerExitIntent: () => void;
  triggerIdle: () => void;
  triggerPageView: () => void;
}

export function ConfigInspectorContent({
  info,
  validationErrors,
  showRawJSON,
  setShowRawJSON,
  copiedSection,
  copyToClipboard,
  downloadConfig,
  handleSetInfo,
  activeTriggers,
  scrollDepth,
  scrollMilestones,
  cursorY,
  exitAttempts,
  isIdle,
  idleTime,
  idleThreshold,
  triggerScrollDepth,
  triggerClick,
  triggerExitIntent,
  triggerIdle,
  triggerPageView,
}: ConfigInspectorContentProps) {
  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h4 className="leading-none font-medium">Config Inspector</h4>
            {validationErrors.length === 0 ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-destructive" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawJSON(!showRawJSON)}
              className="text-muted-foreground hover:text-primary transition-colors"
              title={showRawJSON ? "Hide JSON" : "Show JSON"}
            >
              {showRawJSON ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <RefreshCcw
              className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer"
              onClick={handleSetInfo}
            />
          </div>
        </div>

        <p className="text-muted-foreground text-sm">
          Real-time configuration preview and validation
        </p>

        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded p-2 space-y-1">
            <Label className="text-destructive text-xs font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Validation Issues ({validationErrors.length})
            </Label>
            {validationErrors.map((error, idx) => (
              <p key={idx} className="text-destructive text-xs pl-4">
                • {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Config Content */}
      <div className="grid gap-2">
        {info && info.length > 0 ? (
          showRawJSON ? (
            <div className="relative">
              <pre className="bg-muted/50 rounded p-3 text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(info, null, 2)}
              </pre>
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(info, null, 2), "json")
                  }
                  className="bg-background/90 hover:bg-background border rounded p-1.5 transition-colors"
                  title="Copy JSON"
                >
                  {copiedSection === "json" ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={() => downloadConfig(info)}
                  className="bg-background/90 hover:bg-background border rounded p-1.5 transition-colors"
                  title="Download JSON"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            info.map((item, index: number) => {
              const activeEvents = extractActiveEventPerPath(item);
              const configId = `config-${index}`;

              return (
                <div
                  key={index}
                  className="grid gap-2 border rounded-lg p-3 bg-muted/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Label className="font-medium text-sm">
                      Config #{index + 1}
                    </Label>
                    <button
                      onClick={() =>
                        copyToClipboard(JSON.stringify(item, null, 2), configId)
                      }
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Copy Config"
                    >
                      {copiedSection === configId ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 items-center gap-2 text-xs">
                    <Label className="text-muted-foreground">ID:</Label>
                    <Label className="truncate font-mono">
                      {item.id || "N/A"}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2 text-xs">
                    <Label className="text-muted-foreground">Session ID:</Label>
                    <Label className="truncate font-mono">
                      {item.sessionId}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2 text-xs">
                    <Label className="text-muted-foreground">
                      Already Displayed:
                    </Label>
                    <Label className={item.display ? "text-green-600" : ""}>
                      {item.display ? "Yes" : "No"}
                    </Label>
                  </div>

                  <Separator className="my-1" />

                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium text-xs">
                        Active Events ({activeEvents.length})
                      </Label>
                      {activeEvents.length > 0 && (
                        <button
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(activeEvents, null, 2),
                              `events-${index}`,
                            )
                          }
                          className="text-muted-foreground hover:text-primary transition-colors"
                          title="Copy Events"
                        >
                          {copiedSection === `events-${index}` ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {activeEvents.length === 0 ? (
                      <div className="bg-muted rounded p-2 text-center">
                        <Label className="text-muted-foreground text-xs">
                          No events active for current path
                        </Label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {activeEvents.map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="border bg-background rounded p-2 space-y-1.5"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <Label className="font-medium text-xs flex-1">
                                {event.name}
                              </Label>
                              <Label className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                                {event.trigger}
                              </Label>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                              <span>
                                Mode:{" "}
                                <span className="text-foreground">
                                  {event.mode}
                                </span>
                              </span>
                              <span>
                                Delay:{" "}
                                <span className="text-foreground">
                                  {event.displayDelay}
                                </span>
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Display:{" "}
                              <span className="text-foreground">
                                {event.displayPercentage}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Label className="text-muted-foreground text-xs italic">
                      * Path: {item.message}
                    </Label>
                  </div>

                  {index < info.length - 1 && <Separator className="my-2" />}
                </div>
              );
            })
          )
        ) : (
          <div className="text-center py-8">
            <Label className="text-muted-foreground text-sm">
              No configuration loaded
            </Label>
          </div>
        )}
      </div>

      {/* Live Trigger Monitors */}
      {info && info.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <Label className="font-medium text-xs">
                Live Trigger Monitors
              </Label>
            </div>

            {activeTriggers.has("scrollDepth") && (
              <div className="border rounded p-2 space-y-1.5 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ArrowDown className="w-3 h-3 text-blue-600" />
                    <Label className="text-xs font-medium">
                      Scroll {scrollDepth}%
                    </Label>
                  </div>
                  <div className="flex gap-0.5">
                    {[25, 50, 75, 100].map((milestone) => (
                      <button
                        key={milestone}
                        onClick={() => triggerScrollDepth(milestone)}
                        className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                          scrollMilestones.includes(milestone)
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground hover:bg-blue-500/20"
                        }`}
                      >
                        {milestone}%
                      </button>
                    ))}
                  </div>
                </div>
                <Progress value={scrollDepth} className="h-1" />
              </div>
            )}

            {activeTriggers.has("exitIntent") && (
              <div className="border rounded p-2 space-y-1.5 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <LogOut className="w-3 h-3 text-red-600" />
                    <Label className="text-xs font-medium">Exit Intent</Label>
                  </div>
                  <button
                    onClick={triggerExitIntent}
                    className="px-1.5 py-0.5 text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded transition-colors"
                  >
                    Trigger
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Cursor Y
                    </div>
                    <div className="font-mono font-bold text-sm">
                      {cursorY}px
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Attempts
                    </div>
                    <div className="font-bold text-red-600 text-sm">
                      {exitAttempts}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground">
                      Status
                    </div>
                    <div
                      className={`text-[10px] font-medium ${
                        cursorY < 50
                          ? "text-red-700 dark:text-red-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {cursorY < 50 ? "⚠️ Exit" : "Ready"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTriggers.has("idle") || activeTriggers.has("idleTime")) && (
              <div className="border rounded p-2 space-y-1.5 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <Label className="text-xs font-medium">
                      Idle {Math.max(0, idleThreshold - idleTime)}s
                    </Label>
                  </div>
                  <button
                    onClick={triggerIdle}
                    className="px-1.5 py-0.5 text-[10px] bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded transition-colors"
                  >
                    Trigger
                  </button>
                </div>
                <Progress
                  value={Math.min((idleTime / idleThreshold) * 100, 100)}
                  className={`h-1 ${
                    isIdle ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"
                  }`}
                />
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isIdle ? "bg-red-600" : "bg-green-600"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isIdle ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isIdle ? "IDLE" : "ACTIVE"}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {Math.round((idleTime / idleThreshold) * 100)}%
                  </span>
                </div>
              </div>
            )}

            {(activeTriggers.has("click") ||
              activeTriggers.has("pageView")) && (
              <div className="grid grid-cols-2 gap-2">
                {activeTriggers.has("click") && (
                  <div className="border rounded p-2 bg-card space-y-1">
                    <div className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3 text-green-600" />
                      <Label className="text-xs font-medium">Click</Label>
                    </div>
                    <input
                      type="text"
                      placeholder="CSS selector"
                      className="w-full px-1.5 py-1 text-[10px] border rounded bg-background"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const selector = e.currentTarget.value.trim();
                          if (selector) {
                            triggerClick(selector);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {activeTriggers.has("pageView") && (
                  <div className="border rounded p-2 bg-card space-y-1">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-purple-600" />
                      <Label className="text-xs font-medium">Page View</Label>
                    </div>
                    <button
                      onClick={triggerPageView}
                      className="w-full px-1.5 py-1 text-[10px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded transition-colors"
                    >
                      Trigger
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTriggers.size === 0 && (
              <div className="text-center py-4 border rounded bg-muted/30">
                <Label className="text-xs text-muted-foreground">
                  No trigger events configured
                </Label>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
