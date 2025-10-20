import { useState, useEffect, useRef } from "react";
import {
  sdkMonitor,
  type SDKLog,
  type SDKEventType,
  type APICall,
} from "../lib/sdkMonitor";
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
  Network,
} from "lucide-react";
import { cn } from "../lib/utils";

type TabType = "console" | "network";

interface SDKDebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SDKDebugPanel = ({ isOpen, onClose }: SDKDebugPanelProps) => {
  const [logs, setLogs] = useState<SDKLog[]>([]);
  const [apiCalls, setApiCalls] = useState<APICall[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("console");
  const [filter, setFilter] = useState<SDKEventType | "all">("all");
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing logs and API calls
    setLogs(sdkMonitor.getLogs());
    setApiCalls(sdkMonitor.getAPICalls());

    // Subscribe to new logs
    const unsubscribe = sdkMonitor.subscribeToLogs((log) => {
      setLogs((prev) => [...prev, log]);

      // If it's an API call/response, refresh API calls list
      if (log.eventType === "api_call" || log.eventType === "api_response") {
        setApiCalls(sdkMonitor.getAPICalls());
      }
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
    setApiCalls([]);
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
        isMinimized ? "w-12 h-48" : "w-full md:w-[600px] lg:w-[800px] h-[700px]"
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
                ({filteredLogs.length} logs | {apiCalls.length} network)
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
          {/* Tabs */}
          <div className="flex border-b border-border bg-muted/10">
            <button
              onClick={() => setActiveTab("console")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2",
                activeTab === "console"
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              Console
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                {filteredLogs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("network")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors border-b-2",
                activeTab === "network"
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <Network className="w-3.5 h-3.5" />
              Network
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                {apiCalls.length}
              </span>
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/10">
            {activeTab === "console" && (
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
            )}

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

          {/* Content Area */}
          <div
            ref={scrollRef}
            className="h-[calc(100%-10rem)] overflow-y-auto font-mono text-xs p-2 bg-slate-950 text-slate-100"
          >
            {activeTab === "console" ? (
              // Console Logs
              filteredLogs.length === 0 ? (
                <div className="text-center text-slate-400 py-8">
                  No logs yet. SDK operations will appear here.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredLogs.map((log) => (
                    <LogEntry key={log.id} log={log} />
                  ))}
                </div>
              )
            ) : // Network Tab
            apiCalls.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No network requests yet. API calls will appear here.
              </div>
            ) : (
              <div className="space-y-2">
                {apiCalls.map((call) => (
                  <NetworkEntry key={call.id} call={call} />
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

const NetworkEntry = ({ call }: { call: APICall }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const time = new Date(call.timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  const getStatusColor = (status?: number) => {
    if (!status) return "text-slate-400";
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-blue-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    return "text-red-400";
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/20 text-blue-400",
      POST: "bg-green-500/20 text-green-400",
      PUT: "bg-orange-500/20 text-orange-400",
      DELETE: "bg-red-500/20 text-red-400",
      PATCH: "bg-purple-500/20 text-purple-400",
    };
    return colors[method] || "bg-slate-500/20 text-slate-400";
  };

  const hasHeaders =
    call.headers &&
    typeof call.headers === "object" &&
    !Array.isArray(call.headers) &&
    Object.keys(call.headers).length > 0;

  return (
    <div className="border border-slate-700 rounded bg-slate-900/50 p-2 hover:bg-slate-900">
      {/* Header Row */}
      <div className="flex items-start gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-0.5 text-slate-500 hover:text-slate-300"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
        <span className="text-slate-500 text-[10px] min-w-[80px]">{time}</span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase min-w-[60px] text-center",
            getMethodColor(call.method)
          )}
        >
          {call.method}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-mono min-w-[40px] text-center",
            getStatusColor(call.status)
          )}
        >
          {call.status || "..."}
        </span>
        <span className="flex-1 text-slate-300 truncate" title={call.url}>
          {new URL(call.url).pathname}
        </span>
        {call.duration && (
          <span className="text-slate-400 text-[10px] min-w-[50px] text-right">
            {call.duration}ms
          </span>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-2 space-y-2 text-[10px]">
          <div>
            <span className="text-slate-500">URL:</span>
            <div className="mt-1 p-1.5 bg-slate-950 rounded border border-slate-800 text-slate-300 break-all">
              {call.url}
            </div>
          </div>

          <>
            {hasHeaders ? (
              <div>
                <span className="text-slate-500">Headers:</span>
                <div className="mt-1 p-1.5 bg-slate-950 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                  <pre>{JSON.stringify(call.headers, null, 2)}</pre>
                </div>
              </div>
            ) : null}
          </>

          <>
            {call.body && (
              <div>
                <span className="text-slate-500">Request Body:</span>
                <div className="mt-1 p-1.5 bg-slate-950 rounded border border-slate-800 text-slate-300 overflow-x-auto">
                  <pre>
                    {typeof call.body === "string"
                      ? call.body
                      : JSON.stringify(call.body, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </>

          <>
            {call.response && (
              <div>
                <span className="text-slate-500">Response:</span>
                <div className="mt-1 p-1.5 bg-slate-950 rounded border border-slate-800 text-slate-300 overflow-x-auto max-h-48 overflow-y-auto">
                  <pre>
                    {typeof call.response === "string"
                      ? call.response
                      : JSON.stringify(call.response, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </>

          <>
            {call.error && (
              <div>
                <span className="text-red-400">Error:</span>
                <div className="mt-1 p-1.5 bg-red-950/20 rounded border border-red-900/50 text-red-300">
                  {call.error}
                </div>
              </div>
            )}
          </>
        </div>
      )}
    </div>
  );
};
