import { useState, useEffect, useRef } from "react";
import { sdkMonitor, type SDKLog, type SDKEventType } from "../lib/sdkMonitor";
import { Button } from "./Button";
import {
  X,
  Download,
  Trash2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SDKDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SDKDebugPanel = ({ isOpen, onClose }: SDKDebugPanelProps) => {
  const [logs, setLogs] = useState<SDKLog[]>([]);
  const [filter, setFilter] = useState<SDKEventType | "all">("all");
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing logs
    setLogs(sdkMonitor.getLogs());

    // Subscribe to new logs
    const unsubscribe = sdkMonitor.subscribeToLogs((log) => {
      setLogs((prev) => [...prev, log]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.eventType === filter);

  const handleClear = () => {
    sdkMonitor.clearLogs();
    setLogs([]);
  };

  const handleExport = () => {
    const data = sdkMonitor.exportLogs();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sdk-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-background border-r border-t border-b border-border shadow-2xl transition-all duration-300",
        isMinimized ? "w-12 h-48" : "w-full md:w-[600px] lg:w-[800px] h-[500px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-border bg-muted/30",
          isMinimized ? "h-full flex-col py-3 px-0" : "p-3 flex-row"
        )}
      >
        {isMinimized ? (
          // Minimized vertical tab
          <>
            <div className="flex flex-col items-center gap-3 flex-1 justify-center">
              <Terminal className="w-4 h-4 text-primary" />
              <div className="flex flex-col items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  title="Maximize"
                  className="p-1"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  title="Close"
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Full header
          <>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">SDK Debug Console</h3>
              <span className="text-xs text-muted-foreground">
                ({filteredLogs.length} logs)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} title="Close">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {!isMinimized && (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/10">
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as SDKEventType | "all")
              }
              className="text-xs px-2 py-1 rounded border border-border bg-background"
            >
              <option value="all">All Events</option>
              <option value="initialization">Initialization</option>
              <option value="api_call">API Calls</option>
              <option value="api_response">API Responses</option>
              <option value="event_triggered">Events Triggered</option>
              <option value="survey_display">Survey Display</option>
              <option value="storage_operation">Storage</option>
              <option value="url_match">URL Matching</option>
              <option value="error">Errors</option>
              <option value="general">General</option>
            </select>

            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="w-3 h-3"
              />
              Auto-scroll
            </label>

            <div className="ml-auto flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                title="Clear logs"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                title="Export logs"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Logs */}
          <div
            ref={scrollRef}
            className="h-[calc(100%-8rem)] overflow-y-auto font-mono text-xs p-2 bg-slate-950 text-slate-100"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No logs yet. SDK operations will appear here.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLogs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const LogEntry = ({ log }: { log: SDKLog }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = log.details !== undefined || log.raw !== undefined;

  const levelColors: Record<string, string> = {
    debug: "text-slate-400",
    log: "text-slate-300",
    info: "text-blue-400",
    warn: "text-yellow-400",
    error: "text-red-400",
  };

  const eventTypeColors: Record<SDKEventType, string> = {
    initialization: "bg-green-500/20 text-green-400",
    api_call: "bg-blue-500/20 text-blue-400",
    api_response: "bg-cyan-500/20 text-cyan-400",
    event_triggered: "bg-purple-500/20 text-purple-400",
    survey_display: "bg-pink-500/20 text-pink-400",
    survey_hidden: "bg-gray-500/20 text-gray-400",
    error: "bg-red-500/20 text-red-400",
    storage_operation: "bg-orange-500/20 text-orange-400",
    url_match: "bg-teal-500/20 text-teal-400",
    general: "bg-slate-500/20 text-slate-400",
  };

  const time = new Date(log.timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  return (
    <div className="border-l-2 border-slate-700 pl-2 hover:bg-slate-900/50">
      <div className="flex items-start gap-2">
        {hasDetails && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-slate-500 hover:text-slate-300"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        <span className="text-slate-500 text-[10px] min-w-[80px]">{time}</span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase min-w-[80px] text-center",
            eventTypeColors[log.eventType]
          )}
        >
          {log.eventType}
        </span>
        <span className={cn("flex-1", levelColors[log.level])}>
          {log.emoji && <span className="mr-1">{log.emoji}</span>}
          {log.message}
        </span>
      </div>

      {isExpanded && hasDetails && (
        <div className="mt-1 ml-6 p-2 bg-slate-900 rounded border border-slate-700 text-slate-300 overflow-x-auto">
          <pre className="text-[10px]">
            {JSON.stringify(log.details || log.raw, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
