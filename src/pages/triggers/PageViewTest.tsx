import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const DEMO_PAGES = [
  { path: "/playground/triggers/page-view", name: "Home", icon: "🏠" },
  {
    path: "/playground/triggers/page-view/products",
    name: "Products",
    icon: "🛍️",
  },
  { path: "/playground/triggers/page-view/about", name: "About", icon: "ℹ️" },
  {
    path: "/playground/triggers/page-view/contact",
    name: "Contact",
    icon: "📧",
  },
  {
    path: "/playground/triggers/page-view/pricing",
    name: "Pricing",
    icon: "💰",
  },
];

export const PageViewTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageViews, setPageViews] = useState<
    Array<{ path: string; time: string }>
  >([]);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    // Log page view
    setPageViews((prev) => [
      { path: location.pathname, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9), // Keep last 10 views
    ]);
    setTotalViews((prev) => prev + 1);
  }, [location.pathname]);

  const currentPage =
    DEMO_PAGES.find((p) => p.path === location.pathname) || DEMO_PAGES[0];

  const getMatchingRules = (path: string) => {
    const rules = [];
    if (path === "/playground/triggers/page-view") rules.push("equals '/'");
    if (path.includes("/products")) rules.push("contains '/products'");
    if (path.startsWith("/playground/triggers/page-view"))
      rules.push("startsWith '/playground'");
    if (path.endsWith("/pricing")) rules.push("endsWith '/pricing'");
    return rules;
  };

  const matchingRules = getMatchingRules(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-background border-b border-border z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Page View Demo</h2>
          <div className="flex gap-2">
            {DEMO_PAGES.map((page) => (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  location.pathname === page.path
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span className="mr-1">{page.icon}</span>
                {page.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="fixed top-20 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-80">
        <h3 className="font-semibold mb-4">Page View Stats</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total Views
              </div>
              <div className="text-3xl font-bold">{totalViews}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Current Page
              </div>
              <div className="text-sm font-semibold truncate">
                {currentPage.icon} {currentPage.name}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-2">
              Current URL
            </div>
            <div className="text-xs font-mono bg-muted p-2 rounded break-all">
              {location.pathname}
            </div>
          </div>

          {matchingRules.length > 0 && (
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground mb-2">
                Matching Rules
              </div>
              <div className="space-y-1">
                {matchingRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 p-2 rounded"
                  >
                    ✓ {rule}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Panel */}
      <div className="fixed bottom-4 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-80 max-h-64 overflow-y-auto">
        <h4 className="font-semibold mb-2 text-sm">Page View History</h4>
        <div className="space-y-1">
          {pageViews.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No page views yet...
            </p>
          ) : (
            pageViews.map((view, idx) => (
              <div key={idx} className="text-xs p-2 bg-muted rounded">
                <div className="font-mono text-muted-foreground">
                  {view.time}
                </div>
                <div className="font-semibold truncate">{view.path}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 pt-24">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {currentPage.icon} {currentPage.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Navigate between pages using the menu above to trigger page view
            events.
          </p>

          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold mb-1">
                  Page View Tracking Active
                </h4>
                <p className="text-sm text-muted-foreground">
                  Each navigation triggers a new page view event. Watch the
                  stats panel update!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold">What is Page View Trigger?</h2>
          <p className="text-muted-foreground">
            Page view triggers fire when users navigate to specific pages or
            URLs. This is the most common trigger type and allows you to show
            surveys based on:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Exact URL matches</li>
            <li>URL patterns (contains, starts with, ends with)</li>
            <li>Multiple URL rules combined</li>
            <li>Regex patterns for complex matching</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">URL Matching Rules</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎯</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">equals</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Exact match - Triggers only on the specific URL
                  </p>
                  <div className="bg-muted p-2 rounded text-xs font-mono">
                    {`{ url: "/products", rule: "equals" }`}
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔍</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">contains</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Substring match - Triggers if URL includes the pattern
                  </p>
                  <div className="bg-muted p-2 rounded text-xs font-mono">
                    {`{ url: "product", rule: "contains" }`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Matches: /products, /product/123, /shop/product-details
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">▶️</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">startsWith</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Prefix match - Triggers if URL begins with the pattern
                  </p>
                  <div className="bg-muted p-2 rounded text-xs font-mono">
                    {`{ url: "/blog", rule: "startsWith" }`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Matches: /blog, /blog/post-1, /blog/category/tech
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">◀️</span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">endsWith</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Suffix match - Triggers if URL ends with the pattern
                  </p>
                  <div className="bg-muted p-2 rounded text-xs font-mono">
                    {`{ url: "/checkout", rule: "endsWith" }`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Matches: /cart/checkout, /quick-checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Common Use Cases</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🛒 Post-Purchase</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Survey customers after checkout completion
              </p>
              <div className="bg-muted p-2 rounded text-xs font-mono">
                /order/confirmation
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📝 Feature Feedback</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Get feedback on specific features or pages
              </p>
              <div className="bg-muted p-2 rounded text-xs font-mono">
                /dashboard/new-feature
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎯 Landing Page</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Gather insights from campaign landing pages
              </p>
              <div className="bg-muted p-2 rounded text-xs font-mono">
                /campaign/summer-sale
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">❓ Support Pages</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Ask if help content was useful
              </p>
              <div className="bg-muted p-2 rounded text-xs font-mono">
                /help/* (all help pages)
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">SDK Configuration</h2>
          <div className="bg-muted rounded-lg p-6">
            <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {`event: {
  trigger: "pageView",
  mode: "ImmediateSurvey",
  urls: [
    { url: "/products", rule: "equals" },
    { url: "/category", rule: "startsWith" },
    { url: "checkout", rule: "contains" }
  ],
  displayDelay: "immediate",
  displayPercentage: 100
}`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4 border-green-500">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">
                ✅ Do
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Use specific URLs for targeted feedback</li>
                <li>• Combine with display delay for better UX</li>
                <li>• Test URL patterns before deploying</li>
                <li>• Use 'contains' for flexible matching</li>
                <li>• Consider query parameters</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 border-red-500">
              <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">
                ❌ Don't
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Use overly broad patterns</li>
                <li>• Show immediately on every page</li>
                <li>• Forget to test in staging first</li>
                <li>• Ignore URL structure changes</li>
                <li>• Mix too many unrelated URLs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Advanced: Multiple URLs
          </h2>
          <p className="text-muted-foreground mb-4">
            You can target multiple pages with different rules in a single
            configuration:
          </p>
          <div className="bg-muted rounded-lg p-6">
            <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
              {`urls: [
  // Exact matches for key pages
  { url: "/", rule: "equals" },
  { url: "/pricing", rule: "equals" },
  
  // All product pages
  { url: "/products/", rule: "startsWith" },
  
  // All blog posts
  { url: "/blog/", rule: "startsWith" },
  
  // Any checkout flow page
  { url: "checkout", rule: "contains" }
]`}
            </pre>
          </div>
        </section>

        <section className="pb-12">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Try It Out!</h3>
            <p className="text-muted-foreground mb-4">
              Use the navigation menu above to visit different demo pages. Watch
              how the page view counter increments and matching rules update
              based on the current URL.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Page:</span>
                <span className="ml-2 font-semibold">{currentPage.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Views:</span>
                <span className="ml-2 font-bold text-primary">
                  {totalViews}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
