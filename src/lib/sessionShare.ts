const SESSION_PARAM = "session";

export type ShareableConfig = {
  targetApi: string;
  apiKey: string;
  cdnlink: string;
  isDebug: boolean;
  targetAttributes: { key: string; value: string }[];
};

/**
 * Encodes a config object into a base64 URL-safe string.
 */
export function encodeSession(config: ShareableConfig): string {
  return btoa(encodeURIComponent(JSON.stringify(config)));
}

/**
 * Decodes a base64 session string back into a config object.
 * Returns null if decoding fails.
 */
export function decodeSession(encoded: string): ShareableConfig | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

/**
 * Builds a full shareable URL containing the encoded session config.
 * The URL points to the app root so the session param is detected on landing.
 */
export function buildShareUrl(config: ShareableConfig): string {
  const encoded = encodeSession(config);
  const basePath = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  return `${window.location.origin}${basePath}/?${SESSION_PARAM}=${encoded}`;
}

/**
 * Reads the session param from the current URL.
 * Returns null if not present.
 */
export function getSessionParam(): string | null {
  return new URLSearchParams(window.location.search).get(SESSION_PARAM);
}
