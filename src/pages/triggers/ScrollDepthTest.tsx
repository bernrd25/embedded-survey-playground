import { useState, useEffect } from "react";
import { Progress } from "../../components/Progress";

export const ScrollDepthTest = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [triggers, setTriggers] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const percentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );
      setScrollPercentage(percentage);

      // Track trigger milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (percentage >= milestone && !triggers.includes(milestone)) {
          setTriggers((prev) => [...prev, milestone]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggers]);

  const resetTriggers = () => {
    setTriggers([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[400vh] bg-background">
      {/* Fixed Progress Indicator */}
      <div className="fixed top-20 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-64">
        <h3 className="font-semibold mb-2">Scroll Depth Test</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Depth:</span>
            <span className="font-mono font-bold">{scrollPercentage}%</span>
          </div>
          <Progress value={scrollPercentage} className="h-2" />

          <div className="mt-4">
            <div className="text-sm font-medium mb-2">Milestones Reached:</div>
            <div className="flex flex-wrap gap-2">
              {[25, 50, 75, 100].map((milestone) => (
                <div
                  key={milestone}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    triggers.includes(milestone)
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {milestone}%
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetTriggers}
            className="mt-4 w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
          >
            Reset & Scroll to Top
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto p-8 space-y-16">
        {/* Header */}
        <section className="pt-24">
          <h1 className="text-4xl font-bold mb-4">Scroll Depth Trigger Test</h1>
          <p className="text-lg text-muted-foreground">
            Scroll down to test scroll depth triggers. The SDK will fire events
            at 25%, 50%, 75%, and 100% scroll depth.
          </p>
        </section>

        {/* 25% Marker */}
        <section className="py-12 border-t-4 border-yellow-500">
          <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
              📍 25% Scroll Depth
            </h2>
            <p className="text-muted-foreground">
              You're 1/4 of the way through the page. Surveys configured for 25%
              scroll depth should trigger here.
            </p>
          </div>
        </section>

        {/* Filler Content */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">
            Understanding Scroll Depth Triggers
          </h3>
          <p className="text-muted-foreground">
            Scroll depth triggers allow you to show surveys based on how far
            down the page a user has scrolled. This is useful for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Engaging users who are actively reading content</li>
            <li>Avoiding interrupting users too early</li>
            <li>Targeting highly engaged visitors</li>
            <li>A/B testing different trigger points</li>
          </ul>
        </section>

        {/* 50% Marker */}
        <section className="py-12 border-t-4 border-blue-500">
          <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">
              📍 50% Scroll Depth
            </h2>
            <p className="text-muted-foreground">
              You're halfway through! This is a popular trigger point for
              surveys.
            </p>
          </div>
        </section>

        {/* More Content */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Best Practices</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">✅ Do</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Test different scroll depths</li>
                <li>• Combine with other triggers</li>
                <li>• Consider page length</li>
                <li>• Monitor completion rates</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">❌ Don't</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Trigger too early (before 25%)</li>
                <li>• Use on very short pages</li>
                <li>• Set unrealistic depths</li>
                <li>• Ignore mobile behavior</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 75% Marker */}
        <section className="py-12 border-t-4 border-purple-500">
          <div className="bg-purple-500/10 border border-purple-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-2">
              📍 75% Scroll Depth
            </h2>
            <p className="text-muted-foreground">
              You're almost there! Users at this depth are highly engaged.
            </p>
          </div>
        </section>

        {/* More Content */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Technical Implementation</h3>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <pre>
              {`// SDK automatically tracks scroll depth
event: {
  trigger: "scrollDepth",
  scrollThreshold: 50, // 50%
  urls: [
    { url: "/blog", rule: "contains" }
  ]
}`}
            </pre>
          </div>
        </section>

        {/* 100% Marker */}
        <section className="py-12 border-t-4 border-green-500">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">
              📍 100% Scroll Depth
            </h2>
            <p className="text-muted-foreground">
              Congratulations! You've reached the end. This triggers surveys for
              users who read the entire page.
            </p>
          </div>
        </section>

        {/* Footer Content */}
        <section className="pb-24">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test Complete! 🎉</h3>
            <p className="text-muted-foreground mb-4">
              If you have a survey configured with scroll depth triggers, it
              should have appeared by now. Check the SDK Debug Panel to see
              which scroll events were fired.
            </p>
            <button
              onClick={resetTriggers}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Reset & Test Again
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
