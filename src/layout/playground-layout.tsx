import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../components/Navigationmenu";
import { NavLink, Outlet } from "react-router";
import {
  BarChart3,
  PlusCircle,
  FileText,
  Users,
  X,
  Menu,
  Moon,
  Sun,
  Home,
  Terminal,
  Link2,
  Layers,
} from "lucide-react";
import { Button } from "../components/Button";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import {
  MAIN_ROUTES,
  SURVEY_TEMPLATES,
  RESOURCES,
  TRIGGER_TESTS,
} from "../routes";

import { scriptInjector } from "../lib/scriptInjector";
import { buildShareUrl, type ShareableConfig } from "../lib/sessionShare";
import { useEmbeddedInfo, type Config } from "../store";
import { useTheme } from "../components/theme-provider";
import { useSDKHealth } from "../hooks/useSDKHealth";
import { DevToolsDrawer, type DevTab } from "../components/DevToolsDrawer";
import { ConfigInspectorContent } from "../components/ConfigInspectorContent";
import { CommandPalette } from "../components/CommandPalette";
import { sdkMonitor } from "../lib/sdkMonitor";

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <NavLink to={MAIN_ROUTES.HOME} className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">
                Embedded Playground
              </span>
            </NavLink>
          </div>

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={MAIN_ROUTES.DASHBOARD}
                    className={navigationMenuTriggerStyle()}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={MAIN_ROUTES.CREATE}
                    className={navigationMenuTriggerStyle()}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Survey
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <FileText className="w-4 h-4 mr-2" />
                    Templates
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {SURVEY_TEMPLATES.map((template) => (
                        <ListItem
                          key={template.title}
                          title={template.title}
                          href={template.href}
                        >
                          {template.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Users className="w-4 h-4 mr-2" />
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href={MAIN_ROUTES.GETTING_STARTED}
                        >
                          <BarChart3 className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Getting Started
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Learn how to create your first survey and start
                            collecting responses in minutes.
                          </p>
                        </NavigationMenuLink>
                      </li>
                      {RESOURCES.map((resource) => (
                        <ListItem
                          key={resource.title}
                          title={resource.title}
                          href={resource.href}
                        >
                          {resource.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={MAIN_ROUTES.ANALYTICS}
                    className={navigationMenuTriggerStyle()}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Terminal className="w-4 h-4 mr-2" />
                    Trigger Tests
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {TRIGGER_TESTS.map((test) => (
                        <ListItem
                          key={test.title}
                          title={test.title}
                          href={test.href}
                        >
                          {test.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200 ">
              <NavLink to={MAIN_ROUTES.CREATE}>Create Survey</NavLink>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border bg-card/50 backdrop-blur">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium"
                asChild
              >
                <NavLink to={MAIN_ROUTES.DASHBOARD}>
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Dashboard
                </NavLink>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium"
                asChild
              >
                <NavLink to={MAIN_ROUTES.CREATE}>
                  <PlusCircle className="w-4 h-4 mr-3" />
                  Create Survey
                </NavLink>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium"
                asChild
              >
                <NavLink to={MAIN_ROUTES.TEMPLATES}>
                  <FileText className="w-4 h-4 mr-3" />
                  Templates
                </NavLink>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium"
                asChild
              >
                <NavLink to={MAIN_ROUTES.ANALYTICS}>
                  <BarChart3 className="w-4 h-4 mr-3" />
                  Analytics
                </NavLink>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Multi-tab QA tray button
// ---------------------------------------------------------------------------
const QA_ROUTES = [
  { label: "Playground", path: "/playground" },
  { label: "Dashboard", path: "/playground/dashboard" },
  { label: "Scroll Depth", path: "/playground/triggers/scroll-depth" },
  { label: "Click Trigger", path: "/playground/triggers/click-trigger" },
  { label: "Exit Intent", path: "/playground/triggers/exit-intent" },
  { label: "Idle Detection", path: "/playground/triggers/idle-detection" },
  { label: "Page View", path: "/playground/triggers/page-view" },
];

function MultiTabButton() {
  const [count, setCount] = useState(2);
  const [mode, setMode] = useState<"tabs" | "windows" | "isolated">("tabs");
  const [route, setRoute] = useState(QA_ROUTES[0].path);
  const [winWidth, setWinWidth] = useState(1280);
  const [winHeight, setWinHeight] = useState(800);

  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

  function buildTarget() {
    const raw = sessionStorage.getItem("embeddedsurvey-config");
    if (!raw) {
      toast.warning("No session configured yet.");
      return null;
    }

    let shareParam = "";
    if (mode === "isolated") {
      try {
        const config = JSON.parse(raw);
        const url = buildShareUrl(config as ShareableConfig);
        const m = url.match(/[?&]session=([^&]+)/);
        if (m) shareParam = `?session=${m[1]}`;
      } catch {
        toast.error("Could not build isolated session URL.");
        return null;
      }
    }
    return `${base}${route}${shareParam}`;
  }

  function openAll() {
    const target = buildTarget();
    if (!target) return;

    let opened = 0;
    for (let i = 0; i < count; i++) {
      if (mode === "windows") {
        // Explicit features string forces a real new window (not a tab)
        const left = 80 + i * 40;
        const top = 80 + i * 30;
        const features = `width=${winWidth},height=${winHeight},left=${left},top=${top},toolbar=0,menubar=0,scrollbars=1,resizable=1`;
        const win = window.open(target, `qa_window_${i}`, features);
        if (win) opened++;
      } else {
        const win = window.open(target, "_blank");
        if (win) opened++;
      }
    }

    const label = mode === "windows" ? "window" : "tab";
    toast.success(
      `Opened ${opened} ${mode === "isolated" ? "isolated" : ""} ${label}${opened !== 1 ? "s" : ""}.`,
      {
        description:
          mode === "isolated"
            ? "Each tab gets config via URL — independent localStorage & sessionStorage."
            : mode === "windows"
              ? `Each window is ${winWidth}×${winHeight}px.`
              : "Tabs share sessionStorage from this window.",
      },
    );
  }

  const MODE_INFO = {
    tabs: "New tabs sharing this session's sessionStorage.",
    windows: "New popup windows — each with configurable dimensions.",
    isolated: "Isolated tabs via URL param — independent storage per tab.",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          title="QA Launcher"
        >
          <Layers className="h-4 w-4" />
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
            QA Launcher
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80 space-y-3 p-4">
        <div>
          <p className="text-sm font-semibold">QA Launcher</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Open multiple browser contexts for parallel testing.
          </p>
        </div>

        {/* Mode 3-way toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["tabs", "windows", "isolated"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-1.5 text-xs font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {MODE_INFO[mode]}
        </p>

        {/* Window size (only for windows mode) */}
        {mode === "windows" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium">Width (px)</label>
              <input
                type="number"
                min={400}
                max={3840}
                step={80}
                value={winWidth}
                onChange={(e) => setWinWidth(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Height (px)</label>
              <input
                type="number"
                min={300}
                max={2160}
                step={60}
                value={winHeight}
                onChange={(e) => setWinHeight(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="col-span-2 flex gap-1 flex-wrap">
              {[
                { label: "Mobile", w: 390, h: 844 },
                { label: "Tablet", w: 768, h: 1024 },
                { label: "Desktop", w: 1280, h: 800 },
                { label: "Wide", w: 1920, h: 1080 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setWinWidth(p.w);
                    setWinHeight(p.h);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                    winWidth === p.w && winHeight === p.h
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Route */}
        <div className="space-y-1">
          <label className="text-xs font-medium">Target page</label>
          <select
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {QA_ROUTES.map((r) => (
              <option key={r.path} value={r.path}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium">
              {mode === "windows" ? "Number of windows" : "Number of tabs"}
            </label>
            <span className="text-xs font-bold text-foreground">{count}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              −
            </button>
            <input
              type="range"
              min={1}
              max={mode === "windows" ? 6 : 10}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() =>
                setCount((c) => Math.min(mode === "windows" ? 6 : 10, c + 1))
              }
              className="h-6 w-6 rounded-md border border-border flex items-center justify-center text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <Button size="sm" className="w-full gap-2" onClick={openAll}>
          <Layers className="h-3.5 w-3.5" />
          Open {count}{" "}
          {mode === "windows"
            ? `window${count !== 1 ? "s" : ""}`
            : `tab${count !== 1 ? "s" : ""}`}
          {mode === "windows" && (
            <span className="text-[10px] opacity-70 ml-1">
              {winWidth}×{winHeight}
            </span>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

const PlaygroundLayout = () => {
  const { theme, setTheme } = useTheme();
  const { info, setInfo } = useEmbeddedInfo();
  const sdkHealth = useSDKHealth();
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [devToolsTab, setDevToolsTab] = useState<DevTab>("timeline");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showRawJSON, setShowRawJSON] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Trigger monitoring state
  const [scrollDepth, setScrollDepth] = useState(0);
  const [scrollMilestones, setScrollMilestones] = useState<number[]>([]);
  const [cursorY, setCursorY] = useState(0);
  const [exitAttempts, setExitAttempts] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const idleThreshold = 10; // 10 seconds

  // Initialize SDK monitor
  useEffect(() => {
    sdkMonitor.startMonitoring();
    return () => {
      sdkMonitor.stopMonitoring();
    };
  }, []);

  const themeStateMachine = (t: "light" | "dark" | "system") => {
    setTheme(t);
  };

  // Helper to check which trigger types are configured
  const getActiveTriggerTypes = () => {
    const triggers = new Set<string>();
    if (!info) return triggers;

    info.forEach((config) => {
      config.events?.forEach((event) => {
        if (event.trigger) {
          triggers.add(event.trigger);
        }
      });
    });

    return triggers;
  };

  const activeTriggers = getActiveTriggerTypes();

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadConfig = (config: Config[]) => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sdk-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validateConfig = (config: Config) => {
    const errors: string[] = [];
    if (!config) return errors;

    if (!config.id) errors.push("Missing ID");
    if (!config.sessionId) errors.push("Missing Session ID");
    if (!config.events || config.events.length === 0) {
      errors.push("No events configured");
    }

    config.events?.forEach((event, index: number) => {
      if (!event.name) errors.push(`Event ${index + 1}: Missing name`);
      if (!event.trigger) errors.push(`Event ${index + 1}: Missing trigger`);
      if (!event.mode) errors.push(`Event ${index + 1}: Missing mode`);
    });

    return errors;
  };

  // Trigger test functions - manually fire SDK events for testing
  const triggerScrollDepth = (depth: number) => {
    // Simulate scroll event by dispatching custom event
    const event = new CustomEvent("gaiaScrollDepth", {
      detail: { depth, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.info(`[Gaia SDK] 🎯 Manually triggered scroll depth: ${depth}%`);
  };

  const triggerClick = (selector: string) => {
    // Find element and click it, or simulate click event
    const element = document.querySelector(selector);
    if (element) {
      (element as HTMLElement).click();
      console.info(`[Gaia SDK] 🎯 Clicked element: ${selector}`);
    } else {
      // Dispatch custom event if element not found
      const event = new CustomEvent("gaiaClick", {
        detail: { selector, timestamp: Date.now() },
      });
      window.dispatchEvent(event);
      console.warn(
        `[Gaia SDK] 🎯 Simulated click (element not found): ${selector}`,
      );
    }
  };

  const triggerExitIntent = () => {
    // Simulate exit intent by dispatching mouseleave
    const event = new MouseEvent("mouseleave", {
      clientY: -10,
      bubbles: true,
    });
    document.dispatchEvent(event);
    console.info("[Gaia SDK] 🎯 Manually triggered exit intent");
  };

  const triggerIdle = () => {
    // Dispatch custom idle event
    const event = new CustomEvent("gaiaIdle", {
      detail: { timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.info("[Gaia SDK] 🎯 Manually triggered idle state");
  };

  const triggerPageView = () => {
    // Dispatch custom page view event
    const event = new CustomEvent("gaiaPageView", {
      detail: { url: window.location.href, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.info(
      `[Gaia SDK] 🎯 Manually triggered page view: ${window.location.pathname}`,
    );
  };

  // Monitor scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const percentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100,
      );
      setScrollDepth(Math.min(percentage, 100));

      // Track milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (percentage >= milestone && !scrollMilestones.includes(milestone)) {
          setScrollMilestones((prev) => [...prev, milestone]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollMilestones]);

  // Monitor cursor position and exit intent
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorY(e.clientY);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setExitAttempts((prev) => prev + 1);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Monitor idle state
  useEffect(() => {
    let idleTimer: number;
    let idleCounter: number;

    const resetIdleTimer = () => {
      setIsIdle(false);
      setIdleTime(0);

      if (idleTimer) clearTimeout(idleTimer);
      if (idleCounter) clearInterval(idleCounter);

      idleCounter = window.setInterval(() => {
        setIdleTime((prev) => prev + 1);
      }, 1000);

      idleTimer = window.setTimeout(() => {
        setIsIdle(true);
      }, idleThreshold * 1000);
    };

    resetIdleTimer();

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    activityEvents.forEach((event) => {
      document.addEventListener(event, resetIdleTimer);
    });

    return () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (idleCounter) clearInterval(idleCounter);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [idleThreshold]);

  useEffect(() => {
    const session = JSON.parse(
      sessionStorage.getItem("embeddedsurvey-config") || "{}",
    );

    if (session && Object.keys(session).length > 0) {
      scriptInjector(session);
    } else {
      // Redirect to home if no session
      if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
        const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
        window.location.href = `${basePath}/`;
      } else {
        window.location.href = "/";
      }
    }
  }, []);

  const handleResetToHome = () => {
    sessionStorage.removeItem("embeddedsurvey-config");
    sessionStorage.removeItem("isInitialized");
    //list localStorage.clear();
    const ls = Object.keys(localStorage);
    ls.forEach((key) => {
      if (key.startsWith("CXGAIA") || key.startsWith("survey-")) {
        localStorage.removeItem(key);
      }
    });
    if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, ""); // Remove trailing slash
      window.location.href = `${basePath}/`;
      return;
    }
    window.location.href = "/";
  };

  const handleSetInfo = () => {
    const temp: Array<Config> = [];
    const ls = Object.keys(localStorage);
    if (ls) {
      ls.forEach((key) => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const JSONvalue = JSON.parse(value);
            // Only add if it looks like a Config object (has required properties)
            if (
              JSONvalue &&
              typeof JSONvalue === "object" &&
              JSONvalue.id &&
              JSONvalue.events
            ) {
              temp.push(JSONvalue);
            }
          } catch {
            // Skip items that aren't valid JSON or don't match Config structure
            console.debug(
              `Skipping localStorage key "${key}": not valid JSON or Config object`,
            );
          }
        }
      });

      setInfo(temp);

      // Validate all configs
      if (temp.length > 0) {
        const allErrors = temp.flatMap((config) => validateConfig(config));
        setValidationErrors(allErrors);
      } else {
        setValidationErrors([]);
      }
    }
  };

  return (
    <div>
      <Navigation />
      <main>
        <Outlet />
      </main>

      {/* Floating Tray */}
      <div className="fixed bottom-6 left-6 z-50">
        <div className="flex items-center gap-0.5 rounded-2xl border border-border/50 bg-background/90 px-1.5 py-1.5 shadow-2xl backdrop-blur-md">
          {/* SDK Status */}
          <button
            onClick={() => {
              setDevToolsTab("console");
              setIsDevToolsOpen(true);
            }}
            title={sdkHealth}
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                sdkHealth === "ready" && "bg-green-500",
                sdkHealth === "loading" && "bg-yellow-400 animate-pulse",
                sdkHealth === "error" && "bg-red-500",
                sdkHealth === "idle" && "bg-slate-400",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
              {sdkHealth === "ready"
                ? "SDK Ready"
                : sdkHealth === "loading"
                  ? "SDK Loading…"
                  : sdkHealth === "error"
                    ? "SDK Error"
                    : "SDK Idle"}
            </span>
          </button>

          <div className="mx-0.5 h-5 w-px bg-border/60" />

          {/* Dev Tools */}
          <button
            onClick={() => setIsDevToolsOpen(true)}
            title="Dev Tools"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <Terminal className="h-4 w-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
              Dev Tools
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              const raw = sessionStorage.getItem("embeddedsurvey-config");
              if (!raw) {
                toast.warning("No session configured yet.");
                return;
              }
              try {
                const config = JSON.parse(raw) as ShareableConfig;
                const url = buildShareUrl(config);
                navigator.clipboard.writeText(url);
                toast.success("Shareable URL copied!", {
                  description:
                    "API key is included — share only with trusted team members.",
                  duration: 4000,
                });
              } catch {
                toast.error("Failed to generate share URL.");
              }
            }}
            title="Share session"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <Link2 className="h-4 w-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
              Share
            </span>
          </button>

          <div className="mx-0.5 h-5 w-px bg-border/60" />

          {/* Multi-tab QA */}
          <MultiTabButton />

          <div className="mx-0.5 h-5 w-px bg-border/60" />

          {/* Theme toggle */}
          <button
            onClick={() =>
              themeStateMachine(theme === "dark" ? "light" : "dark")
            }
            title="Toggle theme"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>

          {/* Home */}
          <button
            onClick={handleResetToHome}
            title="Go home"
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-150 hover:bg-accent hover:text-foreground active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md opacity-0 transition-opacity group-hover:opacity-100 border border-border">
              Home
            </span>
          </button>
        </div>
      </div>

      {/* Dev Tools Drawer */}
      <DevToolsDrawer
        isOpen={isDevToolsOpen}
        onClose={() => setIsDevToolsOpen(false)}
        initialTab={devToolsTab}
        configInspector={
          <ConfigInspectorContent
            info={info}
            validationErrors={validationErrors}
            showRawJSON={showRawJSON}
            setShowRawJSON={setShowRawJSON}
            copiedSection={copiedSection}
            copyToClipboard={copyToClipboard}
            downloadConfig={downloadConfig}
            handleSetInfo={handleSetInfo}
            activeTriggers={activeTriggers}
            scrollDepth={scrollDepth}
            scrollMilestones={scrollMilestones}
            cursorY={cursorY}
            exitAttempts={exitAttempts}
            isIdle={isIdle}
            idleTime={idleTime}
            idleThreshold={idleThreshold}
            triggerScrollDepth={triggerScrollDepth}
            triggerClick={triggerClick}
            triggerExitIntent={triggerExitIntent}
            triggerIdle={triggerIdle}
            triggerPageView={triggerPageView}
          />
        }
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        onDebugOpen={(tab) => {
          setDevToolsTab(tab ?? "console");
          setIsDevToolsOpen(true);
        }}
      />
    </div>
  );
};

export default PlaygroundLayout;
