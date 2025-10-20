import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import PlaygroundLayout from "./layout/playground-layout";

import {
  PLAYGROUND_ROUTES,
  TEMPLATE_ROUTES,
  RESOURCE_ROUTES,
  TRIGGER_ROUTES,
} from "./routes";
import EnvironmentComponent from "./components/EnvironmentComponent.tsx";
import { Toaster } from "./components/Sonner.tsx";
import { ScrollDepthTest } from "./pages/triggers/ScrollDepthTest";
import { ClickTriggerTest } from "./pages/triggers/ClickTriggerTest";
import { ExitIntentTest } from "./pages/triggers/ExitIntentTest";
import { IdleDetectionTest } from "./pages/triggers/IdleDetectionTest";
import { PageViewTest } from "./pages/triggers/PageViewTest";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: App,
    },
    {
      path: PLAYGROUND_ROUTES.BASE,
      Component: PlaygroundLayout,
      middleware: [],
      children: [
        {
          index: true,
          Component: () => <EnvironmentComponent text="Playground" />,
        },
        // Main navigation routes
        {
          path: "dashboard",
          Component: () => <EnvironmentComponent text="Dashboard" />,
        },
        {
          path: "create",
          Component: () => <EnvironmentComponent text="Create Survey" />,
        },
        {
          path: "analytics",
          Component: () => <EnvironmentComponent text="Analytics" />,
        },
        {
          path: "templates",
          Component: () => <EnvironmentComponent text="Templates" />,
        },
        {
          path: "getting-started",
          Component: () => <EnvironmentComponent text="Getting Started" />,
        },
        {
          path: PLAYGROUND_ROUTES.SIMULATION,
          Component: () => (
            <EnvironmentComponent className="h-[100vh]" text="Simulation" />
          ),
        },
        {
          path: PLAYGROUND_ROUTES.EMBEDDED,
          Component: () => <EnvironmentComponent text="Embedded" />,
        },
        // Template routes
        {
          path: TEMPLATE_ROUTES.CUSTOMER_FEEDBACK,
          Component: () => (
            <EnvironmentComponent text="Customer Feedback Template" />
          ),
        },
        {
          path: TEMPLATE_ROUTES.EMPLOYEE_SURVEY,
          Component: () => (
            <EnvironmentComponent text="Employee Survey Template" />
          ),
        },
        {
          path: TEMPLATE_ROUTES.MARKET_RESEARCH,
          Component: () => (
            <EnvironmentComponent
              className="h-[300vh]"
              text="Market Research Template"
            />
          ),
        },
        {
          path: TEMPLATE_ROUTES.EVENT_FEEDBACK,
          Component: () => (
            <EnvironmentComponent text="Event Feedback Template" />
          ),
        },
        {
          path: TEMPLATE_ROUTES.EVENT_FEEDBACK,
          Component: () => (
            <EnvironmentComponent text="Event Feedback Template" />
          ),
        },
        {
          path: TEMPLATE_ROUTES.PRODUCT_SURVEY,
          Component: () => (
            <EnvironmentComponent text="Product Survey Template" />
          ),
        },
        {
          path: TEMPLATE_ROUTES.NPS_SURVEY,
          Component: () => <EnvironmentComponent text="NPS Survey Template" />,
        },
        // Resource routes
        {
          path: RESOURCE_ROUTES.DOCS,
          Component: () => <EnvironmentComponent text="Documentation" />,
        },
        {
          path: RESOURCE_ROUTES.API_DOCS,
          Component: () => <EnvironmentComponent text="API Reference" />,
        },
        {
          path: RESOURCE_ROUTES.BEST_PRACTICES,
          Component: () => <EnvironmentComponent text="Best Practices" />,
        },
        {
          path: RESOURCE_ROUTES.SUPPORT,
          Component: () => <EnvironmentComponent text="Support Center" />,
        },
        // Trigger test routes
        {
          path: TRIGGER_ROUTES.SCROLL_DEPTH,
          Component: ScrollDepthTest,
        },
        {
          path: TRIGGER_ROUTES.CLICK_TRIGGER,
          Component: ClickTriggerTest,
        },
        {
          path: TRIGGER_ROUTES.EXIT_INTENT,
          Component: ExitIntentTest,
        },
        {
          path: TRIGGER_ROUTES.IDLE_DETECTION,
          Component: IdleDetectionTest,
        },
        {
          path: TRIGGER_ROUTES.PAGE_VIEW,
          Component: PageViewTest,
        },
        // Page View sub-routes for navigation testing
        {
          path: `${TRIGGER_ROUTES.PAGE_VIEW}/products`,
          Component: PageViewTest,
        },
        {
          path: `${TRIGGER_ROUTES.PAGE_VIEW}/about`,
          Component: PageViewTest,
        },
        {
          path: `${TRIGGER_ROUTES.PAGE_VIEW}/contact`,
          Component: PageViewTest,
        },
        {
          path: `${TRIGGER_ROUTES.PAGE_VIEW}/pricing`,
          Component: PageViewTest,
        },
      ],
    },
    {
      path: "*",
      Component: () => <div>404 Not Found</div>,
    },
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, ""), // Remove trailing slash
  }
);

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
);
