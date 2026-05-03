import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Database,
  Settings2,
} from "lucide-react";
import { Button } from "../components/Button";
import { cn } from "../lib/utils";

const SDK_KEY_PREFIXES = ["CXGAIA", "survey-"];

type StorageEntry = {
  key: string;
  raw: string;
  parsed: unknown;
  size: number;
};

function isSdkKey(key: string): boolean {
  return SDK_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function readSdkLocalStorage(): StorageEntry[] {
  const entries: StorageEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isSdkKey(key)) continue;
    const raw = localStorage.getItem(key) ?? "";
    let parsed: unknown = raw;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // keep as raw string
    }
    entries.push({ key, raw, parsed, size: new Blob([raw]).size });
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

function maskApiKey(value: string): string {
  return value.replace(
    /(["']?apiKey["']?\s*:\s*["'])([^"']{4})[^"']*([^"']{4})(["'])/g,
    "$1$2…$3$4",
  );
}

export function SessionManager() {
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [sessionConfig, setSessionConfig] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setEntries(readSdkLocalStorage());
    const raw = sessionStorage.getItem("embeddedsurvey-config");
    setSessionConfig(raw);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    refresh();
  };

  const handleClearAll = () => {
    entries.forEach((e) => localStorage.removeItem(e.key));
    refresh();
  };

  const totalSize = entries.reduce((sum, e) => sum + e.size, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Session Manager</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Inspect and manage SDK-owned localStorage keys and the active session
          configuration.
        </p>
      </div>

      {/* Active Session Config */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Active Session Config
            <span className="text-xs text-muted-foreground font-normal">
              (sessionStorage · API key masked)
            </span>
          </h2>
        </div>

        {sessionConfig ? (
          <div className="relative rounded-lg border border-border bg-muted/30">
            <pre className="text-xs p-3 overflow-x-auto max-h-48 overflow-y-auto">
              {maskApiKey(sessionConfig)}
            </pre>
            <button
              onClick={() =>
                handleCopy("session-config", maskApiKey(sessionConfig))
              }
              className="absolute top-2 right-2 p-1.5 rounded bg-background/80 border border-border hover:bg-background"
              title="Copy (API key masked)"
            >
              {copiedKey === "session-config" ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No session configured. Return to the landing page to set up.
          </p>
        )}
      </section>

      {/* SDK localStorage Keys */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold">SDK localStorage Keys</h2>
            {entries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {entries.length} key{entries.length > 1 ? "s" : ""} ·{" "}
                {(totalSize / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={refresh} title="Refresh">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            {entries.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Clear All SDK Data
              </Button>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
            No SDK localStorage keys found.
            <br />
            Initialize the SDK and trigger a survey event to populate data.
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.key}
                className="rounded-lg border border-border bg-card"
              >
                {/* Row header */}
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() =>
                    setExpandedKey(expandedKey === entry.key ? null : entry.key)
                  }
                >
                  <span className="font-mono text-xs font-semibold text-primary flex-1 truncate">
                    {entry.key}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {entry.size} B
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(entry.key, entry.raw);
                    }}
                    className="p-1 rounded hover:bg-muted"
                    title="Copy value"
                  >
                    {copiedKey === entry.key ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.key);
                    }}
                    className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    title="Delete key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expanded value */}
                {expandedKey === entry.key && (
                  <div
                    className={cn(
                      "border-t border-border",
                      typeof entry.parsed === "object" && entry.parsed !== null
                        ? "bg-muted/20"
                        : "bg-muted/10",
                    )}
                  >
                    <pre className="text-xs p-3 overflow-x-auto max-h-64 overflow-y-auto">
                      {typeof entry.parsed === "object"
                        ? JSON.stringify(entry.parsed, null, 2)
                        : entry.raw}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
