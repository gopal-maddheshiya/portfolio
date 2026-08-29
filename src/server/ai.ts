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
3. If asked about hiring or internships, emphasize that Gopal is currently open to internship opportunities and developer roles, and invite them to connect via Email (${PERSONAL_INFO.email}), WhatsApp (+${PERSONAL_INFO.phone}), or view his resume.
4. Use clean markdown formatting (bold headers, bullet points).`;
}

let cachedModels: string[] | null = null;

async function getSupportedModels(apiKey: string): Promise<string[]> {
  if (cachedModels && cachedModels.length > 0) {
    return cachedModels;
  }

  const fallbackList = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-2.0-flash-lite-preview-02-05",
    "gemini-pro",
  ];

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );
    if (res.ok) {
      const data = (await res.json()) as {
        models?: { name?: string; supportedGenerationMethods?: string[] }[];
      };
      const valid = (data.models || [])
        .filter(
          (m) =>
            m.name &&
            Array.isArray(m.supportedGenerationMethods) &&
            m.supportedGenerationMethods.includes("generateContent"),
        )
        .map((m) => (m.name ? m.name.replace(/^models\//, "") : ""))
        .filter(Boolean);

      if (valid.length > 0) {
        // Prioritize fastest flash models first
        valid.sort((a, b) => {
          const aFlash = a.includes("flash") ? -1 : 1;
          const bFlash = b.includes("flash") ? -1 : 1;
          return aFlash - bFlash;
        });
        cachedModels = valid;
        return valid;
      }
    }
  } catch (err) {
    console.warn("Could not query model list from Google AI Studio:", err);
  }

  return fallbackList;
}

/**
 * Calls the Google Gemini API with dynamic model discovery.
 */
export async function callGeminiApi(
  apiKey: string,
  history: ChatMessage[],
  userPrompt: string,
): Promise<string> {
  const systemInstruction = generateSystemContext();

  // Gemini API requires multi-turn contents to start with 'user' and alternate strictly
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const m of history) {
    if (!m.content || typeof m.content !== "string") continue;
    // Skip initial greeting assistant messages
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

  // Ensure last turn in history is not 'user' so we can append current userPrompt
  const lastTurn = contents[contents.length - 1];
  if (lastTurn && lastTurn.role === "user") {
    contents.pop();
  }

  contents.push({
    role: "user",
    parts: [{ text: userPrompt }],
  });

  const modelsToTry = await getSupportedModels(apiKey);
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
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
          // Promote working model to front of cache
          if (cachedModels) {
            cachedModels = [model, ...cachedModels.filter((m) => m !== model)];
          }
          return text;
        }
      }

      const errorText = await response.text();
      console.warn(`Model ${model} returned ${response.status}:`, errorText);
      lastError = new Error(`Model ${model} failed (${response.status}): ${errorText}`);
    } catch (err) {
      console.warn(`Error connecting to model ${model}:`, err);
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error("All available Gemini models failed to generate a response.");
}

/**
 * Server-side processor for /api/chat requests.
 * Uses Gemini AI for dynamic answering.
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
      reply: `Sorry, there was an issue communicating with Gemini AI. Error: ${err instanceof Error ? err.message : String(err)}`,
      suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills"],
      actions: [{ label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" }],
    };
  }
}

/**
 * Frontend client helper: Calls /api/chat server endpoint
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
  const { message, history } = data;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });

    if (res.ok) {
      const result = (await res.json()) as {
        reply: string;
        suggestions: string[];
        actions?: ChatAction[];
      };
      if (result && typeof result.reply === "string") {
        return result;
      }
    } else {
      const errBody = await res.text();
      console.error("Server /api/chat error response:", res.status, errBody);
    }
  } catch (err) {
    console.error("Server /api/chat request failed:", err);
  }

  return {
    reply: `Unable to connect to the assistant server. Please check your internet connection or try again.`,
    suggestions: ["What projects has Gopal built?", "Download Resume"],
  };
}
