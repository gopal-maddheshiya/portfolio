import { PERSONAL_INFO } from "@/data/profile";
import {
  buildSystemContextFromData,
  generateInstantKnowledgeResponse,
  type ChatMessage,
} from "@/lib/ai-knowledge";
import { DEFAULT_PORTFOLIO_DATA, fetchPortfolioData, type PortfolioData } from "@/lib/supabase";
import { fetchLeetCodeStats } from "@/server/leetcode";

// Verified Google Gemini API models in latency-first fallback priority order
const STABLE_FAST_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

function formatConversationContents(
  history: ChatMessage[],
  userPrompt: string,
): { role: "user" | "model"; parts: { text: string }[] }[] {
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const m of history) {
    if (!m.content || typeof m.content !== "string") continue;
    if (contents.length === 0 && m.role !== "user") continue;

    const role: "user" | "model" = m.role === "assistant" ? "model" : "user";
    const lastItem = contents[contents.length - 1];
    if (lastItem && lastItem.role === role) {
      const part = lastItem.parts[0];
      if (part) {
        part.text += `\n${m.content}`;
      } else {
        lastItem.parts.push({ text: m.content });
      }
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }

  const lastTurn = contents[contents.length - 1];
  if (lastTurn && lastTurn.role === "user") {
    const part = lastTurn.parts[0];
    if (part) {
      part.text += `\n${userPrompt}`;
    } else {
      lastTurn.parts.push({ text: userPrompt });
    }
  } else {
    contents.push({
      role: "user",
      parts: [{ text: userPrompt }],
    });
  }

  return contents;
}

async function resolveLiveContext(): Promise<{
  portfolioData: PortfolioData;
  leetCodeTotal?: number;
}> {
  let portfolioData = DEFAULT_PORTFOLIO_DATA;
  try {
    portfolioData = await Promise.race([
      fetchPortfolioData(),
      new Promise<PortfolioData>((resolve) =>
        setTimeout(() => resolve(DEFAULT_PORTFOLIO_DATA), 1500),
      ),
    ]);
  } catch {
    portfolioData = DEFAULT_PORTFOLIO_DATA;
  }

  let leetCodeTotal: number | undefined;
  try {
    const handle = portfolioData.personalInfo.leetcodeUsername || PERSONAL_INFO.leetcodeUsername;
    const stats = await Promise.race([
      fetchLeetCodeStats(handle),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (stats && typeof stats.totalSolved === "number" && stats.totalSolved > 0) {
      leetCodeTotal = stats.totalSolved;
    }
  } catch {
    leetCodeTotal = undefined;
  }

  return leetCodeTotal !== undefined ? { portfolioData, leetCodeTotal } : { portfolioData };
}

function streamInstantResponse(
  message: string,
  portfolioData: PortfolioData,
  leetCodeTotal?: number,
): Response {
  const encoder = new TextEncoder();
  const instantResult = generateInstantKnowledgeResponse(message, {
    portfolioData,
    leetCodeTotal,
  });

  const stream = new ReadableStream({
    start(controller) {
      const words = instantResult.reply.split(" ");
      let idx = 0;
      const chunkSize = 4;
      while (idx < words.length) {
        const piece =
          words.slice(idx, idx + chunkSize).join(" ") + (idx + chunkSize < words.length ? " " : "");
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: piece })}\n\n`));
        idx += chunkSize;
      }

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            done: true,
            suggestions: instantResult.suggestions,
            actions: instantResult.actions,
          })}\n\n`,
        ),
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

function readServerApiKey(serverEnv?: Record<string, unknown>): string {
  const fromServerEnv =
    (typeof serverEnv?.["GEMINI_API_KEY"] === "string" && serverEnv["GEMINI_API_KEY"]) ||
    (typeof serverEnv?.["AI_API_KEY"] === "string" && serverEnv["AI_API_KEY"]) ||
    (typeof serverEnv?.["GOOGLE_AI_KEY"] === "string" && serverEnv["GOOGLE_AI_KEY"]);

  if (fromServerEnv) return fromServerEnv;

  if (typeof process !== "undefined" && process.env) {
    return (
      process.env["GEMINI_API_KEY"] ||
      process.env["AI_API_KEY"] ||
      process.env["GOOGLE_AI_KEY"] ||
      ""
    );
  }

  return "";
}

/**
 * Server-only SSE streaming chat handler for `/api/chat`.
 */
export async function handleAiChatStream(
  message: string,
  history: ChatMessage[],
  serverEnv?: Record<string, unknown>,
): Promise<Response> {
  const apiKey = readServerApiKey(serverEnv);
  const { portfolioData, leetCodeTotal } = await resolveLiveContext();
  const encoder = new TextEncoder();

  if (!apiKey) {
    return streamInstantResponse(message, portfolioData, leetCodeTotal);
  }

  const systemInstruction = buildSystemContextFromData(portfolioData, leetCodeTotal);
  const contents = formatConversationContents(history, message);

  let upstreamResponse: Response | null = null;

  for (const model of STABLE_FAST_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        },
      );

      clearTimeout(timeoutId);

      if (res.ok && res.body) {
        upstreamResponse = res;
        break;
      } else {
        console.warn(`Model ${model} returned non-200:`, res.status);
      }
    } catch (modelErr) {
      console.warn(`Model ${model} failed, trying next:`, modelErr);
    }
  }

  if (!upstreamResponse || !upstreamResponse.body) {
    return streamInstantResponse(message, portfolioData, leetCodeTotal);
  }

  const reader = upstreamResponse.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const activeResume = portfolioData.personalInfo.resume || PERSONAL_INFO.resume;
  const activeWhatsapp = portfolioData.personalInfo.whatsapp || PERSONAL_INFO.whatsapp;

  const customStream = new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr) continue;

            try {
              const parsed = JSON.parse(jsonStr) as {
                candidates?: { content?: { parts?: { text?: string }[] } }[];
              };
              const parts = parsed.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                for (const p of parts) {
                  if (p && typeof p.text === "string" && p.text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ chunk: p.text })}\n\n`),
                    );
                  }
                }
              }
            } catch {
              // Partial JSON line
            }
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              suggestions: [
                "What projects has Gopal built?",
                "Tell me about his DSA skills",
                "Download Gopal's Resume",
              ],
              actions: [
                { label: "📄 Download Resume", url: activeResume, action: "resume" },
                {
                  label: "💬 Message on WhatsApp",
                  url: `https://wa.me/${activeWhatsapp}`,
                  action: "whatsapp",
                },
              ],
            })}\n\n`,
          ),
        );
      } catch (err) {
        console.error("Stream forward error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
