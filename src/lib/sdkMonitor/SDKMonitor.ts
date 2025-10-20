/**
 * SDK Monitor Service
 * Intercepts and tracks CX.Gaia SDK operations
 */

import type {
  SDKLog,
  SDKLogLevel,
  SDKEventType,
  APICall,
  SDKState,
} from "./types";

type LogSubscriber = (log: SDKLog) => void;
type StateSubscriber = (state: SDKState) => void;

export class SDKMonitor {
  private static instance: SDKMonitor;
  private logs: SDKLog[] = [];
  private apiCalls: APICall[] = [];
  private state: SDKState = {
    isInitialized: false,
    debugMode: false,
  };

  private logSubscribers: Set<LogSubscriber> = new Set();
  private stateSubscribers: Set<StateSubscriber> = new Set();
  private isIntercepting = false;

  // Store original console methods
  private originalConsole = {
    debug: console.debug,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  private constructor() {}

  static getInstance(): SDKMonitor {
    if (!this.instance) {
      this.instance = new SDKMonitor();
    }
    return this.instance;
  }

  /**
   * Start intercepting console and SDK operations
   */
  startMonitoring(): void {
    if (this.isIntercepting) return;

    this.isIntercepting = true;
    this.interceptConsole();
    this.interceptFetch();
    this.interceptLocalStorage();

    this.addLog({
      level: "info",
      eventType: "general",
      message: "🎯 SDK Monitor started",
      details: { timestamp: new Date().toISOString() },
    });
  }

  /**
   * Stop monitoring and restore original methods
   */
  stopMonitoring(): void {
    if (!this.isIntercepting) return;

    this.isIntercepting = false;
    this.restoreConsole();
    // Note: fetch and localStorage interception cleanup would need more complex restoration

    this.addLog({
      level: "info",
      eventType: "general",
      message: "🛑 SDK Monitor stopped",
    });
  }

  /**
   * Intercept console methods to capture SDK logs
   */
  private interceptConsole(): void {
    const levels: SDKLogLevel[] = ["debug", "log", "info", "warn", "error"];

    levels.forEach((level) => {
      console[level] = (...args: unknown[]) => {
        // Call original first
        this.originalConsole[level].apply(console, args);

        // Check if it's a Gaia log and capture it
        if (this.isGaiaLog(args)) {
          const logEntry = this.parseGaiaLog(level, args);
          this.addLog(logEntry);
        }
      };
    });
  }

  /**
   * Restore original console methods
   */
  private restoreConsole(): void {
    console.debug = this.originalConsole.debug;
    console.log = this.originalConsole.log;
    console.info = this.originalConsole.info;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
  }

  /**
   * Detect if log is from CX.Gaia SDK
   */
  private isGaiaLog(args: unknown[]): boolean {
    if (args.length === 0) return false;

    const firstArg = String(args[0]);

    // Check for Gaia-specific patterns
    return (
      firstArg.includes("🎯") ||
      firstArg.includes("🚀") ||
      firstArg.includes("✅") ||
      firstArg.includes("❌") ||
      firstArg.includes("⚠️") ||
      firstArg.includes("🔄") ||
      firstArg.includes("📊") ||
      firstArg.toLowerCase().includes("cxgaia") ||
      firstArg.toLowerCase().includes("webintercept") ||
      firstArg.toLowerCase().includes("initializing") ||
      (firstArg.toLowerCase().includes("sdk") &&
        firstArg.toLowerCase().includes("loaded"))
    );
  }

  /**
   * Parse Gaia log into structured format
   */
  private parseGaiaLog(
    level: SDKLogLevel,
    args: unknown[]
  ): Omit<SDKLog, "id" | "timestamp"> {
    const message = String(args[0]);
    const emoji = this.extractEmoji(message);
    const eventType = this.detectEventType(message);

    return {
      level,
      eventType,
      message: message.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim(), // Remove emojis from message
      emoji,
      details: args.length > 1 ? args.slice(1) : undefined,
      raw: args,
    };
  }

  /**
   * Extract emoji from message
   */
  private extractEmoji(message: string): string | undefined {
    const emojiMatch = message.match(/[\u{1F300}-\u{1F9FF}]/u);
    return emojiMatch ? emojiMatch[0] : undefined;
  }

  /**
   * Detect event type from message content
   */
  private detectEventType(message: string): SDKEventType {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("initializ")) return "initialization";
    if (lowerMessage.includes("api call") || lowerMessage.includes("fetching"))
      return "api_call";
    if (lowerMessage.includes("response") || lowerMessage.includes("received"))
      return "api_response";
    if (lowerMessage.includes("trigger") || lowerMessage.includes("event"))
      return "event_triggered";
    if (lowerMessage.includes("display") || lowerMessage.includes("show"))
      return "survey_display";
    if (lowerMessage.includes("hidden") || lowerMessage.includes("close"))
      return "survey_hidden";
    if (lowerMessage.includes("error") || lowerMessage.includes("fail"))
      return "error";
    if (
      lowerMessage.includes("storage") ||
      lowerMessage.includes("localstorage")
    )
      return "storage_operation";
    if (lowerMessage.includes("url") || lowerMessage.includes("match"))
      return "url_match";

    return "general";
  }

  /**
   * Intercept fetch calls to track API requests
   */
  private interceptFetch(): void {
    const originalFetch = window.fetch;

    window.fetch = async (...args): Promise<Response> => {
      const [url, options] = args;
      const urlString = typeof url === "string" ? url : url.toString();

      // Only track if it looks like a Gaia API call
      if (!this.isGaiaAPICall(urlString)) {
        return originalFetch.apply(window, args);
      }

      const callId = this.generateId();
      const startTime = Date.now();

      const apiCall: APICall = {
        id: callId,
        timestamp: startTime,
        url: urlString,
        method: options?.method || "GET",
        headers: options?.headers as Record<string, string>,
        body: options?.body,
      };

      this.apiCalls.push(apiCall);
      this.addLog({
        level: "info",
        eventType: "api_call",
        message: `API Call: ${apiCall.method} ${urlString}`,
        details: apiCall,
      });

      try {
        const response = await originalFetch.apply(window, args);
        const duration = Date.now() - startTime;

        // Clone response to read body without consuming it
        const clonedResponse = response.clone();
        let responseData;
        try {
          responseData = await clonedResponse.json();
        } catch {
          responseData = await clonedResponse.text();
        }

        apiCall.response = responseData;
        apiCall.status = response.status;
        apiCall.duration = duration;

        this.addLog({
          level: response.ok ? "info" : "warn",
          eventType: "api_response",
          message: `API Response: ${response.status} (${duration}ms)`,
          details: { ...apiCall, response: responseData },
        });

        return response;
      } catch (error) {
        const duration = Date.now() - startTime;
        apiCall.error = error instanceof Error ? error.message : String(error);
        apiCall.duration = duration;

        this.addLog({
          level: "error",
          eventType: "error",
          message: `API Error: ${apiCall.error}`,
          details: apiCall,
        });

        throw error;
      }
    };
  }

  /**
   * Check if URL is a Gaia API call
   */
  private isGaiaAPICall(url: string): boolean {
    return (
      url.includes("feedback.concentrixcx.com") ||
      url.includes("gaia") ||
      url.includes("survey")
    );
  }

  /**
   * Intercept localStorage operations
   */
  private interceptLocalStorage(): void {
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    const originalClear = Storage.prototype.clear;

    Storage.prototype.setItem = function (key: string, value: string) {
      if (key.startsWith("CXGAIA") || key.startsWith("survey-")) {
        SDKMonitor.getInstance().addLog({
          level: "debug",
          eventType: "storage_operation",
          message: `LocalStorage SET: ${key}`,
          details: { key, value, operation: "set" },
        });
      }
      return originalSetItem.call(this, key, value);
    };

    Storage.prototype.getItem = function (key: string) {
      const value = originalGetItem.call(this, key);
      if (key.startsWith("CXGAIA") || key.startsWith("survey-")) {
        SDKMonitor.getInstance().addLog({
          level: "debug",
          eventType: "storage_operation",
          message: `LocalStorage GET: ${key}`,
          details: { key, value, operation: "get" },
        });
      }
      return value;
    };

    Storage.prototype.removeItem = function (key: string) {
      if (key.startsWith("CXGAIA") || key.startsWith("survey-")) {
        SDKMonitor.getInstance().addLog({
          level: "debug",
          eventType: "storage_operation",
          message: `LocalStorage REMOVE: ${key}`,
          details: { key, operation: "remove" },
        });
      }
      return originalRemoveItem.call(this, key);
    };

    Storage.prototype.clear = function () {
      SDKMonitor.getInstance().addLog({
        level: "warn",
        eventType: "storage_operation",
        message: "LocalStorage CLEAR",
        details: { operation: "clear" },
      });
      return originalClear.call(this);
    };
  }

  /**
   * Add a log entry
   */
  private addLog(logEntry: Omit<SDKLog, "id" | "timestamp">): void {
    const log: SDKLog = {
      ...logEntry,
      id: this.generateId(),
      timestamp: Date.now(),
    };

    this.logs.push(log);

    // Keep only last 1000 logs to prevent memory issues
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Notify subscribers
    this.logSubscribers.forEach((subscriber) => subscriber(log));
  }

  /**
   * Update SDK state
   */
  updateState(updates: Partial<SDKState>): void {
    this.state = { ...this.state, ...updates };
    this.stateSubscribers.forEach((subscriber) => subscriber(this.state));
  }

  /**
   * Subscribe to log updates
   */
  subscribeToLogs(callback: LogSubscriber): () => void {
    this.logSubscribers.add(callback);
    return () => this.logSubscribers.delete(callback);
  }

  /**
   * Subscribe to state updates
   */
  subscribeToState(callback: StateSubscriber): () => void {
    this.stateSubscribers.add(callback);
    return () => this.stateSubscribers.delete(callback);
  }

  /**
   * Get all logs
   */
  getLogs(): SDKLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by type
   */
  getLogsByType(eventType: SDKEventType): SDKLog[] {
    return this.logs.filter((log) => log.eventType === eventType);
  }

  /**
   * Get API calls
   */
  getAPICalls(): APICall[] {
    return [...this.apiCalls];
  }

  /**
   * Get current state
   */
  getState(): SDKState {
    return { ...this.state };
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
    this.apiCalls = [];
    this.addLog({
      level: "info",
      eventType: "general",
      message: "🗑️ Logs cleared",
    });
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(
      {
        logs: this.logs,
        apiCalls: this.apiCalls,
        state: this.state,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const sdkMonitor = SDKMonitor.getInstance();
