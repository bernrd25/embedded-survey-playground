import { type ReactNode, useState, useEffect } from "react";
import {
  Terminal,
  Clock,
  Info,
  X,
  AlertCircle,
  Database,
  GitCompare,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./Drawer";
import { TriggerEventTimeline } from "./TriggerEventTimeline";
import { SDKDebugPanel } from "./SDKDebugPanel";
import { ErrorSimulator } from "../pages/ErrorSimulator";
import { SessionManager } from "../pages/SessionManager";
import { ConfigDiffPanel } from "../pages/ConfigDiffPanel";
import { cn } from "../lib/utils";

export type DevTab =
  | "timeline"
  | "config"
  | "console"
  | "errors"
  | "session"
  | "diff";

interface DevToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  configInspector: ReactNode;
  initialTab?: DevTab;
}

const TABS: { id: DevTab; label: string; icon: typeof Terminal }[] = [
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "config", label: "Config", icon: Info },
  { id: "console", label: "Console", icon: Terminal },
  { id: "errors", label: "Errors", icon: AlertCircle },
  { id: "session", label: "Session", icon: Database },
  { id: "diff", label: "Diff", icon: GitCompare },
];

export function DevToolsDrawer({
  isOpen,
  onClose,
  configInspector,
  initialTab,
}: DevToolsDrawerProps) {
  const [activeTab, setActiveTab] = useState<DevTab>(initialTab ?? "timeline");

  // Switch to initialTab when the drawer is opened with a specific tab
  useEffect(() => {
    if (isOpen && initialTab) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      direction="bottom"
    >
      <DrawerContent className="flex flex-col h-full w-full sm:w-[520px] md:w-[820px]">
        {/* Header */}
        <DrawerHeader className="flex-row items-center justify-between py-3 px-4 border-b border-border shrink-0">
          <DrawerTitle className="text-sm font-semibold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            Dev Tools
          </DrawerTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
        </DrawerHeader>

        {/* Tab Bar */}
        <div className="flex border-b border-border bg-muted/10 shrink-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium transition-colors border-b-2",
                activeTab === id
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "timeline" && (
            <div className="flex-1 overflow-y-auto">
              <TriggerEventTimeline />
            </div>
          )}

          {activeTab === "config" && (
            <div className="flex-1 overflow-y-auto p-4">{configInspector}</div>
          )}

          {activeTab === "console" && (
            <SDKDebugPanel isOpen={true} onClose={onClose} inline={true} />
          )}

          {activeTab === "errors" && (
            <div className="flex-1 overflow-y-auto p-4">
              <ErrorSimulator />
            </div>
          )}

          {activeTab === "session" && (
            <div className="flex-1 overflow-y-auto p-4">
              <SessionManager />
            </div>
          )}

          {activeTab === "diff" && (
            <div className="flex-1 overflow-y-auto p-4">
              <ConfigDiffPanel />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
