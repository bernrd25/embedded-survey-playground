import { useState, useCallback } from "react";
import { GitCompare, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "../components/Button";
import { cn } from "../lib/utils";

type FlatDiff = {
  key: string;
  before: unknown;
  after: unknown;
  kind: "added" | "removed" | "changed" | "unchanged";
};

function flattenObj(obj: unknown, prefix = ""): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null)
    return { [prefix || "value"]: obj };
  return Object.entries(obj as Record<string, unknown>).reduce(
    (acc, [k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        Object.assign(acc, flattenObj(v, key));
      } else {
        acc[key] = v;
      }
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

function diffObjects(before: unknown, after: unknown): FlatDiff[] {
  const flatBefore = flattenObj(before);
  const flatAfter = flattenObj(after);
  const allKeys = new Set([
    ...Object.keys(flatBefore),
    ...Object.keys(flatAfter),
  ]);
  const diffs: FlatDiff[] = [];

  for (const key of allKeys) {
    const inBefore = key in flatBefore;
    const inAfter = key in flatAfter;

    if (!inBefore) {
      diffs.push({
        key,
        before: undefined,
        after: flatAfter[key],
        kind: "added",
      });
    } else if (!inAfter) {
      diffs.push({
        key,
        before: flatBefore[key],
        after: undefined,
        kind: "removed",
      });
    } else if (
      JSON.stringify(flatBefore[key]) !== JSON.stringify(flatAfter[key])
    ) {
      diffs.push({
        key,
        before: flatBefore[key],
        after: flatAfter[key],
        kind: "changed",
      });
    } else {
      diffs.push({
        key,
        before: flatBefore[key],
        after: flatAfter[key],
        kind: "unchanged",
      });
    }
  }

  return diffs.sort((a, b) => {
    const order = { changed: 0, added: 1, removed: 2, unchanged: 3 };
    return order[a.kind] - order[b.kind];
  });
}

function val(v: unknown): string {
  if (v === undefined) return "—";
  if (typeof v === "string") return `"${v}"`;
  return JSON.stringify(v);
}

const KIND_STYLE: Record<FlatDiff["kind"], string> = {
  changed: "bg-yellow-500/10 border-l-2 border-yellow-500",
  added: "bg-green-500/10 border-l-2 border-green-500",
  removed: "bg-red-500/10 border-l-2 border-red-500",
  unchanged: "",
};

const KIND_LABEL: Record<FlatDiff["kind"], string> = {
  changed: "text-yellow-600",
  added: "text-green-600",
  removed: "text-red-600",
  unchanged: "text-muted-foreground",
};

export function ConfigDiffPanel() {
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUnchanged, setShowUnchanged] = useState(false);

  const loadCurrent = useCallback(() => {
    const raw = sessionStorage.getItem("embeddedsurvey-config");
    return raw;
  }, []);

  const handleCaptureBefore = () => {
    const raw = loadCurrent();
    setSnapshot(raw);
    setCurrent(null);
  };

  const handleCaptureAfter = () => {
    const raw = loadCurrent();
    setCurrent(raw);
  };

  const handleCopyDiff = () => {
    if (!diff) return;
    const text = diff
      .filter((d) => d.kind !== "unchanged")
      .map(
        (d) =>
          `[${d.kind.toUpperCase()}] ${d.key}: ${val(d.before)} → ${val(d.after)}`,
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const beforeObj = snapshot ? JSON.parse(snapshot) : null;
  const afterObj = current ? JSON.parse(current) : null;
  const diff: FlatDiff[] | null =
    beforeObj && afterObj ? diffObjects(beforeObj, afterObj) : null;

  const changedCount = diff?.filter((d) => d.kind !== "unchanged").length ?? 0;
  const visibleDiff = diff?.filter(
    (d) => showUnchanged || d.kind !== "unchanged",
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <GitCompare className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Config Diff</h1>
          {diff && changedCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
              {changedCount} change{changedCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Capture the SDK config before and after a change to see exactly what
          differed.
        </p>
      </div>

      {/* Capture buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleCaptureBefore} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Capture "Before" Snapshot
        </Button>
        <Button
          onClick={handleCaptureAfter}
          disabled={!snapshot}
          variant="outline"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Capture "After" Snapshot
        </Button>
        {diff && changedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleCopyDiff}>
            {copied ? (
              <Check className="w-4 h-4 mr-1.5 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-1.5" />
            )}
            Copy diff
          </Button>
        )}
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div
          className={cn(
            "rounded-lg border p-3 space-y-1",
            snapshot
              ? "border-green-500/30 bg-green-500/5"
              : "border-border bg-muted/20",
          )}
        >
          <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
            Before
          </div>
          <div className="font-mono text-xs truncate">
            {snapshot
              ? `${Object.keys(flattenObj(JSON.parse(snapshot))).length} keys captured`
              : "Not captured yet"}
          </div>
        </div>
        <div
          className={cn(
            "rounded-lg border p-3 space-y-1",
            current
              ? "border-blue-500/30 bg-blue-500/5"
              : "border-border bg-muted/20",
          )}
        >
          <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
            After
          </div>
          <div className="font-mono text-xs truncate">
            {current
              ? `${Object.keys(flattenObj(JSON.parse(current))).length} keys captured`
              : snapshot
                ? "Change config, then capture after"
                : "Capture before first"}
          </div>
        </div>
      </div>

      {/* Diff table */}
      {diff ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Diff Result</h2>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={showUnchanged}
                onChange={(e) => setShowUnchanged(e.target.checked)}
                className="w-3.5 h-3.5"
              />
              Show unchanged
            </label>
          </div>

          {changedCount === 0 ? (
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center text-sm text-green-700 dark:text-green-400">
              ✅ Configs are identical — no changes detected.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead className="bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left p-2 w-8">~</th>
                    <th className="text-left p-2">Key</th>
                    <th className="text-left p-2">Before</th>
                    <th className="text-left p-2">After</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleDiff?.map((d) => (
                    <tr
                      key={d.key}
                      className={cn(
                        "border-t border-border",
                        KIND_STYLE[d.kind],
                      )}
                    >
                      <td className={cn("p-2 font-bold", KIND_LABEL[d.kind])}>
                        {d.kind === "added"
                          ? "+"
                          : d.kind === "removed"
                            ? "−"
                            : d.kind === "changed"
                              ? "~"
                              : " "}
                      </td>
                      <td className="p-2 text-foreground">{d.key}</td>
                      <td
                        className={cn(
                          "p-2 max-w-[200px] truncate",
                          d.kind === "removed"
                            ? "text-red-500 line-through"
                            : "text-muted-foreground",
                        )}
                      >
                        {val(d.before)}
                      </td>
                      <td
                        className={cn(
                          "p-2 max-w-[200px] truncate",
                          d.kind === "added"
                            ? "text-green-600"
                            : d.kind === "changed"
                              ? "text-yellow-600"
                              : "text-muted-foreground",
                        )}
                      >
                        {val(d.after)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          {!snapshot
            ? 'Capture a "Before" snapshot first, then reconfigure the SDK, then capture "After".'
            : 'Now reconfigure the SDK (change API key, env, or target attributes), then capture "After".'}
        </div>
      )}
    </div>
  );
}
