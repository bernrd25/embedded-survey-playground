import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import PlaygroundLayout from "./layout/playground-layout";
import Gridbackground from "./components/Gridbackground";
import { PLAYGROUND_ROUTES, TEMPLATE_ROUTES, RESOURCE_ROUTES } from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: PLAYGROUND_ROUTES.BASE,
    Component: PlaygroundLayout,
    children: [
      {
        index: true,
        Component: () => (
          <div>
            <Gridbackground text="Playground" />
          </div>
        ),
      },
      // Main navigation routes
      {
        path: "dashboard",
        Component: () => (
          <div>
            <Gridbackground text="Dashboard" />
          </div>
        ),
      },
      {
        path: "create",
        Component: () => (
          <div>
            <Gridbackground text="Create Survey" />
          </div>
        ),
      },
      {
        path: "analytics",
        Component: () => (
          <div>
            <Gridbackground text="Analytics" />
          </div>
        ),
      },
      {
        path: "templates",
        Component: () => (
          <div>
            <Gridbackground text="Templates" />
          </div>
        ),
      },
      {
        path: "getting-started",
        Component: () => (
          <div>
            <Gridbackground text="Getting Started" />
          </div>
        ),
      },
      {
        path: PLAYGROUND_ROUTES.SIMULATION,
        Component: () => (
          <div>
            <Gridbackground text="Simulation" />
          </div>
        ),
      },
      {
        path: PLAYGROUND_ROUTES.EMBEDDED,
        Component: () => (
          <div>
            <Gridbackground text="Embedded" />
          </div>
        ),
      },
      // Template routes
      {
        path: TEMPLATE_ROUTES.CUSTOMER_FEEDBACK,
        Component: () => (
          <div>
            <Gridbackground text="Customer Feedback Template" />
          </div>
        ),
      },
      {
        path: TEMPLATE_ROUTES.EMPLOYEE_SURVEY,
        Component: () => (
          <div>
            <Gridbackground text="Employee Survey Template" />
          </div>
        ),
      },
      {
        path: TEMPLATE_ROUTES.MARKET_RESEARCH,
        Component: () => (
          <div>
            <Gridbackground text="Market Research Template" />
          </div>
        ),
      },
      {
        path: TEMPLATE_ROUTES.EVENT_FEEDBACK,
        Component: () => (
          <div>
            <Gridbackground text="Event Feedback Template" />
          </div>
        ),
      },
      {
        path: TEMPLATE_ROUTES.PRODUCT_SURVEY,
        Component: () => (
          <div>
            <Gridbackground text="Product Survey Template" />
          </div>
        ),
      },
      {
        path: TEMPLATE_ROUTES.NPS_SURVEY,
        Component: () => (
          <div>
            <Gridbackground text="NPS Survey Template" />
          </div>
        ),
      },
      // Resource routes
      {
        path: RESOURCE_ROUTES.DOCS,
        Component: () => (
          <div>
            <Gridbackground text="Documentation" />
          </div>
        ),
      },
      {
        path: RESOURCE_ROUTES.API_DOCS,
        Component: () => (
          <div>
            <Gridbackground text="API Reference" />
          </div>
        ),
      },
      {
        path: RESOURCE_ROUTES.BEST_PRACTICES,
        Component: () => (
          <div>
            <Gridbackground text="Best Practices" />
          </div>
        ),
      },
      {
        path: RESOURCE_ROUTES.SUPPORT,
        Component: () => (
          <div>
            <Gridbackground text="Support Center" />
          </div>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: () => <div>404 Not Found</div>,
  },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
