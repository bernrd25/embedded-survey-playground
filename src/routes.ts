/**
 * Centralized route definitions for the embedded survey playground
 * Extracted from playground-layout.tsx for consistency and maintainability
 */

// Main navigation routes
export const MAIN_ROUTES = {
  HOME: "/playground",
  DASHBOARD: "/playground/dashboard",
  CREATE: "/playground/create",
  ANALYTICS: "/playground/analytics",
  TEMPLATES: "/playground/templates",
  GETTING_STARTED: "/playground/getting-started",
} as const;

// Survey template routes (under playground)
export const TEMPLATE_ROUTES = {
  // Relative paths for React Router children
  CUSTOMER_FEEDBACK: "templates/customer-feedback",
  EMPLOYEE_SURVEY: "templates/employee-survey",
  MARKET_RESEARCH: "templates/market-research",
  EVENT_FEEDBACK: "templates/event-feedback",
  PRODUCT_SURVEY: "templates/product-survey",
  NPS_SURVEY: "templates/nps-survey",
  // Full paths for external navigation
  CUSTOMER_FEEDBACK_FULL: "/playground/templates/customer-feedback",
  EMPLOYEE_SURVEY_FULL: "/playground/templates/employee-survey",
  MARKET_RESEARCH_FULL: "/playground/templates/market-research",
  EVENT_FEEDBACK_FULL: "/playground/templates/event-feedback",
  PRODUCT_SURVEY_FULL: "/playground/templates/product-survey",
  NPS_SURVEY_FULL: "/playground/templates/nps-survey",
} as const;

// Resource routes (under playground)
export const RESOURCE_ROUTES = {
  // Relative paths for React Router children
  DOCS: "docs",
  API_DOCS: "api-docs",
  BEST_PRACTICES: "best-practices",
  SUPPORT: "support",
  // Full paths for external navigation
  DOCS_FULL: "/playground/docs",
  API_DOCS_FULL: "/playground/api-docs",
  BEST_PRACTICES_FULL: "/playground/best-practices",
  SUPPORT_FULL: "/playground/support",
} as const;

// Playground routes
export const PLAYGROUND_ROUTES = {
  BASE: "/playground",
  // Child routes (relative paths for React Router children)
  SIMULATION: "simulation",
  EMBEDDED: "embedded",
  // Full paths for external navigation
  SIMULATION_FULL: "/playground/simulation",
  EMBEDDED_FULL: "/playground/embedded",
} as const;

// Survey template configuration
export const SURVEY_TEMPLATES = [
  {
    title: "Customer Feedback",
    href: TEMPLATE_ROUTES.CUSTOMER_FEEDBACK,
    description:
      "Collect valuable feedback from your customers to improve your products and services.",
  },
  {
    title: "Employee Survey",
    href: TEMPLATE_ROUTES.EMPLOYEE_SURVEY,
    description:
      "Measure employee satisfaction and engagement within your organization.",
  },
  {
    title: "Market Research",
    href: TEMPLATE_ROUTES.MARKET_RESEARCH,
    description:
      "Gather insights about your target market and consumer preferences.",
  },
  {
    title: "Event Feedback",
    href: TEMPLATE_ROUTES.EVENT_FEEDBACK,
    description:
      "Get feedback from attendees to improve future events and experiences.",
  },
  {
    title: "Product Survey",
    href: TEMPLATE_ROUTES.PRODUCT_SURVEY,
    description:
      "Understand user needs and preferences for product development.",
  },
  {
    title: "NPS Survey",
    href: TEMPLATE_ROUTES.NPS_SURVEY,
    description: "Measure customer loyalty with Net Promoter Score surveys.",
  },
] as const;

// Resource configuration
export const RESOURCES = [
  {
    title: "Documentation",
    href: RESOURCE_ROUTES.DOCS,
    description:
      "Learn how to create and embed surveys with our comprehensive guides.",
  },
  {
    title: "API Reference",
    href: RESOURCE_ROUTES.API_DOCS,
    description: "Integrate surveys into your applications with our REST API.",
  },
  {
    title: "Best Practices",
    href: RESOURCE_ROUTES.BEST_PRACTICES,
    description:
      "Tips and strategies for creating effective surveys that get results.",
  },
  {
    title: "Support Center",
    href: RESOURCE_ROUTES.SUPPORT,
    description: "Get help with any questions or issues you might encounter.",
  },
] as const;

// All routes combined for easy access
export const ALL_ROUTES = {
  ...MAIN_ROUTES,
  ...TEMPLATE_ROUTES,
  ...RESOURCE_ROUTES,
  ...PLAYGROUND_ROUTES,
} as const;

// Route validation helper
export const isValidRoute = (path: string): boolean => {
  return Object.values(ALL_ROUTES).includes(
    path as (typeof ALL_ROUTES)[keyof typeof ALL_ROUTES]
  );
};

// Get route by key helper
export const getRoute = (key: keyof typeof ALL_ROUTES): string => {
  return ALL_ROUTES[key];
};
