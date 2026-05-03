import { useEffect, useState } from "react";
import { sdkMonitor, type SDKLog } from "../lib/sdkMonitor";
import { cn } from "../lib/utils";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "./Button";

type TimelineEvent = SDKLog & {
  relativeMs: number;
};

const EVENT_TYPE_STYLE: Record<string, { bg: string; label: string }> = {
  initialization: { bg: "bg-green-500", label: "Init" },
  api_call: { bg: "bg-blue-500", label: "API" },
  api_response: { bg: "bg-cyan-500", label: "Resp" },
  event_triggered: { bg: "bg-purple-500", label: "Trigger" },
  survey_display: { bg: "bg-pink-500", label: "Display" },
  survey_hidden: { bg: "bg-gray-400", label: "Hidden" },
  error: { bg: "bg-red-500", label: "Error" },
  storage_operation: { bg: "bg-orange-400", label: "Storage" },
  url_match: { bg: "bg-teal-500", label: "URL" },
  general: { bg: "bg-slate-400", label: "General" },
};

export function TriggerEventTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const existing = sdkMonitor.getLogs().map((log) => ({
      ...log,
      relativeMs: log.timestamp - startTime,
    }));
    setEvents(existing);

    const unsubscribe = sdkMonitor.subscribeToLogs((log) => {
      setEvents((prev) => [
        ...prev,
        { ...log, relativeMs: log.timestamp - startTime },
      ]);
    });

    return unsubscribe;
  }, [startTime]);

  const handleClear = () => {
    const now = Date.now();
    setStartTime(now);
    setEvents([]);
  };

  if (events.length === 0) {
    return (
      <div className="w-full border-t border-border bg-muted/20 px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3.5 h-3.5" />
        <span>
          Trigger Event Timeline — no events yet. Interact with the page to see
          SDK events.
        </span>
      </div>
    );
  }

  // Time window: from first event to last event, min 5s window
  const firstTs = events[0].timestamp;
  const lastTs = events[events.length - 1].timestamp;
  const windowMs = Math.max(lastTs - firstTs, 5000);

  return (
    <div className="w-full border-t border-border bg-muted/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-primary" />
          Trigger Event Timeline
          <span className="text-muted-foreground font-normal">
            ({events.length} events · {(windowMs / 1000).toFixed(1)}s window)
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="Reset timeline"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Timeline track */}
      <div className="px-4 py-4 overflow-x-auto">
        <div className="relative min-w-full" style={{ minWidth: "600px" }}>
          {/* Track line */}
          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border" />

          {/* Events */}
          <div className="relative flex items-start" style={{ height: "60px" }}>
            {events.map((event, i) => {
              const pct = ((event.timestamp - firstTs) / windowMs) * 100;
              const style =
                EVENT_TYPE_STYLE[event.eventType] ?? EVENT_TYPE_STYLE.general;
              const isHovered = hoveredId === event.id;

              return (
                <div
                  key={event.id}
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                  onMouseEnter={() => setHoveredId(event.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 border-background transition-transform",
                      style.bg,
                      isHovered && "scale-150",
                    )}
                  />

                  {/* Label below every 3rd or hovered */}
                  {(isHovered || i % 3 === 0) && (
                    <span
                      className={cn(
                        "mt-1.5 text-[9px] font-medium whitespace-nowrap px-1 rounded",
                        style.bg,
                        "text-white",
                      )}
                    >
                      {style.label}
                    </span>
                  )}

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute top-6 z-50 min-w-[180px] bg-popover border border-border rounded shadow-lg p-2 text-[10px] space-y-0.5 pointer-events-none -translate-x-1/2 left-1/2">
                      <div className="font-semibold">{event.eventType}</div>
                      <div className="text-muted-foreground truncate max-w-[170px]">
                        {event.message}
                      </div>
                      <div className="text-muted-foreground">
                        +
                        {event.relativeMs >= 0
                          ? `${event.relativeMs}ms`
                          : "pre-start"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time labels */}
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
            <span>0s</span>
            <span>{(windowMs / 2000).toFixed(1)}s</span>
            <span>{(windowMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-3 text-[9px]">
        {Object.entries(EVENT_TYPE_STYLE).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", val.bg)} />
            {val.label}
          </span>
        ))}
      </div>
    </div>
  );
}
