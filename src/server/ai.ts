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
 * Builds a comprehensive system prompt string directly from the existing portfolio data.
 * Zero duplication — whenever profile.ts is updated, the AI automatically knows.
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
    (e) => `- ${e.title} at ${e.org} (${e.period})${e.detail ? ` [${e.detail}]` : ""}`,
  ).join("\n");

  const certsList = CERTIFICATIONS.map(
    (c) => `- ${c.title} by ${c.org} (${c.period}) - ${c.detail} (Skills: ${c.skills.join(", ")})`,
  ).join("\n");

  const profilesList = CODING_PROFILES.filter((cp) => cp.url)
    .map((cp) => `- ${cp.name}: ${cp.url} (@${cp.username}) - ${cp.description}`)
    .join("\n");

  return `You are Ask Gopal, the official personal AI portfolio assistant for Gopal Maddheshiya.
You represent Gopal warmly, smartly, accurately, and naturally to recruiters, hiring managers, engineers, and visitors.

LANGUAGE RULES:
- IMPORTANT: ALWAYS reply in the SAME language the user speaks!
- If the user writes in Hindi or Hinglish (e.g. "Gopal ke bare me batao", "kaise ho", "kya skills hai"), respond in natural, friendly Hindi/Hinglish!
- If the user writes in English, reply in professional English.

=== ABOUT GOPAL MADDHESHIYA ===
- Name: ${PERSONAL_INFO.name}
- Role: ${PERSONAL_INFO.role} (${PERSONAL_INFO.subtitle})
- Location: ${PERSONAL_INFO.location}
- College / Degree: B.Tech in Computer Science & Engineering (2024–2028), Shri Ramswaroop Memorial University (SRMU), Current CGPA: 7.62
- Primary Focus: Java, Data Structures & Algorithms (DSA), Full-Stack Web Development (MERN: React, Node.js, Express, MongoDB)
- Opportunities: Open for Summer 2026 Software Engineer / Full-Stack Internships and collaborative roles!
- Resume: ${PERSONAL_INFO.resume} (Available for direct download)
- Email: ${PERSONAL_INFO.email}
- Phone / WhatsApp: +${PERSONAL_INFO.whatsapp}
- GitHub: ${PERSONAL_INFO.github}
- LeetCode: ${PERSONAL_INFO.leetcode}
- LinkedIn: ${PERSONAL_INFO.linkedin}

=== HIGHLIGHTS ===
${HIGHLIGHTS.map((h) => `- ${h.label}: ${h.detail}`).join("\n")}

=== CORE SKILLS ===
- ${skillsList}

=== CURRENT FOCUS AREAS ===
- ${FOCUS_AREAS.join("\n- ")}

=== FEATURED PROJECTS ===
${projectsList}

=== DATA STRUCTURES & ALGORITHMS (DSA) ===
- Problems Solved: ${DSA_INFO.problemsSolved} in ${DSA_INFO.language}
- Repository: ${DSA_INFO.repoName} (${DSA_INFO.repoUrl})
- Topics Practiced: ${DSA_INFO.topics.join(", ")}
- Methodology: ${DSA_INFO.notes.join("; ")}

=== CODING & TECHNICAL PROFILES ===
${profilesList}

=== LEARNING ROADMAP / JOURNEY ===
- ${journeyList}

=== EDUCATION ===
${educationList}

=== VERIFIED CERTIFICATIONS ===
${certsList}

=== GUIDELINES FOR RESPONDING ===
1. Be polite, engaging, conversational, and helpful. Use clean markdown (bold text, bullet points).
2. Only provide factual details based strictly on the portfolio information above. Do not invent false experience.
3. If asked about hiring or internships, emphasize that Gopal is open for Summer 2026 roles and invite them to reach out via Email (${PERSONAL_INFO.email}), WhatsApp (+${PERSONAL_INFO.phone}), or check out his resume.
4. Keep responses concise and easy to read.`;
}

/**
 * Intelligent local fallback responder when no external LLM API key is present
 * or if network fails. Provides instant, data-grounded answers.
 */
export function localRuleBasedEngine(prompt: string): {
  reply: string;
  suggestions: string[];
  actions?: ChatMessage["actions"];
} {
  const query = prompt.toLowerCase();
  const isHindi =
    query.includes("kaise") ||
    query.includes("batao") ||
    query.includes("kya") ||
    query.includes("kon") ||
    query.includes("kaha") ||
    query.includes("hai");

  // 1. Resume / CV
  if (query.includes("resume") || query.includes("cv") || query.includes("curriculum vitae")) {
    return {
      reply: isHindi
        ? `Aap Gopal ka resume directly download kar sakte hain. Isme SRMU (B.Tech CSE, CGPA 7.62), Java & DSA, aur Full-Stack projects ki complete details hain.`
        : `You can view or download Gopal's resume directly. It highlights his academic background in B.Tech CSE at SRMU (CGPA 7.62), Java & DSA problem-solving track record, and full-stack projects.`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA skills",
        "How to contact Gopal?",
      ],
      actions: [
        { label: "📄 Download Resume PDF", url: PERSONAL_INFO.resume, action: "resume" },
        {
          label: "💬 Message on WhatsApp",
          url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
          action: "whatsapp",
        },
      ],
    };
  }

  // 2. Projects
  if (
    query.includes("project") ||
    query.includes("work") ||
    query.includes("portfolio") ||
    query.includes("build")
  ) {
    const projSummary = PROJECTS.map(
      (p, i) =>
        `**${i + 1}. ${p.title} (${p.year})**\n- *Tech:* ${p.technologies.join(", ")}\n- *Description:* ${p.summary}\n- [GitHub Source](${p.githubUrl})${p.liveUrl ? ` • [Live Demo](${p.liveUrl})` : ""}`,
    ).join("\n\n");

    return {
      reply: isHindi
        ? `Yeh rahe Gopal ke main projects:\n\n${projSummary}`
        : `Here are Gopal's featured full-stack and web development projects:\n\n${projSummary}`,
      suggestions: [
        "Tell me about the Weather App",
        "Tell me about Node Chat API",
        "What are his primary skills?",
      ],
      actions: [
        { label: "🚀 View All Projects", action: "projects" },
        { label: "🐙 GitHub Profile", url: PERSONAL_INFO.github },
      ],
    };
  }

  // 3. DSA / LeetCode / Java
  if (
    query.includes("dsa") ||
    query.includes("leetcode") ||
    query.includes("algorithm") ||
    query.includes("problem solving") ||
    query.includes("java")
  ) {
    return {
      reply: isHindi
        ? `Gopal **Java** me active DSA problem solver hai aur unhone LeetCode par **${DSA_INFO.problemsSolved} questions** solve kiye hain.\n\n- **Topics:** ${DSA_INFO.topics.join(", ")}\n- **GitHub Repo:** [${DSA_INFO.repoName}](${DSA_INFO.repoUrl})\n- **Profiles:** [LeetCode](${PERSONAL_INFO.leetcode})`
        : `Gopal is an active algorithmic problem solver with **${DSA_INFO.problemsSolved} problems solved** on LeetCode using **Java**.\n\n- **Topics Covered:** ${DSA_INFO.topics.join(", ")}\n- **Approach:** Analyzes time & space complexity, organized by pattern in his public [${DSA_INFO.repoName}](${DSA_INFO.repoUrl}) repository.\n- **Coding Profiles:** [LeetCode](${PERSONAL_INFO.leetcode}), [GeeksforGeeks](https://www.geeksforgeeks.org/profile/gopalmaddheshiya).`,
      suggestions: [
        "What are Gopal's web skills?",
        "What college is he in?",
        "Is he available for hire?",
      ],
      actions: [
        { label: "💻 LeetCode Profile", url: PERSONAL_INFO.leetcode },
        { label: "📦 Java DSA Repository", url: DSA_INFO.repoUrl },
      ],
    };
  }

  // 4. Skills / Tech Stack
  if (
    query.includes("skill") ||
    query.includes("tech") ||
    query.includes("stack") ||
    query.includes("framework") ||
    query.includes("language")
  ) {
    const formattedSkills = SKILL_GROUPS.map((g) => `**${g.title}:** ${g.skills.join(", ")}`).join(
      "\n- ",
    );

    return {
      reply: isHindi
        ? `Gopal ke technical skills:\n\n- ${formattedSkills}\n\nAbhi active focus: ${FOCUS_AREAS.slice(0, 3).join(", ")}.`
        : `Gopal's technical expertise spans Java, DSA, and Full-Stack MERN development:\n\n- ${formattedSkills}\n\nHe is currently focused on ${FOCUS_AREAS.slice(0, 3).join(", ")}.`,
      suggestions: [
        "What projects has he built with MERN?",
        "Tell me about his education",
        "Download his resume",
      ],
      actions: [
        { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
        { label: "🛠️ View Skills Section", action: "dsa" },
      ],
    };
  }

  // 5. Contact / Hire / Internship / Summer 2026
  if (
    query.includes("contact") ||
    query.includes("hire") ||
    query.includes("internship") ||
    query.includes("email") ||
    query.includes("phone") ||
    query.includes("whatsapp") ||
    query.includes("available") ||
    query.includes("job") ||
    query.includes("role") ||
    query.includes("summer")
  ) {
    return {
      reply: isHindi
        ? `Gopal **Summer 2026 Software Engineer / Full-Stack Internships** ke liye available hain!\n\n**Contact Details:**\n- **Email:** [${PERSONAL_INFO.email}](mailto:${PERSONAL_INFO.email})\n- **WhatsApp:** [${PERSONAL_INFO.phone}](https://wa.me/${PERSONAL_INFO.whatsapp})\n- **LinkedIn:** [gopal-maddheshiya](${PERSONAL_INFO.linkedin})\n- **GitHub:** [gopal-maddheshiya](${PERSONAL_INFO.github})`
        : `Gopal is actively seeking **Summer 2026 Software Engineer / Full-Stack Internships** and entry-level engineering roles!\n\n**Direct Contact Details:**\n- **Email:** [${PERSONAL_INFO.email}](mailto:${PERSONAL_INFO.email})\n- **Phone / WhatsApp:** [${PERSONAL_INFO.phone}](https://wa.me/${PERSONAL_INFO.whatsapp})\n- **Location:** ${PERSONAL_INFO.location}\n- **LinkedIn:** [gopal-maddheshiya](${PERSONAL_INFO.linkedin})\n- **GitHub:** [gopal-maddheshiya](${PERSONAL_INFO.github})`,
      suggestions: [
        "Download Gopal's Resume",
        "What are his main projects?",
        "What is his tech stack?",
      ],
      actions: [
        {
          label: "💬 Chat on WhatsApp",
          url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
          action: "whatsapp",
        },
        { label: "✉️ Send an Email", url: `mailto:${PERSONAL_INFO.email}`, action: "email" },
        { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
      ],
    };
  }

  // Default overview
  return {
    reply: isHindi
      ? `Namaste! Main **Ask Gopal**, Gopal Maddheshiya ka AI assistant hoon.\n\nGopal **SRMU me B.Tech CSE (2024–2028, CGPA 7.62)** ke student hain jo **Java & DSA** aur **Full-Stack MERN** par focus karte hain. Wo **Summer 2026 roles** ke liye open hain.\n\nAapko Gopal ke baare me kya janna hai?`
      : `Hello! I'm **Ask Gopal**, the assistant for Gopal Maddheshiya.\n\nGopal is a **B.Tech Computer Science student at SRMU** (CGPA 7.62, 2024–2028) focused on **Java & DSA** (50+ LeetCode problems solved) and **Full-Stack MERN development** (React, Node.js, Express, MongoDB).\n\nHe is open to **Summer 2026 Software Engineering roles and internships**.\n\nHow can I help you today?`,
    suggestions: [
      "What projects has Gopal built?",
      "Tell me about his DSA background",
      "Is Gopal open for Summer 2026 roles?",
      "Download his resume",
    ],
    actions: [
      { label: "🚀 View Projects", action: "projects" },
      { label: "📄 Download Resume", url: PERSONAL_INFO.resume, action: "resume" },
      {
        label: "💬 Message on WhatsApp",
        url: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
        action: "whatsapp",
      },
    ],
  };
}

/**
 * Calls Google Gemini API using the provided API key.
 */
export async function callGeminiApi(
  apiKey: string,
  history: ChatMessage[],
  userPrompt: string,
): Promise<string> {
  const systemInstruction = generateSystemContext();

  const contents = [
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
          maxOutputTokens: 800,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", response.status, errorText);
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response text returned from Gemini API");
  }

  return text;
}

/**
 * Server-side processor for /api/chat requests
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

  if (apiKey) {
    try {
      const reply = await callGeminiApi(apiKey, history ?? [], message);
      return {
        reply,
        suggestions: [
          "What projects has Gopal built?",
          "Tell me about his DSA skills",
          "Is Gopal open for Summer 2026 roles?",
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
      console.warn("Gemini API call failed, using local engine:", err);
    }
  }

  return localRuleBasedEngine(message);
}

/**
 * Frontend client helper: Calls /api/chat server endpoint or falls back locally
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
    }
  } catch (err) {
    console.warn("Server /api/chat request failed, using local engine:", err);
  }

  // Fallback to local engine directly in browser if server request fails
  return localRuleBasedEngine(message);
}
