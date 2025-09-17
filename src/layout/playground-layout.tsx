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
} from "lucide-react";
import { Button } from "../components/Button";
import { MAIN_ROUTES, SURVEY_TEMPLATES, RESOURCES } from "../routes";
import { create } from "zustand";

interface ThemeState {
  theme: "theme-light" | "dark" | "system";
  setTheme: (theme: "theme-light" | "dark" | "system") => void;
}

const useTheme = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));

function CoolNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
                        <NavigationMenuLink asChild>
                          <NavLink
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            to={MAIN_ROUTES.GETTING_STARTED}
                          >
                            <BarChart3 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Getting Started
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Learn how to create your first survey and start
                              collecting responses in minutes.
                            </p>
                          </NavLink>
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
      <NavigationMenuLink asChild>
        <NavLink
          to={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
}

const PlaygroundLayout = () => {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "theme-light");
  }, []);

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
  const session = sessionStorage.getItem("embeddedsurvey-config");
  if (!session) {
    window.location.href = "/";
    return null;
  }
  return (
    <div>
      <CoolNavigation />
      <main>
        <Outlet />
      </main>
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 lg:bottom-8 lg:right-8 z-50 flex space-x-2">
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
        <Button>
          <Home className="w-4 h-4" />
          <NavLink to="/" className="ml-2">
            Home
          </NavLink>
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundLayout;
