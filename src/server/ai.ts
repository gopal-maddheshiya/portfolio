import {
  CERTIFICATIONS,
  CODING_PROFILES,
  DSA_INFO,
  EDUCATION,
  FOCUS_AREAS,
  HIGHLIGHTS,
  JOURNEY,
  PERSONAL_INFO,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/profile";

export type ChatAction = {
  label: string;
  url?: string | undefined;
  action?: "resume" | "contact" | "projects" | "dsa" | "whatsapp" | "email" | undefined;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number | undefined;
  suggestions?: string[] | undefined;
  actions?: ChatAction[] | undefined;
};

/**
 * Builds the comprehensive prompt including all profile data (Education, Schooling, Projects, DSA, Skills).
 */
function generateSystemContext(): string {
  const skillsList = SKILL_GROUPS.map(
    (g) => `${g.title} (${g.primary ? "Primary Focus" : "Secondary"}): ${g.skills.join(", ")}`,
  ).join("\n- ");

  const projectsList = PROJECTS.map(
    (p, i) =>
      `Project ${i + 1}: ${p.title} (${p.year})\n  Summary: ${p.summary}\n  Problem/Goal: ${p.problem}\n  Technologies: ${p.technologies.join(", ")}\n  Key Features: ${p.features.join("; ")}\n  GitHub: ${p.githubUrl}${p.liveUrl ? `\n  Live Demo: ${p.liveUrl}` : ""}`,
  ).join("\n\n");

  const journeyList = JOURNEY.map(
    (j) =>
      `Phase ${j.phase}: ${j.title} [Status: ${j.status}] - ${j.detail} (Tags: ${j.tags.join(", ")})`,
  ).join("\n- ");

  const educationList = EDUCATION.map(
    (e) => `- ${e.title}: ${e.org} (${e.period})${e.detail ? ` [${e.detail}]` : ""}`,
  ).join("\n");

  const certsList = CERTIFICATIONS.map(
    (c) => `- ${c.title} by ${c.org} (${c.period}) - ${c.detail} (Skills: ${c.skills.join(", ")})`,
  ).join("\n");

  const profilesList = CODING_PROFILES.filter((cp) => cp.url)
    .map((cp) => `- ${cp.name}: ${cp.url} (@${cp.username}) - ${cp.description}`)
    .join("\n");

  return `You are Ask Gopal, the official AI assistant for Gopal Maddheshiya's personal portfolio.
You are powered by Google Gemini AI and represent Gopal directly.

LANGUAGE & TONE RULES:
- ALWAYS respond in the SAME language the user writes in! If user writes in Hindi or Hinglish, respond in natural, fluent Hindi/Hinglish! If in English, reply in professional English.
- NEVER start every message by re-introducing yourself ("Hello I am Ask Gopal..."). The user already knows. Jump directly into answering the user's question!
- Be conversational, friendly, intelligent, helpful, and concise.

ABOUT GOPAL MADDHESHIYA:
- Full Name: ${PERSONAL_INFO.name}
- Current Role: ${PERSONAL_INFO.role} (${PERSONAL_INFO.subtitle})
- Location: ${PERSONAL_INFO.location}
- College / University: B.Tech in Computer Science & Engineering (2024–2028) at Shri Ramswaroop Memorial University (SRMU), Current CGPA: 7.62
- Schooling: Modern Academy (Class X in 2021, Class XII in 2024)
- Email: ${PERSONAL_INFO.email}
- WhatsApp / Phone: +${PERSONAL_INFO.whatsapp}
- GitHub: ${PERSONAL_INFO.github}
- LeetCode: ${PERSONAL_INFO.leetcode}
- LinkedIn: ${PERSONAL_INFO.linkedin}
- Resume / CV: ${PERSONAL_INFO.resume}
- Availability: Currently open to Software Engineer / Full-Stack internship opportunities and developer roles.

ACADEMIC BACKGROUND & SCHOOLING:
${educationList}

KEY HIGHLIGHTS:
${HIGHLIGHTS.map((h) => `- ${h.label}: ${h.detail}`).join("\n")}

CORE TECHNICAL SKILLS:
- ${skillsList}

CURRENT FOCUS AREAS:
- ${FOCUS_AREAS.join("\n- ")}

FEATURED PROJECTS:
${projectsList}

DATA STRUCTURES & ALGORITHMS (DSA):
- Problems Solved: ${DSA_INFO.problemsSolved} on LeetCode using ${DSA_INFO.language}
- Repository: ${DSA_INFO.repoName} (${DSA_INFO.repoUrl})
- Topics Practiced: ${DSA_INFO.topics.join(", ")}
- Methodology: ${DSA_INFO.notes.join("; ")}

CODING PROFILES:
${profilesList}

JOURNEY / ROADMAP:
- ${journeyList}

CERTIFICATIONS:
${certsList}

HOW TO ANSWER:
1. Answer ANY question asked by the user — including questions about Gopal's school (Modern Academy), college (SRMU), marks/CGPA (7.62), projects, DSA, coding, or general computer science / technical questions (like OOPs concepts, Java, React, Node.js, Web Development, Algorithms).
2. For technical questions (OOPs, Java, DSA, Web Dev), explain the concepts thoroughly, cleanly, and clearly in the user's language.
3. If asked about hiring or internships, emphasize that Gopal is currently open to internship opportunities and developer roles, and invite them to connect via Email (${PERSONAL_INFO.email}), WhatsApp (+${PERSONAL_INFO.whatsapp}), or view his resume.
4. CRISP & FAST RESPONSES: Be direct and conversational. Keep general responses concise (2 to 4 sentences or clean bullet points) unless the user asks for in-depth details.
5. Use clean markdown formatting (bold headers, bullet points).`;
}

// High-capacity & ultra-fast stable models in priority order
const STABLE_FAST_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.8-flash",
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

/**
 * Handles Real-Time Server-Sent Events (SSE) Streaming Response
 */
export async function handleAiChatStream(
  message: string,
  history: ChatMessage[],
  serverEnv?: Record<string, unknown>,
): Promise<Response> {
  const apiKey =
    (typeof serverEnv?.["GEMINI_API_KEY"] === "string" && serverEnv["GEMINI_API_KEY"]) ||
    (typeof serverEnv?.["VITE_GEMINI_API_KEY"] === "string" && serverEnv["VITE_GEMINI_API_KEY"]) ||
    (typeof process !== "undefined" &&
      (process.env?.["GEMINI_API_KEY"] ||
        process.env?.["VITE_GEMINI_API_KEY"] ||
        process.env?.["AI_API_KEY"] ||
        process.env?.["GOOGLE_AI_KEY"])) ||
    "";

  const encoder = new TextEncoder();

  if (!apiKey) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              chunk: "Gemini API key is not configured in Vercel environment variables. Please add `GEMINI_API_KEY` in your Vercel project settings.",
            })}\n\n`,
          ),
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills"],
              actions: [
                { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
                {
                  label: "💬 Message on WhatsApp",
                  url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
                  action: "whatsapp",
                },
              ],
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

  const systemInstruction = generateSystemContext();
  const contents = formatConversationContents(history, message);

  let upstreamResponse: Response | null = null;

  for (const model of STABLE_FAST_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      if (res.ok && res.body) {
        upstreamResponse = res;
        break;
      }
      console.warn(`Model ${model} streaming returned status ${res.status}`);
    } catch (err) {
      console.warn(`Model ${model} streaming network error:`, err);
    }
  }

  if (!upstreamResponse || !upstreamResponse.body) {
    const fallbackResult = await processAiChatRequest(message, history, serverEnv);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ chunk: fallbackResult.reply })}\n\n`),
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              suggestions: fallbackResult.suggestions,
              actions: fallbackResult.actions,
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

  const reader = upstreamResponse.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

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
            if (trimmed.startsWith("data:")) {
              const jsonStr = trimmed.slice(5).trim();
              if (jsonStr) {
                try {
                  const parsed = JSON.parse(jsonStr) as {
                    candidates?: { content?: { parts?: { text?: string }[] } }[];
                  };
                  const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (textChunk) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`),
                    );
                  }
                } catch {
                  // Partial JSON line
                }
              }
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
                "Is Gopal currently open to internship opportunities?",
                "Download his resume",
              ],
              actions: [
                { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
                {
                  label: "💬 Message on WhatsApp",
                  url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
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

/**
 * Calls the Google Gemini API with direct fast Flash models.
 */
export async function callGeminiApi(
  apiKey: string,
  history: ChatMessage[],
  userPrompt: string,
): Promise<string> {
  const systemInstruction = generateSystemContext();
  const contents = formatConversationContents(history, userPrompt);
  let lastError: Error | null = null;

  for (const model of STABLE_FAST_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      }

      const errorText = await response.text();
      console.warn(`Model ${model} returned ${response.status}:`, errorText);
      lastError = new Error(`Model ${model} failed (${response.status})`);
    } catch (err) {
      console.warn(`Error connecting to model ${model}:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error("All available Gemini models failed to generate a response.");
}

/**
 * Server-side processor for /api/chat requests (Non-streaming fallback).
 */
export async function processAiChatRequest(
  message: string,
  history?: ChatMessage[],
  serverEnv?: Record<string, unknown>,
): Promise<{
  reply: string;
  suggestions: string[];
  actions?: ChatAction[] | undefined;
}> {
  const apiKey =
    (typeof serverEnv?.["GEMINI_API_KEY"] === "string" && serverEnv["GEMINI_API_KEY"]) ||
    (typeof serverEnv?.["VITE_GEMINI_API_KEY"] === "string" && serverEnv["VITE_GEMINI_API_KEY"]) ||
    (typeof process !== "undefined" &&
      (process.env?.["GEMINI_API_KEY"] ||
        process.env?.["VITE_GEMINI_API_KEY"] ||
        process.env?.["AI_API_KEY"] ||
        process.env?.["GOOGLE_AI_KEY"])) ||
    "";

  if (!apiKey) {
    return {
      reply: `Gemini API key is not configured in Vercel environment variables. Please add \`GEMINI_API_KEY\` in your Vercel project settings to enable live AI responses.`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA skills",
        "How can I contact Gopal?",
      ],
      actions: [
        { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
        {
          label: "💬 Message on WhatsApp",
          url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
          action: "whatsapp",
        },
      ],
    };
  }

  try {
    const reply = await callGeminiApi(apiKey, history ?? [], message);
    return {
      reply,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA skills",
        "Is Gopal currently open to internship opportunities?",
        "Download his resume",
      ],
      actions: [
        { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" as const },
        {
          label: "💬 Message on WhatsApp",
          url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
          action: "whatsapp" as const,
        },
      ],
    };
  } catch (err) {
    console.error("Gemini API call failed:", err);
    return {
      reply: `Hello! I'm here to help you learn about Gopal's full-stack projects, Java & DSA problem solving, and academic background. Feel free to explore his projects or connect directly!`,
      suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills", "Download his resume"],
      actions: [
        { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" as const },
        { label: "💬 Message on WhatsApp", url: `https://wa.me/${PERSONAL_INFO.whatsapp}`, action: "whatsapp" as const },
      ],
    };
  }
}

/**
 * Frontend client helper: Real-time SSE streaming reader
 */
export async function askGopalAiStream({
  message,
  history,
  onChunk,
  onComplete,
  onError,
}: {
  message: string;
  history?: ChatMessage[] | undefined;
  onChunk: (chunk: string) => void;
  onComplete: (data: { suggestions: string[]; actions?: ChatAction[] | undefined }) => void;
  onError: (err: Error) => void;
}): Promise<void> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, stream: true }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.slice(5).trim();
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr) as {
                  chunk?: string;
                  done?: boolean;
                  suggestions?: string[];
                  actions?: ChatAction[];
                };

                if (data.chunk) {
                  onChunk(data.chunk);
                }

                if (data.done) {
                  onComplete({
                    suggestions: data.suggestions ?? [],
                    actions: data.actions,
                  });
                  return;
                }
              } catch {
                // Partial line
              }
            }
          }
        }
      }

      onComplete({
        suggestions: [
          "What projects has Gopal built?",
          "Tell me about his DSA skills",
          "Download Gopal's Resume",
        ],
        actions: [
          { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
          {
            label: "💬 Message on WhatsApp",
            url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
            action: "whatsapp",
          },
        ],
      });
      return;
    }
  } catch (err) {
    console.warn("Server streaming failed, falling back to direct call:", err);
  }

  // Client-side fallback if /api/chat is not reachable
  const clientKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env["VITE_GEMINI_API_KEY"] as string) ||
        (import.meta.env["GEMINI_API_KEY"] as string) ||
        ""
      : "";

  if (clientKey) {
    try {
      const reply = await callGeminiApi(clientKey, history ?? [], message);
      onChunk(reply);
      onComplete({
        suggestions: [
          "What projects has Gopal built?",
          "Tell me about his DSA skills",
          "Download his resume",
        ],
        actions: [
          { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" as const },
          {
            label: "💬 Message on WhatsApp",
            url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
            action: "whatsapp" as const,
          },
        ],
      });
      return;
    } catch (clientErr) {
      console.error("Client fallback API call failed:", clientErr);
    }
  }

  onError(new Error("Unable to connect to the assistant server."));
}

/**
 * Frontend client helper (Non-streaming legacy wrapper)
 */
export async function askGopalAi({
  data,
}: {
  data: { message: string; history?: ChatMessage[] | undefined };
}): Promise<{
  reply: string;
  suggestions: string[];
  actions?: ChatAction[] | undefined;
}> {
  return new Promise((resolve) => {
    let accumulated = "";
    askGopalAiStream({
      message: data.message,
      history: data.history,
      onChunk: (chunk) => {
        accumulated += chunk;
      },
      onComplete: ({ suggestions, actions }) => {
        resolve({
          reply: accumulated,
          suggestions,
          actions,
        });
      },
      onError: (err) => {
        resolve({
          reply: `Sorry, there was an issue communicating with the assistant. Error: ${err.message}`,
          suggestions: ["What projects has Gopal built?", "Download Resume"],
        });
      },
    });
  });
}
