import { useState, useEffect } from "react";

export const ExitIntentTest = () => {
  const [exitAttempts, setExitAttempts] = useState(0);
  const [lastExitTime, setLastExitTime] = useState<string | null>(null);
  const [cursorY, setCursorY] = useState(0);
  const [isNearTop, setIsNearTop] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorY(e.clientY);
      setIsNearTop(e.clientY < 50);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top
      if (e.clientY <= 0) {
        setExitAttempts((prev) => prev + 1);
        setLastExitTime(new Date().toLocaleTimeString());
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const resetCounter = () => {
    setExitAttempts(0);
    setLastExitTime(null);
  };

  return (
    <div className="min-h-screen bg-background pt-12">
      {/* Top Exit Zone Indicator */}
      <div
        className={`fixed top-16 left-0 right-0 h-12 z-40 transition-all duration-200 ${
          isNearTop
            ? "bg-red-500/20 border-b-2 border-red-500"
            : "bg-yellow-500/10 border-b border-yellow-500/30"
        }`}
      >
        <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
          <span className="text-sm font-medium">
            {isNearTop
              ? "⚠️ Exit Zone - Move up to trigger!"
              : "↑ Move cursor to top edge"}
          </span>
        </div>
      </div>

      {/* Status Panel */}
      <div className="fixed top-32 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-64">
        <h3 className="font-semibold mb-3">Exit Intent Monitor</h3>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Cursor Y Position
            </div>
            <div className="text-2xl font-mono font-bold">{cursorY}px</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Exit Attempts
            </div>
            <div className="text-3xl font-bold text-red-500">
              {exitAttempts}
            </div>
          </div>

          {lastExitTime && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Last Exit
              </div>
              <div className="text-sm font-mono">{lastExitTime}</div>
            </div>
          )}

          <div
            className={`px-3 py-2 rounded text-sm font-medium text-center ${
              isNearTop
                ? "bg-red-500 text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isNearTop ? "🚨 In Exit Zone" : "Ready to detect"}
          </div>

          <button
            onClick={resetCounter}
            className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
          >
            Reset Counter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 pt-24">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Exit Intent Trigger Test</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Move your mouse cursor quickly towards the top edge of the browser
            window to trigger exit intent detection.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold mb-1">How to Test</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Move your mouse to the middle of the page</li>
                  <li>Quickly move it towards the top edge</li>
                  <li>Exit through the top of the browser window</li>
                  <li>Watch the counter increase!</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold">What is Exit Intent?</h2>
          <p className="text-muted-foreground">
            Exit intent detection tracks user mouse movement and triggers when
            the cursor moves towards the top of the browser window - typically
            indicating the user is about to leave the page by:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Closing the tab</li>
            <li>Clicking the back button</li>
            <li>Typing a new URL</li>
            <li>Switching tabs</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Common Use Cases</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🛍️ E-commerce</h3>
              <p className="text-sm text-muted-foreground">
                Offer a discount code when users are about to abandon their cart
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📰 Content Sites</h3>
              <p className="text-sm text-muted-foreground">
                Promote newsletter signup before visitors leave
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">💼 B2B/SaaS</h3>
              <p className="text-sm text-muted-foreground">
                Capture feedback on why they're leaving without converting
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎓 Education</h3>
              <p className="text-sm text-muted-foreground">
                Offer free resources or trials before exit
              </p>
            </div>
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
                <li>• Use compelling, value-driven offers</li>
                <li>• Keep the message short and clear</li>
                <li>• Provide an easy way to dismiss</li>
                <li>• Limit frequency (once per session)</li>
                <li>• A/B test your messages</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 border-red-500">
              <h4 className="font-semibold mb-3 text-red-700 dark:text-red-400">
                ❌ Don't
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Show immediately on page load</li>
                <li>• Make it hard to close</li>
                <li>• Use aggressive or pushy language</li>
                <li>• Trigger on mobile (poor UX)</li>
                <li>• Show multiple times per session</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">SDK Configuration</h2>
          <div className="bg-muted rounded-lg p-6">
            <pre className="text-sm font-mono overflow-x-auto">
              {`event: {
  trigger: "exitIntent",
  mode: "ImmediateSurvey",
  urls: [
    { url: "/product", rule: "contains" }
  ],
  // Exit intent specific settings
  displayDelay: "immediate",
  displayPercentage: 100,
  displayInterval: 86400 // Once per day
}`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Detection Method</h4>
              <p className="text-sm text-muted-foreground">
                The SDK monitors{" "}
                <code className="bg-muted px-1 rounded">mouseleave</code> events
                on the document and checks if the cursor position is near the
                top edge (Y &lt; 0).
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Browser Support</h4>
              <p className="text-sm text-muted-foreground">
                Works in all modern browsers. Note: Mobile devices don't have
                cursor tracking, so exit intent is typically disabled on mobile.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Performance Impact</h4>
              <p className="text-sm text-muted-foreground">
                Minimal - only tracks{" "}
                <code className="bg-muted px-1 rounded">mouseleave</code>{" "}
                events, not continuous mouse movement.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Ready to Test?</h3>
            <p className="text-muted-foreground mb-4">
              Try moving your cursor to the top of the browser window to trigger
              an exit intent event. If you have a survey configured with exit
              intent trigger, it should appear!
            </p>
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground">
                Exit Attempts:{" "}
              </span>
              <span className="text-sm font-bold">{exitAttempts}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
