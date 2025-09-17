import type { Config, EventConfig, UrlConfigList } from "../store";

/**
 * Checks if a URL matches a given rule
 */
function matchesUrlRule(currentUrl: string, urlConfig: UrlConfigList): boolean {
  const { url, rule } = urlConfig;
  const normalizedCurrent = currentUrl.toLowerCase();
  const normalizedTarget = url.toLowerCase();

  switch (rule) {
    case "exact":
      return normalizedCurrent === normalizedTarget;
    case "contains":
      return normalizedCurrent.includes(normalizedTarget);
    case "startsWith":
      return normalizedCurrent.startsWith(normalizedTarget);
    case "endsWith":
      return normalizedCurrent.endsWith(normalizedTarget);
    case "notContains":
      return !normalizedCurrent.includes(normalizedTarget);
    case "notMatches":
      return normalizedCurrent !== normalizedTarget;
    default:
      return false;
  }
}

/**
 * Checks if an event should be active on the current path
 */
function isEventActiveForPath(
  event: EventConfig,
  currentPath: string
): boolean {
  // If no URL rules are defined, the event is active everywhere
  if (!event.urls || event.urls.length === 0) {
    return true;
  }

  // Check if any URL rule matches
  return event.urls.some((urlConfig) => matchesUrlRule(currentPath, urlConfig));
}

/**
 * Extracts events that should be active on the current page path
 */
export function extractActiveEventPerPath(config: Config): EventConfig[] {
  const currentPath = window.location.origin + window.location.pathname;

  // Filter events that match the current path
  return config.events.filter((event) =>
    isEventActiveForPath(event, currentPath)
  );
}

/**
 * Gets events active for a specific path (useful for testing or preview)
 */
export function extractActiveEventForPath(
  config: Config,
  path: string
): EventConfig[] {
  return config.events.filter((event) => isEventActiveForPath(event, path));
}

/**
 * Gets all events grouped by their trigger type for the current path
 */
export function extractActiveEventsByTrigger(
  config: Config
): Record<EventConfig["trigger"], EventConfig[]> {
  const activeEvents = extractActiveEventPerPath(config);

  return activeEvents.reduce((acc, event) => {
    if (!acc[event.trigger]) {
      acc[event.trigger] = [];
    }
    acc[event.trigger].push(event);
    return acc;
  }, {} as Record<EventConfig["trigger"], EventConfig[]>);
}

/**
 * Checks if any events are active for the current path
 */
export function hasActiveEvents(config: Config): boolean {
  return extractActiveEventPerPath(config).length > 0;
}

/**
 * Gets the first active event for a specific trigger type
 */
export function getFirstActiveEventByTrigger(
  config: Config,
  trigger: EventConfig["trigger"]
): EventConfig | null {
  const activeEvents = extractActiveEventPerPath(config);
  return activeEvents.find((event) => event.trigger === trigger) || null;
}
