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
    (g) => `${g.title}: ${g.skills.join(", ")}`,
  ).join("\n- ");

  const projectsList = PROJECTS.map(
    (p, i) =>
      `Project ${i + 1}: ${p.title} (${p.year})\n  Summary: ${p.summary}\n  Technologies: ${p.technologies.join(", ")}\n  Key Highlights: ${p.features.slice(0, 3).join("; ")}\n  GitHub: ${p.githubUrl}${p.liveUrl ? `\n  Live Demo: ${p.liveUrl}` : ""}`,
  ).join("\n\n");

  const educationList = EDUCATION.map(
    (e) => `- ${e.title}: ${e.org} (${e.period})${e.detail ? ` [${e.detail}]` : ""}`,
  ).join("\n");

  const certsList = CERTIFICATIONS.map(
    (c) => `- ${c.title} by ${c.org} (${c.period}) - ${c.skills.join(", ")}`,
  ).join("\n");

  return `You are Ask Gopal, the official and intelligent AI representative for Gopal Maddheshiya's developer portfolio.
You provide instant, accurate, well-structured, and helpful answers about Gopal's projects, technical skills, education, and experience.

LANGUAGE & TONE RULES:
- ALWAYS match the user's language! If the user asks in Hindi or Hinglish, respond in natural, friendly Hindi/Hinglish! If in English, reply in crisp, professional English.
- NEVER start every message with repetitive self-introductions ("Hello, I am Ask Gopal..."). Jump straight into answering the user's question directly!
- Be enthusiastic, confident, polite, and articulate.

KEY FACTS ABOUT GOPAL MADDHESHIYA:
- Full Name: ${PERSONAL_INFO.name}
- Role: ${PERSONAL_INFO.role} (${PERSONAL_INFO.subtitle})
- College / Degree: B.Tech in Computer Science & Engineering (2024–2028) at Shri Ramswaroop Memorial University (SRMU), Current CGPA: 7.62
- Schooling: Modern Academy (Class X in 2021, Class XII in 2024)
- Location: ${PERSONAL_INFO.location}
- Email: ${PERSONAL_INFO.email}
- WhatsApp / Phone: +${PERSONAL_INFO.whatsapp}
- GitHub: ${PERSONAL_INFO.github}
- LeetCode: ${PERSONAL_INFO.leetcode} (174+ Problems Solved in Java)
- LinkedIn: ${PERSONAL_INFO.linkedin}
- Resume: ${PERSONAL_INFO.resume}
- Availability: Open for Software Engineering & Full-Stack Web Development internships and opportunities.

ACADEMIC BACKGROUND:
${educationList}

CORE SKILLS:
- ${skillsList}

FEATURED PROJECTS:
${projectsList}

DATA STRUCTURES & ALGORITHMS (DSA):
- 174+ LeetCode problems solved primarily in Java (Arrays, Strings, HashMaps, Trees, Graphs, Dynamic Programming).
- GitHub DSA Repo: ${DSA_INFO.repoName} (${DSA_INFO.repoUrl})

CERTIFICATIONS:
${certsList}

RESPONSE FORMATTING GUIDELINES:
1. Keep answers structured, easy to skim, and visually engaging. Use short paragraphs, bold keywords, and clean bullet points.
2. For coding/technical questions (e.g., Java OOPs, React hooks, DSA logic, REST APIs), explain concepts clearly with brief code snippets or bulleted steps when helpful.
3. For recruitment/internship inquiries, highlight Gopal's strong problem-solving mindset, fast learning ability, and full-stack project experience, and invite them to connect via WhatsApp or Email.
4. Keep answers concise (2 to 4 short paragraphs or bulleted lists) so visitors get fast, crisp insights without information overload.`;
}

// Ultra-fast Gemini models in order of priority
const STABLE_FAST_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
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
              chunk: "AI service is currently initializing. In the meantime, you can explore Gopal's projects or download his resume below!",
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
      reply: `Hello! I'm here to help you learn about Gopal's full-stack projects, Java & DSA problem solving, and academic background. Feel free to explore his projects or connect directly!`,
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
  resumeUrl,
  whatsappNumber,
}: {
  message: string;
  history?: ChatMessage[] | undefined;
  onChunk: (chunk: string) => void;
  onComplete: (data: { suggestions: string[]; actions?: ChatAction[] | undefined }) => void;
  onError: (err: Error) => void;
  resumeUrl?: string | undefined;
  whatsappNumber?: string | undefined;
}): Promise<void> {
  const activeResume = resumeUrl || PERSONAL_INFO.resume;
  const activeWhatsapp = whatsappNumber || PERSONAL_INFO.whatsapp;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
                  // If actions are provided, ensure resume & whatsapp urls match the current dynamic values
                  const sanitizedActions = data.actions?.map((act) => {
                    if (act.action === "resume") {
                      return { ...act, url: activeResume };
                    }
                    if (act.action === "whatsapp") {
                      return { ...act, url: `https://wa.me/${activeWhatsapp}` };
                    }
                    return act;
                  });

                  onComplete({
                    suggestions: data.suggestions ?? [],
                    actions: sanitizedActions,
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
          { label: "📄 Download Resume", url: activeResume, action: "resume" as const },
          {
            label: "💬 Message on WhatsApp",
            url: `https://wa.me/${activeWhatsapp}`,
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
