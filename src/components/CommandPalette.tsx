import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { sdkMonitor } from "../lib/sdkMonitor";
import { TRIGGER_ROUTES, MAIN_ROUTES, RESOURCE_ROUTES } from "../routes";
import { Search, X } from "lucide-react";
import { cn } from "../lib/utils";

type PaletteAction = {
  id: string;
  label: string;
  description?: string;
  group: string;
  keywords: string[];
  action: () => void;
};

function usePaletteActions(
  navigate: ReturnType<typeof useNavigate>,
  setDebugOpen: (tab?: import("./DevToolsDrawer").DevTab) => void,
): PaletteAction[] {
  return useMemo<PaletteAction[]>(
    () => [
      // Navigation
      {
        id: "nav-home",
        label: "Go to Playground Home",
        group: "Navigate",
        keywords: ["home", "playground"],
        action: () => navigate(MAIN_ROUTES.HOME),
      },
      {
        id: "nav-getting-started",
        label: "Getting Started",
        description: "Open onboarding wizard",
        group: "Navigate",
        keywords: ["onboard", "setup", "guide", "start"],
        action: () => navigate(MAIN_ROUTES.GETTING_STARTED),
      },
      // Triggers
      {
        id: "nav-scroll",
        label: "Scroll Depth Test",
        group: "Trigger Tests",
        keywords: ["scroll", "depth", "trigger"],
        action: () => navigate(TRIGGER_ROUTES.SCROLL_DEPTH),
      },
      {
        id: "nav-click",
        label: "Click Trigger Test",
        group: "Trigger Tests",
        keywords: ["click", "selector", "trigger"],
        action: () => navigate(TRIGGER_ROUTES.CLICK_TRIGGER),
      },
      {
        id: "nav-exit",
        label: "Exit Intent Test",
        group: "Trigger Tests",
        keywords: ["exit", "intent", "cursor"],
        action: () => navigate(TRIGGER_ROUTES.EXIT_INTENT),
      },
      {
        id: "nav-idle",
        label: "Idle Detection Test",
        group: "Trigger Tests",
        keywords: ["idle", "inactivity", "timer"],
        action: () => navigate(TRIGGER_ROUTES.IDLE_DETECTION),
      },
      {
        id: "nav-pageview",
        label: "Page View Test",
        group: "Trigger Tests",
        keywords: ["pageview", "url", "navigation"],
        action: () => navigate(TRIGGER_ROUTES.PAGE_VIEW),
      },
      // Tooling
      {
        id: "nav-error-sim",
        label: "Error Simulator",
        description: "Queue mock API error responses",
        group: "Tooling",
        keywords: ["error", "mock", "401", "500", "simulate"],
        action: () => setDebugOpen("errors"),
      },
      {
        id: "nav-session",
        label: "Session Manager",
        description: "Inspect SDK localStorage keys",
        group: "Tooling",
        keywords: ["session", "storage", "localstorage", "clear"],
        action: () => setDebugOpen("session"),
      },
      {
        id: "nav-diff",
        label: "Config Diff",
        description: "Compare SDK config snapshots",
        group: "Tooling",
        keywords: ["diff", "config", "compare", "change"],
        action: () => setDebugOpen("diff"),
      },
      // Actions
      {
        id: "action-debug",
        label: "Toggle Debug Console",
        description: "Open/close the SDK debug panel",
        group: "Actions",
        keywords: ["debug", "console", "logs", "network"],
        action: () => setDebugOpen("console"),
      },
      {
        id: "action-clear-logs",
        label: "Clear SDK Logs",
        description: "Reset all monitor logs",
        group: "Actions",
        keywords: ["clear", "reset", "logs", "monitor"],
        action: () => sdkMonitor.clearLogs(),
      },
      {
        id: "action-share",
        label: "Copy Share URL",
        description: "Copy current session as shareable link",
        group: "Actions",
        keywords: ["share", "copy", "link", "url"],
        action: () => {
          const raw = sessionStorage.getItem("embeddedsurvey-config");
          if (!raw) return;
          import("../lib/sessionShare").then(({ buildShareUrl }) => {
            const url = buildShareUrl(JSON.parse(raw));
            navigator.clipboard.writeText(url);
          });
        },
      },
    ],
    [navigate, setDebugOpen],
  );
}

interface CommandPaletteProps {
  onDebugOpen: (tab?: import("./DevToolsDrawer").DevTab) => void;
}

export function CommandPalette({ onDebugOpen }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const actions = usePaletteActions(navigate, onDebugOpen);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.includes(q)) ||
        a.group.toLowerCase().includes(q),
    );
  }, [query, actions]);

  // Group the results
  const grouped = useMemo(() => {
    const map: Record<string, PaletteAction[]> = {};
    filtered.forEach((a) => {
      if (!map[a.group]) map[a.group] = [];
      map[a.group].push(a);
    });
    return map;
  }, [filtered]);

  // Flatten for keyboard nav
  const flat = filtered;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[selectedIdx]) {
        flat[selectedIdx].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No commands found for "{query}"
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </div>
                {items.map((item) => {
                  const idx = flat.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                        idx === selectedIdx
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50",
                      )}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex-1">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>Esc close</span>
          <span className="ml-auto">⌘K to open</span>
        </div>
      </div>
    </div>
  );
}
