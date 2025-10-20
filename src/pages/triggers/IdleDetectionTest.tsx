import { useState, useEffect, useRef } from "react";

export const IdleDetectionTest = () => {
  const [idleTime, setIdleTime] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [totalIdleEvents, setTotalIdleEvents] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(new Date());
  const [idleThreshold] = useState(10); // 10 seconds for testing
  const [activityLog, setActivityLog] = useState<string[]>([]);

  const idleTimerRef = useRef<number | null>(null);
  const idleCounterRef = useRef<number | null>(null);

  const logActivity = (activity: string) => {
    setActivityLog((prev) => [
      `${new Date().toLocaleTimeString()}: ${activity}`,
      ...prev.slice(0, 9), // Keep last 10 entries
    ]);
  };

  useEffect(() => {
    const resetIdleTimer = (activityType: string) => {
      setIdleTime(0);
      setIsIdle(false);
      setLastActivityTime(new Date());
      logActivity(activityType);

      // Clear existing timers
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (idleCounterRef.current) {
        clearInterval(idleCounterRef.current);
      }

      // Start counting seconds
      idleCounterRef.current = window.setInterval(() => {
        setIdleTime((prev) => prev + 1);
      }, 1000);

      // Set idle threshold timer
      idleTimerRef.current = window.setTimeout(() => {
        setIsIdle(true);
        setTotalIdleEvents((prev) => prev + 1);
        logActivity("🔴 IDLE DETECTED");
      }, idleThreshold * 1000);
    };

    // Initial timer start
    resetIdleTimer("Page loaded");

    // Activity event listeners
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = (e: Event) => {
      if (!isIdle) {
        resetIdleTimer(e.type);
      } else {
        // If was idle, mark as returned
        resetIdleTimer(`Returned from idle (${e.type})`);
      }
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (idleCounterRef.current) clearInterval(idleCounterRef.current);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isIdle, idleThreshold]);

  const progress = Math.min((idleTime / idleThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar */}
      <div
        className={`fixed top-0 left-0 right-0 h-2 z-50 transition-colors duration-300 ${
          isIdle ? "bg-red-500" : "bg-green-500"
        }`}
      >
        <div
          className="h-full bg-yellow-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status Panel */}
      <div className="fixed top-4 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-80">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Idle Monitor</h3>
          <div
            className={`w-3 h-3 rounded-full ${
              isIdle ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          />
        </div>

        <div className="space-y-4">
          {/* Countdown Display */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">
              {isIdle ? "Idle for" : "Time until idle"}
            </div>
            <div className="text-5xl font-bold font-mono mb-2">
              {isIdle ? idleTime : idleThreshold - idleTime}s
            </div>
            <div className="text-xs text-muted-foreground">
              Threshold: {idleThreshold}s
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isIdle ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total Idle Events
              </div>
              <div className="text-2xl font-bold">{totalIdleEvents}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Current Status
              </div>
              <div
                className={`text-sm font-semibold ${
                  isIdle ? "text-red-500" : "text-green-500"
                }`}
              >
                {isIdle ? "🔴 IDLE" : "🟢 ACTIVE"}
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-1">
              Last Activity
            </div>
            <div className="text-xs font-mono">
              {lastActivityTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="fixed bottom-4 right-4 z-40 bg-background border border-border rounded-lg p-4 shadow-lg w-80 max-h-64 overflow-y-auto">
        <h4 className="font-semibold mb-2 text-sm">Activity Log</h4>
        <div className="space-y-1">
          {activityLog.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No activities yet...
            </p>
          ) : (
            activityLog.map((log, idx) => (
              <div key={idx} className="text-xs font-mono p-2 bg-muted rounded">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 pt-16">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Idle Detection Trigger Test
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Stop interacting with the page for {idleThreshold} seconds to
            trigger idle detection.
          </p>

          <div
            className={`border rounded-lg p-4 transition-colors ${
              isIdle
                ? "bg-red-500/10 border-red-500"
                : "bg-green-500/10 border-green-500"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{isIdle ? "🔴" : "🟢"}</span>
              <div>
                <h4 className="font-semibold mb-1">
                  {isIdle ? "You are IDLE" : "You are ACTIVE"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isIdle
                    ? "Move your mouse, scroll, or press a key to become active again"
                    : `Stay still for ${
                        idleThreshold - idleTime
                      } more seconds to trigger idle state`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 space-y-6">
          <h2 className="text-2xl font-semibold">What is Idle Detection?</h2>
          <p className="text-muted-foreground">
            Idle detection monitors user activity and triggers when there has
            been no interaction for a specified period. The SDK tracks various
            user activities:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Mouse movements and clicks</li>
            <li>Keyboard presses</li>
            <li>Page scrolling</li>
            <li>Touch events (mobile)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Testing Instructions</h2>
          <div className="grid gap-4">
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">1️⃣</span>
                <div>
                  <h4 className="font-semibold mb-1">Stay Still</h4>
                  <p className="text-sm text-muted-foreground">
                    Stop moving your mouse and don't press any keys for{" "}
                    {idleThreshold} seconds
                  </p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">2️⃣</span>
                <div>
                  <h4 className="font-semibold mb-1">Watch the Timer</h4>
                  <p className="text-sm text-muted-foreground">
                    The countdown in the status panel shows time remaining until
                    idle
                  </p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">3️⃣</span>
                <div>
                  <h4 className="font-semibold mb-1">Trigger Idle State</h4>
                  <p className="text-sm text-muted-foreground">
                    When the timer reaches 0, the idle event fires and the panel
                    turns red
                  </p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start gap-3">
                <span className="text-xl">4️⃣</span>
                <div>
                  <h4 className="font-semibold mb-1">Resume Activity</h4>
                  <p className="text-sm text-muted-foreground">
                    Move your mouse or press a key to reset the timer and become
                    active again
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
              <h3 className="font-semibold mb-2">📊 Research</h3>
              <p className="text-sm text-muted-foreground">
                Survey users who appear to be reading or studying content
                carefully
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">💬 Re-engagement</h3>
              <p className="text-sm text-muted-foreground">
                Prompt idle users with help offers or recommendations
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎯 Intent Detection</h3>
              <p className="text-sm text-muted-foreground">
                Identify users who are contemplating a decision
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">⏰ Session Timeout</h3>
              <p className="text-sm text-muted-foreground">
                Warn users before automatic logout on sensitive pages
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">SDK Configuration</h2>
          <div className="bg-muted rounded-lg p-6">
            <pre className="text-sm font-mono overflow-x-auto">
              {`event: {
  trigger: "idle",
  mode: "ImmediateSurvey",
  urls: [
    { url: "/", rule: "equals" }
  ],
  // Idle specific settings
  idleThreshold: 30, // Seconds of inactivity
  displayDelay: "immediate",
  displayPercentage: 100
}`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Best Practices</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 border-green-500">
              <h4 className="font-semibold mb-3 text-green-700 dark:text-green-400">
                ✅ Recommendations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  • Set threshold between 30-60 seconds for most use cases
                </li>
                <li>• Use for non-intrusive engagement prompts</li>
                <li>• Combine with page view duration for better targeting</li>
                <li>• Consider user context (reading vs. form filling)</li>
                <li>• Test different thresholds for your audience</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 border-yellow-500">
              <h4 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">
                ⚠️ Considerations
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Too short: May interrupt users reading content</li>
                <li>• Too long: Users may have already left</li>
                <li>• Mobile: Users may be reading without scrolling</li>
                <li>• Tab switching: Users may be active in other tabs</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Testing Tips</h3>
            <p className="text-muted-foreground mb-4">
              The test page uses a {idleThreshold}-second threshold for quick
              testing. In production, you'll typically use 30-60 seconds
              depending on your use case.
            </p>
            <div className="bg-muted rounded p-4">
              <p className="text-sm">
                <strong>Pro tip:</strong> Watch the Activity Log panel to see
                what events reset the idle timer. This helps you understand how
                sensitive the detection is.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
