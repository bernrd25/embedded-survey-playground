import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import PlaygroundLayout from "./layout/playground-layout";

import { PLAYGROUND_ROUTES, TEMPLATE_ROUTES, RESOURCE_ROUTES } from "./routes";
import EnvironmentComponent from "./components/EnvironmentComponent.tsx";

const router = createBrowserRouter([
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
        Component: () => <EnvironmentComponent text="Simulation" />,
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
          <EnvironmentComponent text="Market Research Template" />
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
    ],
  },
  {
    path: "*",
    Component: () => <div>404 Not Found</div>,
  },
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') // Remove trailing slash
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
