import { PERSONAL_INFO } from "@/data/profile";
import {
  generateInstantKnowledgeResponse,
  type ChatAction,
  type ChatMessage,
} from "@/lib/ai-knowledge";
import type { PortfolioData } from "@/lib/supabase";

/**
 * Client-side SSE streaming helper for Ask Gopal chat.
 * Falls back once to the synchronized instant knowledge engine if `/api/chat` is unavailable.
 */
export async function askGopalAiStream({
  message,
  history,
  portfolioData,
  leetCodeTotal,
  onChunk,
  onComplete,
  onError,
  resumeUrl,
  whatsappNumber,
  signal,
}: {
  message: string;
  history?: ChatMessage[] | undefined;
  portfolioData?: Partial<PortfolioData> | null | undefined;
  leetCodeTotal?: number | undefined;
  onChunk: (chunk: string) => void;
  onComplete: (data: { suggestions: string[]; actions?: ChatAction[] | undefined }) => void;
  onError?: ((err: Error) => void) | undefined;
  resumeUrl?: string | undefined;
  whatsappNumber?: string | undefined;
  signal?: AbortSignal | undefined;
}): Promise<void> {
  const activeResume = resumeUrl || portfolioData?.personalInfo?.resume || PERSONAL_INFO.resume;
  const activeWhatsapp =
    whatsappNumber || portfolioData?.personalInfo?.whatsapp || PERSONAL_INFO.whatsapp;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: signal ?? null,
      body: JSON.stringify({
        message,
        history,
        stream: true,
        resumeUrl: activeResume,
        whatsappNumber: activeWhatsapp,
      }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let hasReceivedAnyChunk = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done || signal?.aborted) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const dataStr = trimmed.slice(5).trim();
          if (!dataStr) continue;

          try {
            const data = JSON.parse(dataStr) as {
              chunk?: string;
              done?: boolean;
              suggestions?: string[];
              actions?: ChatAction[];
            };

            if (data.chunk) {
              hasReceivedAnyChunk = true;
              onChunk(data.chunk);
            }

            if (data.done) {
              const sanitizedActions = data.actions?.map((act) => {
                if (act.action === "resume") return { ...act, url: activeResume };
                if (act.action === "whatsapp")
                  return { ...act, url: `https://wa.me/${activeWhatsapp}` };
                return act;
              });

              onComplete({
                suggestions: data.suggestions ?? [],
                actions: sanitizedActions,
              });
              return;
            }
          } catch {
            // Partial SSE chunk line
          }
        }
      }

      if (signal?.aborted) return;

      if (hasReceivedAnyChunk) {
        onComplete({
          suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills"],
          actions: [
            { label: "📄 Download Resume", url: activeResume, action: "resume" },
            {
              label: "💬 Message on WhatsApp",
              url: `https://wa.me/${activeWhatsapp}`,
              action: "whatsapp",
            },
          ],
        });
        return;
      }
    }
  } catch (err) {
    if (signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) {
      return;
    }
    console.warn("API /api/chat unavailable, using synced local fallback:", err);
  }

  if (signal?.aborted) return;

  try {
    const instant = generateInstantKnowledgeResponse(message, {
      portfolioData,
      leetCodeTotal,
      resumeUrl: activeResume,
      whatsappNumber: activeWhatsapp,
    });
    const words = instant.reply.split(" ");
    await new Promise<void>((resolve) => {
      let i = 0;
      const timer = setInterval(() => {
        if (signal?.aborted) {
          clearInterval(timer);
          resolve();
          return;
        }
        if (i < words.length) {
          const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
          onChunk(chunk);
          i += 3;
        } else {
          clearInterval(timer);
          onComplete({
            suggestions: instant.suggestions,
            actions: instant.actions,
          });
          resolve();
        }
      }, 28);
    });
  } catch (fallbackErr) {
    onError?.(fallbackErr instanceof Error ? fallbackErr : new Error(String(fallbackErr)));
  }
}
