import { PixelatedCanvas } from "./components/PixelatedCanvas";
import SetupForm from "./components/SetupForm";
import cxlogo from "./assets/cxlogo.png";
import { Button } from "./components/Button";
import { Copy, Monitor, Moon, Notebook, Settings2, Sun } from "lucide-react";
import { useIsSetup, useTheme } from "./store";
import { useEffect } from "react";
import { ShootingStars, StarsBackground } from "./components/ShoutingStars";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/Sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/Accordion";
import { ScrollArea } from "./components/ScrollArea";
import {
  PLAYGROUND_ROUTES,
  TEMPLATE_ROUTES,
  RESOURCE_ROUTES,
  MAIN_ROUTES,
} from "./routes";

const routeList = () => {
  const routes: string[] = [];
  let baseUrl = window.location.origin; // Gets protocol + hostname + port

  if (import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/") {
    baseUrl += import.meta.env.BASE_URL.replace(/\/$/, "");
  }

  // Add main routes (all are full paths)
  Object.values(MAIN_ROUTES).forEach((path) => {
    routes.push(`${baseUrl}${path}`);
  });

  // Add full path versions of template routes
  [
    TEMPLATE_ROUTES.CUSTOMER_FEEDBACK_FULL,
    TEMPLATE_ROUTES.EMPLOYEE_SURVEY_FULL,
    TEMPLATE_ROUTES.MARKET_RESEARCH_FULL,
    TEMPLATE_ROUTES.EVENT_FEEDBACK_FULL,
    TEMPLATE_ROUTES.PRODUCT_SURVEY_FULL,
    TEMPLATE_ROUTES.NPS_SURVEY_FULL,
  ].forEach((path) => {
    routes.push(`${baseUrl}${path}`);
  });

  // Add full path versions of resource routes
  [
    RESOURCE_ROUTES.DOCS_FULL,
    RESOURCE_ROUTES.API_DOCS_FULL,
    RESOURCE_ROUTES.BEST_PRACTICES_FULL,
    RESOURCE_ROUTES.SUPPORT_FULL,
  ].forEach((path) => {
    routes.push(`${baseUrl}${path}`);
  });

  // Add full path versions of playground routes
  [PLAYGROUND_ROUTES.SIMULATION_FULL, PLAYGROUND_ROUTES.EMBEDDED_FULL].forEach(
    (path) => {
      routes.push(`${baseUrl}${path}`);
    }
  );

  return routes;
};

console.log(routeList());

function App() {
  const { theme, setTheme } = useTheme();
  const { isSetup, setIsSetup } = useIsSetup();
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
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <ShootingStars trailColor="teal" starColor="teal" />
      <StarsBackground />
      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform">
        <PixelatedCanvas
          src={cxlogo}
          width={400}
          height={400}
          cellSize={3}
          dotScale={0.9}
          shape="square"
          backgroundColor="#000000"
          dropoutStrength={0.4}
          interactive
          distortionStrength={3}
          distortionRadius={80}
          distortionMode="swirl"
          followSpeed={0.2}
          jitterStrength={4}
          jitterSpeed={4}
          sampleAverage
          tintColor="#FFFFFF"
          tintStrength={0.2}
          className="rounded-full "
        />
      </div>
      <SetupForm />
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 lg:bottom-8 lg:right-8 z-50 flex space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 transition-all duration-200 ">
              <Notebook className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Embedded Reference Sheet</SheetTitle>
              <SheetDescription>
                This sheet contains reference links for embedded surveys.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4">
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>Available Routes/Paths</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <ScrollArea className=" h-96 space-y-2">
                      {routeList().map((route) => (
                        <div
                          key={route}
                          className="break-all text-sm flex mr-4 my-2  py-2 px-2 justify-center items-center border rounded-sm"
                        >
                          {route}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                            onClick={() => {
                              navigator.clipboard.writeText(route);
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Available Selectors and Elements
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p className="">Coming soon!</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
        <Button disabled={isSetup} onClick={() => setIsSetup(!isSetup)}>
          <Settings2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}

export default App;
