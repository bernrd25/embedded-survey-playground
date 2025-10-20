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
  Monitor,
  Moon,
  Sun,
  Home,
  Info,
  RefreshCcw,
  Terminal,
  Copy,
  Check,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  MousePointerClick,
  ArrowDown,
  Clock,
  LogOut,
  Zap,
} from "lucide-react";
import { Button } from "../components/Button";
import {
  MAIN_ROUTES,
  SURVEY_TEMPLATES,
  RESOURCES,
  TRIGGER_TESTS,
} from "../routes";

import { scriptInjector } from "../lib/scriptInjector";
import { useEmbeddedInfo, useTheme, type Config } from "../store";
import { Popover, PopoverTrigger } from "../components/Popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Label } from "../components/Label";
import { extractActiveEventPerPath } from "../lib/extractActiveEventPerPath";
import { Separator } from "../components/Seperator";
import { SDKDebugPanel } from "../components/SDKDebugPanel";
import { sdkMonitor } from "../lib/sdkMonitor";
import { Progress } from "../components/Progress";

function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
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

const PlaygroundLayout = () => {
  const { theme, setTheme } = useTheme();
  const { info, setInfo } = useEmbeddedInfo();
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
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

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "theme-light");
  }, [setTheme]);

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
  }, [theme]);

  const themeStateMachine = (theme: "theme-light" | "dark" | "system") => {
    setTheme(theme);
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
        `[Gaia SDK] 🎯 Simulated click (element not found): ${selector}`
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
      `[Gaia SDK] 🎯 Manually triggered page view: ${window.location.pathname}`
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
        (scrollTop / (documentHeight - windowHeight)) * 100
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
      sessionStorage.getItem("embeddedsurvey-config") || "{}"
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
              `Skipping localStorage key "${key}": not valid JSON or Config object`
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
      <div className="fixed left-2 top-12 md:top-16 md:left-4 lg:top-20 lg:left-8 z-50">
        <Popover>
          <PopoverTrigger onClick={() => handleSetInfo()}>
            <Info className="w-6 h-6 text-foreground hover:text-primary cursor-pointer" />
            <span className="sr-only">Info</span>
          </PopoverTrigger>
          <PopoverContent className="min-w-80 max-w-lg p-4">
            <div className="grid gap-4 bg-background rounded-lg p-4 shadow-lg">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h4 className="leading-none font-medium">
                      Config Inspector
                    </h4>
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
                      onClick={() => handleSetInfo()}
                    />
                  </div>
                </div>

                <p className="text-muted-foreground text-sm">
                  Real-time configuration preview and validation
                </p>

                {/* Validation Errors */}
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
                    /* JSON View */
                    <div className="relative">
                      <pre className="bg-muted/50 rounded p-3 text-xs overflow-x-auto max-h-96 max-w-md  overflow-y-auto">
                        {JSON.stringify(info, null, 2)}
                      </pre>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(info, null, 2),
                              "json"
                            )
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
                    /* Formatted View */
                    info.map((item, index: number) => {
                      const activeEvents = extractActiveEventPerPath(item);
                      const configId = `config-${index}`;

                      return (
                        <div
                          key={index}
                          className="grid gap-2 border rounded-lg p-3 bg-muted/30"
                        >
                          {/* Config Header */}
                          <div className="flex justify-between items-start mb-2">
                            <Label className="font-medium text-sm">
                              Config #{index + 1}
                            </Label>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  JSON.stringify(item, null, 2),
                                  configId
                                )
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

                          {/* Session Info */}
                          <div className="grid grid-cols-2 items-center gap-2 text-xs">
                            <Label className="text-muted-foreground">ID:</Label>
                            <Label className="truncate font-mono">
                              {item.id || "N/A"}
                            </Label>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-2 text-xs">
                            <Label className="text-muted-foreground">
                              Session ID:
                            </Label>
                            <Label className="truncate font-mono">
                              {item.sessionId}
                            </Label>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-2 text-xs">
                            <Label className="text-muted-foreground">
                              Already Displayed:
                            </Label>
                            <Label
                              className={item.display ? "text-green-600" : ""}
                            >
                              {item.display ? "Yes" : "No"}
                            </Label>
                          </div>

                          <Separator className="my-1" />

                          {/* Events Section */}
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
                                      `events-${index}`
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

                          {index < info.length - 1 && (
                            <Separator className="my-2" />
                          )}
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

                    {/* Scroll Depth Monitor */}
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
                                title={`${
                                  scrollMilestones.includes(milestone)
                                    ? "Reached"
                                    : "Trigger"
                                } ${milestone}%`}
                              >
                                {milestone}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <Progress value={scrollDepth} className="h-1" />
                      </div>
                    )}

                    {/* Exit Intent Monitor */}
                    {activeTriggers.has("exitIntent") && (
                      <div className="border rounded p-2 space-y-1.5 bg-card">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <LogOut className="w-3 h-3 text-red-600" />
                            <Label className="text-xs font-medium">
                              Exit Intent
                            </Label>
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

                    {/* Idle Detection Monitor */}
                    {(activeTriggers.has("idle") ||
                      activeTriggers.has("idleTime")) && (
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
                          value={Math.min(
                            (idleTime / idleThreshold) * 100,
                            100
                          )}
                          className={`h-1 ${
                            isIdle
                              ? "[&>div]:bg-red-500"
                              : "[&>div]:bg-green-500"
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

                    {/* Click & Page View - Compact */}
                    {(activeTriggers.has("click") ||
                      activeTriggers.has("pageView")) && (
                      <div className="grid grid-cols-2 gap-2">
                        {/* Click Trigger */}
                        {activeTriggers.has("click") && (
                          <div className="border rounded p-2 bg-card space-y-1">
                            <div className="flex items-center gap-1">
                              <MousePointerClick className="w-3 h-3 text-green-600" />
                              <Label className="text-xs font-medium">
                                Click
                              </Label>
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

                        {/* Page View */}
                        {activeTriggers.has("pageView") && (
                          <div className="border rounded p-2 bg-card space-y-1">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-purple-600" />
                              <Label className="text-xs font-medium">
                                Page View
                              </Label>
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

                    {/* No Triggers Message */}
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
          </PopoverContent>
        </Popover>
      </div>
      <div className="fixed bottom-2 left-2 md:bottom-4 md:left-4 lg:bottom-8 lg:left-8 z-50 flex space-x-2">
        <Button
          onClick={() => setIsDebugPanelOpen(!isDebugPanelOpen)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200"
          title="Toggle SDK Debug Console"
        >
          <Terminal className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            themeStateMachine(theme === "dark" ? "theme-light" : "dark")
          }
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200 "
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : theme === "theme-light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </Button>
        <Button
          onClick={handleResetToHome}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200 "
        >
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Button>
      </div>

      {/* SDK Debug Panel */}
      <SDKDebugPanel
        isOpen={isDebugPanelOpen}
        onClose={() => setIsDebugPanelOpen(false)}
      />
    </div>
  );
};

export default PlaygroundLayout;
