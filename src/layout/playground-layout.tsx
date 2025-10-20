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
            <div className="grid gap-4 bg-background rounded-lg p-4">
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
