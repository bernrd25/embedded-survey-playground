/**
 * SDK Monitor Types
 * Type definitions for tracking CX.Gaia SDK behavior
 */

export type SDKLogLevel = "debug" | "log" | "info" | "warn" | "error";

export type SDKEventType =
  | "initialization"
  | "api_call"
  | "api_response"
  | "event_triggered"
  | "survey_display"
  | "survey_hidden"
  | "error"
  | "storage_operation"
  | "url_match"
  | "general";

export interface SDKLog {
  id: string;
  timestamp: number;
  level: SDKLogLevel;
  eventType: SDKEventType;
  message: string;
  details?: unknown;
  emoji?: string;
  raw?: unknown[];
}

export interface SDKState {
  isInitialized: boolean;
  apiKey?: string;
  sessionId?: string;
  targetAttributes?: Record<string, string>;
  environment?: "dev" | "uat" | "prod" | "local";
  apiVersion?: "v1" | "v2";
  debugMode: boolean;
}

export interface APICall {
  id: string;
  timestamp: number;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  response?: unknown;
  status?: number;
  duration?: number;
  error?: string;
}

export interface SDKEvent {
  id: string;
  timestamp: number;
  type: "pageView" | "scrollDepth" | "click" | "exitIntent" | "idle";
  details?: Record<string, unknown>;
  triggered: boolean;
}

export interface StorageOperation {
  id: string;
  timestamp: number;
  operation: "get" | "set" | "remove" | "clear";
  key: string;
  value?: unknown;
  storageType: "localStorage" | "sessionStorage";
}
