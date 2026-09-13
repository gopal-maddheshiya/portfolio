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

// Ultra-fast and stable models verified on Google Gemini API in priority order
const STABLE_FAST_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemma-4-26b-a4b-it",
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
 * Intelligent instant knowledge engine (0ms latency fallback).
 * Answers questions about projects, DSA, academics, OOPs, skills, contact in Hindi & English.
 */
export function generateInstantKnowledgeResponse(
  rawQuery: string,
  resumeUrl?: string,
  whatsappNumber?: string,
): { reply: string; suggestions: string[]; actions?: ChatAction[] } {
  const query = rawQuery.toLowerCase().trim();
  const resume = resumeUrl || PERSONAL_INFO.resume;
  const whatsapp = whatsappNumber || PERSONAL_INFO.whatsapp;

  const isHindi =
    query.includes("kya") ||
    query.includes("kaise") ||
    query.includes("batao") ||
    query.includes("kaha") ||
    query.includes("hai") ||
    query.includes("kon") ||
    query.includes("kaun") ||
    query.includes("karta") ||
    query.includes("namaste") ||
    query.includes("kuch");

  // 1. Projects
  if (
    query.includes("project") ||
    query.includes("app") ||
    query.includes("built") ||
    query.includes("dsa tracker") ||
    query.includes("trading") ||
    query.includes("work") ||
    query.includes("portfolio")
  ) {
    const projectItems = PROJECTS.map(
      (p) =>
        `- **${p.title}** (${p.year}): ${p.summary}\n  *Tech Stack:* \`${p.technologies.slice(0, 4).join(", ")}\`${p.liveUrl ? ` • [Live Demo](${p.liveUrl})` : ""} • [GitHub](${p.githubUrl})`,
    ).join("\n\n");

    return {
      reply: isHindi
        ? `Gopal ne kai full-stack aur real-world applications develop kiye hain:\n\n${projectItems}\n\nAap kisi specific project ke features ya tech stack ke baare me bhi poochh sakte hain!`
        : `Here are Gopal's featured full-stack projects:\n\n${projectItems}\n\nFeel free to explore live demos or inspect the GitHub repositories!`,
      suggestions: [
        "Tell me about DSA Tracker project",
        "What are Gopal's primary skills?",
        "Download Gopal's Resume",
      ],
      actions: [
        { label: "🚀 View Projects Section", action: "projects" },
        { label: "📄 Download Resume", url: resume, action: "resume" },
      ],
    };
  }

  // 2. DSA & LeetCode
  if (
    query.includes("dsa") ||
    query.includes("leetcode") ||
    query.includes("algorithm") ||
    query.includes("data structure") ||
    query.includes("problem") ||
    query.includes("java") ||
    query.includes("coding")
  ) {
    return {
      reply: isHindi
        ? `Gopal **Java & DSA** me kafi active hain:\n\n- **174+ LeetCode Problems Solved** (Arrays, Strings, HashMaps, Trees, Graphs, DP).\n- **LeetCode Profile:** [@${PERSONAL_INFO.leetcodeUsername}](${PERSONAL_INFO.leetcode})\n- **GitHub Repo:** [${DSA_INFO.repoName}](${DSA_INFO.repoUrl})\n\nWo regular practice aur time/space complexity optimization par deliberate focus rakhte hain.`
        : `Gopal has a strong foundation in **Data Structures & Algorithms (Java)**:\n\n- **174+ LeetCode Problems Solved** across Arrays, Strings, HashMaps, Binary Trees, Graphs, and DP.\n- **LeetCode Profile:** [@${PERSONAL_INFO.leetcodeUsername}](${PERSONAL_INFO.leetcode})\n- **GitHub Repository:** [${DSA_INFO.repoName}](${DSA_INFO.repoUrl})\n\nHe practices structured problem solving daily with clean object-oriented code.`,
      suggestions: [
        "What projects has Gopal built?",
        "What is his college & CGPA?",
        "Download Resume",
      ],
      actions: [
        { label: "⚡ View DSA Section", action: "dsa" },
        { label: "🏆 Open LeetCode", url: PERSONAL_INFO.leetcode },
      ],
    };
  }

  // 3. Education / College / School / CGPA
  if (
    query.includes("college") ||
    query.includes("university") ||
    query.includes("srmu") ||
    query.includes("education") ||
    query.includes("cgpa") ||
    query.includes("marks") ||
    query.includes("school") ||
    query.includes("modern academy") ||
    query.includes("degree") ||
    query.includes("padhai")
  ) {
    return {
      reply: isHindi
        ? `Gopal ki academic details:\n\n- **College:** B.Tech in Computer Science & Engineering (2024–2028) at **Shri Ramswaroop Memorial University (SRMU)**.\n- **Current CGPA:** **7.62**\n- **Schooling:** **Modern Academy** (Class X in 2021, Class XII in 2024).\n\nWo computer science fundamentals (OOPs, DBMS, OS) ke sath full-stack development me deep practice kar rahe hain.`
        : `Here is Gopal's academic background:\n\n- **University:** B.Tech in Computer Science & Engineering (2024–2028) at **Shri Ramswaroop Memorial University (SRMU)**.\n- **Current CGPA:** **7.62**\n- **Schooling:** **Modern Academy** (Class X - 2021, Class XII - 2024).\n\nHe balances rigorous academic fundamentals with practical software engineering projects.`,
      suggestions: [
        "What are Gopal's primary skills?",
        "What projects has he built?",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

  // 4. Skills & Tech Stack
  if (
    query.includes("skill") ||
    query.includes("tech") ||
    query.includes("stack") ||
    query.includes("language") ||
    query.includes("framework") ||
    query.includes("know")
  ) {
    const skillList = SKILL_GROUPS.map((g) => `- **${g.title}:** ${g.skills.join(", ")}`).join(
      "\n",
    );

    return {
      reply: isHindi
        ? `Gopal ke primary technical skills:\n\n${skillList}\n\nActive focus: ${FOCUS_AREAS.slice(0, 3).join(", ")}.`
        : `Gopal's technical skill set spans:\n\n${skillList}\n\nCurrently focused on: ${FOCUS_AREAS.slice(0, 3).join(", ")}.`,
      suggestions: [
        "What full-stack projects has he built?",
        "Tell me about his DSA skills",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

  // 5. Contact / Hire / Internship
  if (
    query.includes("contact") ||
    query.includes("hire") ||
    query.includes("internship") ||
    query.includes("email") ||
    query.includes("phone") ||
    query.includes("whatsapp") ||
    query.includes("call") ||
    query.includes("connect") ||
    query.includes("resume")
  ) {
    return {
      reply: isHindi
        ? `Gopal **Software Engineering / Full-Stack Internships** ke liye actively open hain!\n\n**Connect Directly:**\n- **Email:** [${PERSONAL_INFO.email}](mailto:${PERSONAL_INFO.email})\n- **WhatsApp / Phone:** [${PERSONAL_INFO.phone}](https://wa.me/${whatsapp})\n- **LinkedIn:** [gopal-maddheshiya](${PERSONAL_INFO.linkedin})\n- **GitHub:** [gopal-maddheshiya](${PERSONAL_INFO.github})\n- **Location:** ${PERSONAL_INFO.location}`
        : `Gopal is currently open for **Software Engineering & Full-Stack Web Development internships and roles**!\n\n**Direct Contact Information:**\n- **Email:** [${PERSONAL_INFO.email}](mailto:${PERSONAL_INFO.email})\n- **WhatsApp / Phone:** [${PERSONAL_INFO.phone}](https://wa.me/${whatsapp})\n- **LinkedIn:** [gopal-maddheshiya](${PERSONAL_INFO.linkedin})\n- **GitHub:** [gopal-maddheshiya](${PERSONAL_INFO.github})\n- **Location:** ${PERSONAL_INFO.location}`,
      suggestions: [
        "Download Gopal's Resume",
        "What projects has he built?",
        "Tell me about his DSA journey",
      ],
      actions: [
        { label: "📄 Download Resume", url: resume, action: "resume" },
        { label: "💬 Message on WhatsApp", url: `https://wa.me/${whatsapp}`, action: "whatsapp" },
      ],
    };
  }

  // 6. OOPs / Technical Concepts
  if (
    query.includes("oops") ||
    query.includes("oop") ||
    query.includes("inheritance") ||
    query.includes("polymorphism") ||
    query.includes("encapsulation") ||
    query.includes("abstraction") ||
    query.includes("react") ||
    query.includes("node")
  ) {
    return {
      reply: isHindi
        ? `**OOPs ke 4 Core Pillars:**\n\n1. **Encapsulation:** Data aur methods ko ek single unit (class) me wrap karna with private fields & getters/setters.\n2. **Inheritance:** Code reusability ke liye parent class se properties child class me inherit karna (\`extends\`).\n3. **Polymorphism:** Same method name with different behaviors (Method Overloading & Overriding).\n4. **Abstraction:** Internal complex implementation hide karke sirf essential functionality expose karna (via Abstract Classes & Interfaces).\n\nGopal in concepts ko Java aur real-world web architectures me deeply apply karte hain.`
        : `**Core Pillars of Object-Oriented Programming (OOP):**\n\n1. **Encapsulation:** Bundling data and methods into a single class with restricted access using access modifiers.\n2. **Inheritance:** Reusing and extending functionality from base classes to derived classes.\n3. **Polymorphism:** Allowing objects to take multiple forms through method overloading and overriding.\n4. **Abstraction:** Hiding low-level implementation details and exposing only essential interfaces.\n\nGopal applies these principles across Java backend systems and modular full-stack projects.`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA background",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

  // Default friendly response
  return {
    reply: isHindi
      ? `Gopal **SRMU me B.Tech CSE (2024–2028, CGPA 7.62)** ke student hain jo **Java & DSA (174+ LeetCode)** aur **Full-Stack Development (React, Node.js, Express, MongoDB)** par focus karte hain.\n\nAap Gopal ke projects, skills, education ya resume ke baare me poochh sakte hain!`
      : `Gopal is a **B.Tech Computer Science student at SRMU** (CGPA 7.62, 2024–2028) specializing in **Java & DSA (174+ LeetCode problems solved)** and **Full-Stack Web Development** (React, Node.js, Express, MongoDB, Supabase).\n\nFeel free to ask about his projects, technical skills, problem solving, or internship availability!`,
    suggestions: [
      "What projects has Gopal built?",
      "Tell me about his DSA skills",
      "Download Gopal's Resume",
    ],
    actions: [
      { label: "🚀 View Projects", action: "projects" },
      { label: "📄 Download Resume", url: resume, action: "resume" },
      { label: "💬 Message on WhatsApp", url: `https://wa.me/${whatsapp}`, action: "whatsapp" },
    ],
  };
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

  // If no API key configured, stream instant knowledge engine without any delay
  if (!apiKey) {
    const instantResult = generateInstantKnowledgeResponse(message);
    const stream = new ReadableStream({
      start(controller) {
        // Stream text in words/chunks for smooth typewriter
        const words = instantResult.reply.split(" ");
        let idx = 0;
        const chunkSize = 4;
        while (idx < words.length) {
          const piece = words.slice(idx, idx + chunkSize).join(" ") + (idx + chunkSize < words.length ? " " : "");
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

  const systemInstruction = generateSystemContext();
  const contents = formatConversationContents(history, message);

  let upstreamResponse: Response | null = null;

  for (const model of STABLE_FAST_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

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
              temperature: 0.6,
              maxOutputTokens: 600,
            },
          }),
        },
      );

      clearTimeout(timeoutId);

      if (res.ok && res.body) {
        upstreamResponse = res;
        break;
      }
    } catch {
      // Try next candidate model
    }
  }

  // Fallback to instant knowledge stream if upstream failed
  if (!upstreamResponse || !upstreamResponse.body) {
    const fallbackResult = generateInstantKnowledgeResponse(message);
    const stream = new ReadableStream({
      start(controller) {
        const words = fallbackResult.reply.split(" ");
        let idx = 0;
        const chunkSize = 4;
        while (idx < words.length) {
          const piece = words.slice(idx, idx + chunkSize).join(" ") + (idx + chunkSize < words.length ? " " : "");
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: piece })}\n\n`));
          idx += chunkSize;
        }

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
  return generateInstantKnowledgeResponse(message);
}

/**
 * Frontend client helper: Real-time SSE streaming reader with guaranteed 0-lag fallback
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
      let hasReceivedAnyChunk = false;

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
                  hasReceivedAnyChunk = true;
                  onChunk(data.chunk);
                }

                if (data.done) {
                  const sanitizedActions = data.actions?.map((act) => {
                    if (act.action === "resume") return { ...act, url: activeResume };
                    if (act.action === "whatsapp") return { ...act, url: `https://wa.me/${activeWhatsapp}` };
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

      if (hasReceivedAnyChunk) {
        onComplete({
          suggestions: ["What projects has Gopal built?", "Tell me about his DSA skills"],
          actions: [
            { label: "📄 Download Resume", url: activeResume, action: "resume" },
            { label: "💬 Message on WhatsApp", url: `https://wa.me/${activeWhatsapp}`, action: "whatsapp" },
          ],
        });
        return;
      }
    }
  } catch (err) {
    console.warn("API /api/chat unreachable, activating instant client response:", err);
  }

  // Guaranteed instant client response with typewriter streaming chunks
  const instant = generateInstantKnowledgeResponse(message, activeResume, activeWhatsapp);
  const words = instant.reply.split(" ");
  let i = 0;
  const timer = setInterval(() => {
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
    }
  }, 35);
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
  return generateInstantKnowledgeResponse(data.message);
}
