import { useState } from "react";

export const ClickTriggerTest = () => {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  const handleClick = (elementId: string) => {
    setClickCounts((prev) => ({
      ...prev,
      [elementId]: (prev[elementId] || 0) + 1,
    }));
  };

  const resetCounts = () => {
    setClickCounts({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Click Trigger Test</h1>
          <p className="text-lg text-muted-foreground">
            Click on different elements to test click-based triggers. Each
            element has a unique CSS selector.
          </p>
        </section>

        {/* Click Counter Panel */}
        <div className="mb-8 bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Click Counter</h3>
            <button
              onClick={resetCounts}
              className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(clickCounts).map(([id, count]) => (
              <div key={id} className="bg-muted rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">{id}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))}
            {Object.keys(clickCounts).length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-4">
                Click elements below to start tracking
              </div>
            )}
          </div>
        </div>

        {/* Test Elements Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Button Test */}
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Buttons</h3>
            <button
              id="test-button-primary"
              onClick={() => handleClick("test-button-primary")}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Primary Button
            </button>
            <button
              id="test-button-secondary"
              onClick={() => handleClick("test-button-secondary")}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Secondary Button
            </button>
            <div className="text-xs text-muted-foreground font-mono">
              #test-button-primary
              <br />
              #test-button-secondary
            </div>
          </div>

          {/* Card Test */}
          <div
            id="test-card-interactive"
            onClick={() => handleClick("test-card-interactive")}
            className="border rounded-lg p-6 space-y-4 cursor-pointer hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Interactive Card</h3>
            <p className="text-sm text-muted-foreground">
              Click anywhere on this card to trigger an event.
            </p>
            <div className="text-xs text-muted-foreground font-mono">
              #test-card-interactive
            </div>
          </div>

          {/* Link Test */}
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Links</h3>
            <a
              href="#"
              id="test-link-primary"
              onClick={(e) => {
                e.preventDefault();
                handleClick("test-link-primary");
              }}
              className="block text-primary hover:underline"
            >
              Click this link
            </a>
            <a
              href="#"
              id="test-link-secondary"
              onClick={(e) => {
                e.preventDefault();
                handleClick("test-link-secondary");
              }}
              className="block text-primary hover:underline"
            >
              Or this link
            </a>
            <div className="text-xs text-muted-foreground font-mono">
              #test-link-primary
              <br />
              #test-link-secondary
            </div>
          </div>

          {/* Icon Test */}
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Icons</h3>
            <div className="flex gap-4">
              <button
                id="test-icon-heart"
                onClick={() => handleClick("test-icon-heart")}
                className="p-3 rounded-full hover:bg-accent"
              >
                ❤️
              </button>
              <button
                id="test-icon-star"
                onClick={() => handleClick("test-icon-star")}
                className="p-3 rounded-full hover:bg-accent"
              >
                ⭐
              </button>
              <button
                id="test-icon-thumbs"
                onClick={() => handleClick("test-icon-thumbs")}
                className="p-3 rounded-full hover:bg-accent"
              >
                👍
              </button>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              #test-icon-heart
              <br />
              #test-icon-star
              <br />
              #test-icon-thumbs
            </div>
          </div>

          {/* Image Test */}
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Image</h3>
            <div
              id="test-image-placeholder"
              onClick={() => handleClick("test-image-placeholder")}
              className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded flex items-center justify-center cursor-pointer hover:opacity-80"
            >
              <span className="text-sm text-muted-foreground">Click Image</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              #test-image-placeholder
            </div>
          </div>

          {/* Form Input Test */}
          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Form Elements</h3>
            <input
              id="test-input-text"
              type="text"
              placeholder="Click to focus"
              onFocus={() => handleClick("test-input-text")}
              className="w-full px-3 py-2 border rounded"
            />
            <select
              id="test-select-dropdown"
              onChange={() => handleClick("test-select-dropdown")}
              className="w-full px-3 py-2 border rounded"
            >
              <option>Select option...</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <div className="text-xs text-muted-foreground font-mono">
              #test-input-text
              <br />
              #test-select-dropdown
            </div>
          </div>

          {/* Custom Class Test */}
          <div className="border rounded-lg p-6 space-y-4 col-span-full">
            <h3 className="font-semibold">Elements with Custom Classes</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                className="cta-button px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => handleClick(".cta-button")}
              >
                CTA Button
              </button>
              <button
                className="buy-now-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleClick(".buy-now-btn")}
              >
                Buy Now
              </button>
              <button
                className="signup-button px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                onClick={() => handleClick(".signup-button")}
              >
                Sign Up
              </button>
              <button
                className="subscribe-btn px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleClick(".subscribe-btn")}
              >
                Subscribe
              </button>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              .cta-button | .buy-now-btn | .signup-button | .subscribe-btn
            </div>
          </div>
        </div>

        {/* Configuration Example */}
        <div className="mt-12 bg-muted rounded-lg p-6">
          <h3 className="font-semibold mb-4">SDK Configuration Example</h3>
          <pre className="text-xs font-mono overflow-x-auto">
            {`event: {
  trigger: "click",
  cssSelector: {
    id: "test-button-primary",    // Match by ID
    // OR
    cssSelector: ".cta-button",   // Match by class
    // OR
    name: "submit"                // Match by name attribute
  }
}`}
          </pre>
        </div>

        {/* Tips */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">✅ Best Practices</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use specific, unique selectors</li>
              <li>• Test selectors in browser DevTools</li>
              <li>• Prefer IDs over classes when possible</li>
              <li>• Consider dynamic content loading</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">💡 Common Use Cases</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "Add to Cart" button clicks</li>
              <li>• Newsletter signup attempts</li>
              <li>• Product image interactions</li>
              <li>• CTA button engagement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
