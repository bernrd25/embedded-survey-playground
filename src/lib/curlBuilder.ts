import type { APICall } from "./sdkMonitor/types";

/**
 * Builds a copy-pasteable cURL command from an APICall record.
 */
export function buildCurlCommand(call: APICall): string {
  const parts: string[] = [`curl -X ${call.method}`];

  if (call.headers && typeof call.headers === "object") {
    Object.entries(call.headers).forEach(([key, value]) => {
      parts.push(`  -H '${key}: ${value}'`);
    });
  }

  if (call.body) {
    const bodyStr =
      typeof call.body === "string" ? call.body : JSON.stringify(call.body);
    parts.push(`  -d '${bodyStr}'`);
  }

  parts.push(`  '${call.url}'`);

  return parts.join(" \\\n");
}
