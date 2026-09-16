import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleAiChatStream } from "./server/ai";
import { fetchLeetCodeStats } from "./server/leetcode";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

// Simple in-memory rate limiter for the public AI endpoint (per IP).
// Vercel edge/serverless instances are isolated per region, so this is a
// best-effort throttle against casual abuse, not a hard global quota.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_BUDGET = 20;
const rateBuckets = new Map<string, { count: number; windowStart: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(request: Request): boolean {
  const key = getClientIp(request);
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || now - bucket.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_BUDGET;
}

function tooManyRequests(): Response {
  return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), {
    status: 429,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "retry-after": "60",
      "cache-control": "no-store",
    },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/chat" && request.method === "POST") {
        if (isRateLimited(request)) {
          return tooManyRequests();
        }

        try {
          const body = (await request.json()) as {
            message?: string;
            history?: unknown[];
            stream?: boolean;
          };
          const message = typeof body.message === "string" ? body.message : "";
          const history = Array.isArray(body.history) ? (body.history as never) : [];
          const serverEnv = (typeof env === "object" && env !== null ? env : {}) as Record<
            string,
            unknown
          >;

          return await handleAiChatStream(message, history, serverEnv);
        } catch (apiErr) {
          console.error("API /api/chat error:", apiErr);
          return new Response(JSON.stringify({ error: "Failed to process AI chat request" }), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      }

      if (
        url.pathname === "/api/leetcode" &&
        (request.method === "GET" || request.method === "POST")
      ) {
        try {
          const stats = await fetchLeetCodeStats();
          return new Response(JSON.stringify(stats), {
            status: 200,
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
            },
          });
        } catch (lcErr) {
          console.error("API /api/leetcode error:", lcErr);
          return new Response(JSON.stringify({ error: "Failed to fetch LeetCode statistics" }), {
            status: 500,
            headers: { "content-type": "application/json; charset=utf-8" },
          });
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
