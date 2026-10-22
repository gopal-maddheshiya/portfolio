import {
  CERTIFICATIONS,
  DSA_INFO,
  EDUCATION,
  FOCUS_AREAS,
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
  const skillsList = SKILL_GROUPS.map((g) => `${g.title}: ${g.skills.join(", ")}`).join("\n- ");

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

  return `You are Ask Gopal, the official, intelligent, and dynamic AI assistant for Gopal Maddheshiya's developer portfolio.

CORE OPERATING DIRECTIVES — DYNAMIC & ACCURATE RESPONSES:
1. ANSWER THE EXACT QUESTION: Whatever the user asks, answer that specific question directly and dynamically! Never give a generic or repetitive intro.
2. TECHNICAL & CODING QUESTIONS:
   - If the user asks about any computer science, programming, or tech concept (e.g., "what is a binary search tree", "how does useEffect work", "explain OOP principles", "what is JWT authentication", "how does MongoDB indexing work"):
     Explain the concept clearly, authoritatively, and concisely with practical examples, and naturally tie it to Gopal's hands-on experience and stack where appropriate.
3. GOPAL'S PORTFOLIO & BACKGROUND:
   - If the user asks about Gopal's projects, LeetCode DSA progress, education, CGPA, certifications, or internship availability:
     Provide accurate, specific details using the verified facts below.
4. CASUAL / CONVERSATIONAL QUESTIONS:
   - If the user greets you ("hi", "hello", "how are you", "kaise ho", "kya haal hai"):
     Reply warmly, naturally, and conversationally in 1-2 friendly sentences and ask how you can help them explore Gopal's work.
5. LANGUAGE MATCHING:
   - ALWAYS match the user's language! If the user speaks Hindi or Hinglish, reply in fluent, natural Hindi/Hinglish. If in English, reply in clean, professional English.
6. NO REPETITIVE CANNED INTROS:
   - Jump straight into the answer. Do NOT start every message with "Hello, I am Ask Gopal, representative of Gopal Maddheshiya...".

KEY FACTS ABOUT GOPAL MADDHESHIYA:
- Full Name: ${PERSONAL_INFO.name}
- Role: ${PERSONAL_INFO.role} (${PERSONAL_INFO.subtitle})
- College / Degree: B.Tech in Computer Science & Engineering (2024–2028) at Shri Ramswaroop Memorial University (SRMU), Current CGPA: 7.63
- Schooling: Modern Academy (Class X in 2021, Class XII in 2024)
- Location: ${PERSONAL_INFO.location}
- Email: ${PERSONAL_INFO.email}
- WhatsApp / Phone: +${PERSONAL_INFO.whatsapp}
- GitHub: ${PERSONAL_INFO.github}
- LeetCode: ${PERSONAL_INFO.leetcode} (${DSA_INFO.totalSolvedCount}+ Problems Solved in Java)
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
- ${DSA_INFO.totalSolvedCount}+ LeetCode problems solved primarily in Java (Arrays, Strings, HashMaps, Trees, Graphs, Dynamic Programming).
- GitHub DSA Repo: ${DSA_INFO.repoName} (${DSA_INFO.repoUrl})

CERTIFICATIONS:
${certsList}

RESPONSE FORMATTING:
- Keep answers structured, easy to read, with bold highlights for key terms.
- For code concepts, provide brief, elegant syntax snippets when helpful.
- Keep responses focused (2-4 crisp paragraphs or bullet points) without fluff.`;
}

// Ultra-fast and stable models verified on Google Gemini API in priority order
const STABLE_FAST_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.7-flash",
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
function generateInstantKnowledgeResponse(
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

  // 0. How are you / Kaise ho / Wellness check
  if (
    query.includes("how are you") ||
    query.includes("how r u") ||
    query.includes("how are u") ||
    query.includes("kaise ho") ||
    query.includes("kya haal") ||
    query.includes("sab kaisa") ||
    query.includes("how do you do")
  ) {
    return {
      reply: isHindi
        ? `Main bilkul badhiya aur energetic hoon, poochhne ke liye shukriya!  Aap bataiye, aaj aapki kaise madad kar sakta hoon?\n\nAap Gopal ke projects, Java DSA practice, technical skills ya contact details ke baare me poochh sakte hain!`
        : `I'm doing great, thank you for asking!  How can I help you today?\n\nFeel free to ask me anything about Gopal's full-stack projects, Java & DSA problem solving, academic background, or how to reach out to him.`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA skills",
        "Download Gopal's Resume",
      ],
      actions: [
        { label: "🚀 View Projects", action: "projects" },
        { label: "📄 Download Resume", url: resume, action: "resume" },
      ],
    };
  }

  // 0.1 Who are you / Kaun ho
  if (
    query.includes("who are you") ||
    query.includes("who r u") ||
    query.includes("kaun ho") ||
    query.includes("kon ho") ||
    query.includes("kya ho") ||
    query.includes("what is your name") ||
    query.includes("naam kya")
  ) {
    return {
      reply: isHindi
        ? `Main **Ask Gopal** hoon — Gopal Maddheshiya ka AI portfolio representative!  Main Gopal ke projects, DSA problem solving, skills aur resume se judi kisi bhi jankari ka turant aur sahi jawab dene ke liye taiyar hoon.\n\nAap kya jaanna chahte hain?`
        : `I am **Ask Gopal**, the official AI representative for Gopal Maddheshiya's developer portfolio!  I am here to answer any questions about Gopal's software projects, Java & DSA practice, full-stack skillset, and contact info.\n\nWhat would you like to explore?`,
      suggestions: [
        "What are Gopal's primary skills?",
        "What projects has he built?",
        "Download Resume",
      ],
      actions: [
        { label: "🚀 View Projects", action: "projects" },
        { label: "📄 Download Resume", url: resume, action: "resume" },
      ],
    };
  }

  // 0.2 Simple Greetings (Hi / Hello / Hey / Namaste)
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ") ||
    query.startsWith("hey ") ||
    query.includes("namaste") ||
    query.includes("pranam")
  ) {
    return {
      reply: isHindi
        ? `Namaste! Gopal Maddheshiya ke developer portfolio par aapka swagat hai!  Main aapko Gopal ke projects, Java & DSA expertise, college credentials aur experience ke baare me bata sakta hoon.\n\nAap kis baare me jaanna chahenge?`
        : `Hello and welcome!  I'm Ask Gopal, here to help you explore Gopal Maddheshiya's work, featured projects, Java & DSA achievements, and credentials.\n\nWhat would you like to explore first?`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA skills",
        "How can I contact Gopal?",
      ],
      actions: [
        { label: "🚀 Explore Projects", action: "projects" },
        { label: "📄 Download Resume", url: resume, action: "resume" },
      ],
    };
  }

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
        ? `Gopal **Java & DSA** me consistency build kar rahe hain:\n\n- **${DSA_INFO.totalSolvedCount}+ LeetCode Problems Solved** (Arrays, Strings, HashMaps, Recursion).\n- **LeetCode Profile:** [@${PERSONAL_INFO.leetcodeUsername}](${PERSONAL_INFO.leetcode})\n- **GitHub Repo:** [${DSA_INFO.repoName}](${DSA_INFO.repoUrl})\n\nWo regular practice aur time/space complexity optimization par deliberate focus rakhte hain.`
        : `Gopal is building consistency in **Data Structures & Algorithms (Java)**:\n\n- **${DSA_INFO.totalSolvedCount}+ LeetCode Problems Solved** across Arrays, Strings, HashMaps, and Recursion.\n- **LeetCode Profile:** [@${PERSONAL_INFO.leetcodeUsername}](${PERSONAL_INFO.leetcode})\n- **GitHub Repository:** [${DSA_INFO.repoName}](${DSA_INFO.repoUrl})\n\nHe practices structured problem solving regularly with clean object-oriented code.`,
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
        ? `Gopal ki academic details:\n\n- **College:** B.Tech in Computer Science & Engineering (2024–2028) at **Shri Ramswaroop Memorial University (SRMU)**.\n- **Current CGPA:** **7.63**\n- **Schooling:** **Modern Academy** (Class X in 2021, Class XII in 2024).\n\nWo computer science fundamentals (OOPs, DBMS, OS) ke sath full-stack development me deep practice kar rahe hain.`
        : `Here is Gopal's academic background:\n\n- **University:** B.Tech in Computer Science & Engineering (2024–2028) at **Shri Ramswaroop Memorial University (SRMU)**.\n- **Current CGPA:** **7.63**\n- **Schooling:** **Modern Academy** (Class X - 2021, Class XII - 2024).\n\nHe balances rigorous academic fundamentals with practical software engineering projects.`,
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
      ? `Gopal **SRMU me B.Tech CSE (2024–2028, CGPA 7.63)** ke student hain jo **Java & DSA (${DSA_INFO.totalSolvedCount}+ LeetCode)** aur **Full-Stack Development (React, Node.js, Express, MongoDB)** par focus karte hain.\n\nAap Gopal ke projects, skills, education ya resume ke baare me poochh sakte hain!`
      : `Gopal is a **B.Tech Computer Science student at SRMU** (CGPA 7.63, 2024–2028) specializing in **Java & DSA (${DSA_INFO.totalSolvedCount}+ LeetCode problems solved)** and **Full-Stack Web Development** (React, Node.js, Express, MongoDB, Supabase).\n\nFeel free to ask about his projects, technical skills, problem solving, or internship availability!`,
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
    (typeof import.meta !== "undefined" && import.meta.env
      ? (import.meta.env.VITE_GEMINI_API_KEY as string) ||
        (import.meta.env["GEMINI_API_KEY"] as string) ||
        ""
      : "") ||
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
          const piece =
            words.slice(idx, idx + chunkSize).join(" ") +
            (idx + chunkSize < words.length ? " " : "");
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

  // Fallback to instant knowledge stream if upstream failed
  if (!upstreamResponse || !upstreamResponse.body) {
    const fallbackResult = generateInstantKnowledgeResponse(message);
    const stream = new ReadableStream({
      start(controller) {
        const words = fallbackResult.reply.split(" ");
        let idx = 0;
        const chunkSize = 4;
        while (idx < words.length) {
          const piece =
            words.slice(idx, idx + chunkSize).join(" ") +
            (idx + chunkSize < words.length ? " " : "");
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
    console.warn("API /api/chat unreachable, activating instant client response:", err);
    onError(err instanceof Error ? err : new Error(String(err)));
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
