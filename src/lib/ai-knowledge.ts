import {
  ABOUT_DATA,
  CERTIFICATIONS,
  DSA_INFO,
  EDUCATION,
  FOCUS_AREAS,
  PERSONAL_INFO,
  PROJECTS,
  SKILL_GROUPS,
} from "@/data/profile";
import type { PortfolioData } from "@/lib/supabase";

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

interface ResolvedAiProfile {
  info: typeof PERSONAL_INFO;
  projects: typeof PROJECTS;
  education: typeof EDUCATION;
  skillGroups: typeof SKILL_GROUPS;
  focusAreas: typeof FOCUS_AREAS;
  certifications: typeof CERTIFICATIONS;
  dsa: typeof DSA_INFO;
  cgpa: string;
  solvedCount: number;
}

function resolveAiProfile(
  portfolioData?: Partial<PortfolioData> | null | undefined,
  leetCodeTotal?: number | undefined,
): ResolvedAiProfile {
  const info = portfolioData?.personalInfo ?? PERSONAL_INFO;
  const projects = portfolioData?.projects?.length ? portfolioData.projects : PROJECTS;
  const education = portfolioData?.education?.length ? portfolioData.education : EDUCATION;
  const skillGroups = portfolioData?.skillGroups?.length ? portfolioData.skillGroups : SKILL_GROUPS;
  const focusAreas = portfolioData?.focusAreas?.length ? portfolioData.focusAreas : FOCUS_AREAS;
  const certifications = portfolioData?.certifications?.length
    ? portfolioData.certifications
    : CERTIFICATIONS;
  const dsa = portfolioData?.dsaInfo ?? DSA_INFO;
  const cgpa =
    portfolioData?.aboutData?.snapshot?.cgpa || education[0]?.detail || ABOUT_DATA.snapshot.cgpa;
  const solvedCount =
    typeof leetCodeTotal === "number" && leetCodeTotal > 0
      ? leetCodeTotal
      : (dsa.totalSolvedCount ?? DSA_INFO.totalSolvedCount);

  return {
    info,
    projects,
    education,
    skillGroups,
    focusAreas,
    certifications,
    dsa,
    cgpa,
    solvedCount,
  };
}

/**
 * Builds dynamic LLM system instructions from live portfolio data and synchronized LeetCode counts.
 */
export function buildSystemContextFromData(
  portfolioData?: Partial<PortfolioData> | null,
  leetCodeTotal?: number,
): string {
  const { info, projects, education, skillGroups, certifications, dsa, cgpa, solvedCount } =
    resolveAiProfile(portfolioData, leetCodeTotal);

  const skillsList = skillGroups.map((g) => `${g.title}: ${g.skills.join(", ")}`).join("\n- ");
  const projectsList = projects
    .map(
      (p, i) =>
        `Project ${i + 1}: ${p.title} (${p.year})\n  Summary: ${p.summary}\n  Technologies: ${p.technologies.join(", ")}\n  Key Highlights: ${p.features.slice(0, 3).join("; ")}\n  GitHub: ${p.githubUrl}${p.liveUrl ? `\n  Live Demo: ${p.liveUrl}` : ""}`,
    )
    .join("\n\n");
  const educationList = education
    .map((e) => `- ${e.title}: ${e.org} (${e.period})${e.detail ? ` [${e.detail}]` : ""}`)
    .join("\n");
  const certsList = certifications
    .map((c) => `- ${c.title} by ${c.org} (${c.period}) - ${c.skills.join(", ")}`)
    .join("\n");

  return `You are Ask Gopal, the official, intelligent, and dynamic AI assistant for ${info.name}'s developer portfolio.

CORE OPERATING DIRECTIVES — DYNAMIC & ACCURATE RESPONSES:
1. ANSWER THE EXACT QUESTION: Whatever the user asks, answer that specific question directly and dynamically! Never give a generic or repetitive intro.
2. TECHNICAL & CODING QUESTIONS:
   - If the user asks about any computer science, programming, or tech concept (e.g., "what is a binary search tree", "how does useEffect work", "explain OOP principles", "what is JWT authentication", "how does MongoDB indexing work"):
     Explain the concept clearly, authoritatively, and concisely with practical examples, and naturally tie it to ${info.name}'s hands-on experience and stack where appropriate.
3. PORTFOLIO & BACKGROUND:
   - Use ONLY the verified live facts below when answering questions about projects, LeetCode DSA progress, education, CGPA, certifications, or internship availability.
4. CASUAL / CONVERSATIONAL QUESTIONS:
   - Reply warmly, naturally, and concisely in 1-2 friendly sentences matching the user's tone.
5. LANGUAGE MATCHING:
   - ALWAYS match the user's language (fluent Hindi/Hinglish or clean professional English).
6. NO REPETITIVE CANNED INTROS:
   - Jump straight into the answer. Do not start every response with a generic greeting bio.

KEY VERIFIED FACTS ABOUT ${info.name.toUpperCase()}:
- Full Name: ${info.name}
- Role: ${info.role} (${info.subtitle})
- Primary Academic Record: ${education[0]?.title || "B.Tech CSE"} at ${education[0]?.org || "SRMU"} (${education[0]?.period || "2024 – 2028"}), ${cgpa}
- Location: ${info.location}
- Email: ${info.email}
- WhatsApp / Phone: +${info.whatsapp}
- GitHub: ${info.github}
- LeetCode: ${info.leetcode} (${solvedCount}+ Problems Solved primarily in ${dsa.language})
- LinkedIn: ${info.linkedin}
- Resume: ${info.resume}
- Availability: Open for Software Engineering & Full-Stack Web Development internships and roles.

ACADEMIC BACKGROUND:
${educationList}

CORE SKILLS:
- ${skillsList}

FEATURED PROJECTS:
${projectsList}

DATA STRUCTURES & ALGORITHMS (DSA):
- ${solvedCount}+ LeetCode problems solved primarily in ${dsa.language} (Arrays, Strings, HashMaps, Trees, Graphs, Dynamic Programming).
- GitHub DSA Repo: ${dsa.repoName} (${dsa.repoUrl})

CERTIFICATIONS:
${certsList}

RESPONSE FORMATTING:
- Keep answers structured, readable, with bold highlights for key terms.
- Keep responses focused (2-4 crisp paragraphs or bullet points) without fluff.`;
}

/**
 * Instant client/server knowledge fallback engine synced with live PortfolioData & LeetCode stats.
 */
export function generateInstantKnowledgeResponse(
  rawQuery: string,
  options?: {
    portfolioData?: Partial<PortfolioData> | null | undefined;
    leetCodeTotal?: number | undefined;
    resumeUrl?: string | undefined;
    whatsappNumber?: string | undefined;
  },
): { reply: string; suggestions: string[]; actions?: ChatAction[] } {
  const { info, projects, education, skillGroups, focusAreas, dsa, cgpa, solvedCount } =
    resolveAiProfile(options?.portfolioData, options?.leetCodeTotal);

  const query = rawQuery.toLowerCase().trim();
  const resume = options?.resumeUrl || info.resume || PERSONAL_INFO.resume;
  const whatsapp = options?.whatsappNumber || info.whatsapp || PERSONAL_INFO.whatsapp;

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
        ? `Main bilkul badhiya hoon, poochhne ke liye shukriya! Aap bataiye, aaj main aapki kaise madad kar sakta hoon?\n\nAap ${info.name} ke projects, ${dsa.language} DSA practice, skills ya contact details ke baare me poochh sakte hain!`
        : `I'm doing great, thank you for asking! How can I help you today?\n\nFeel free to ask about ${info.name}'s full-stack projects, ${dsa.language} & DSA problem solving, academics, or contact details.`,
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
        ? `Main **Ask Gopal** hoon — ${info.name} ka AI portfolio representative! Main aapko unke projects, ${solvedCount}+ LeetCode DSA solutions, skills aur resume ki accurate details de sakta hoon.\n\nAap kya jaanna chahte hain?`
        : `I am **Ask Gopal**, the portfolio assistant for **${info.name}**! I can answer questions about his software projects, ${solvedCount}+ LeetCode solutions, full-stack skillset, and contact details.\n\nWhat would you like to explore?`,
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
        ? `Namaste! **${info.name}** ke developer portfolio par aapka swagat hai! Aap mujhse unke projects, ${dsa.language} & DSA stats, academics ya contact options ke baare me poochh sakte hain.\n\nKis topic se shuru karein?`
        : `Hello and welcome! I'm **Ask Gopal**, here to help you explore **${info.name}**'s projects, ${dsa.language} & DSA achievements, and credentials.\n\nWhat would you like to explore first?`,
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

  if (
    query.includes("project") ||
    query.includes("app") ||
    query.includes("built") ||
    query.includes("dsa tracker") ||
    query.includes("trading") ||
    query.includes("kisansarthi") ||
    query.includes("work") ||
    query.includes("portfolio")
  ) {
    const projectItems = projects
      .slice(0, 5)
      .map(
        (p) =>
          `- **${p.title}** (${p.year}): ${p.summary}\n  *Tech Stack:* \`${p.technologies.slice(0, 4).join(", ")}\`${p.liveUrl ? ` • [Live Demo](${p.liveUrl})` : ""} • [GitHub](${p.githubUrl})`,
      )
      .join("\n\n");

    return {
      reply: isHindi
        ? `${info.name} ne kai full-stack aur real-world applications build kiye hain:\n\n${projectItems}\n\nAap kisi specific project ke features ya architecture ke baare me bhi poochh sakte hain!`
        : `Here are ${info.name}'s featured engineering projects:\n\n${projectItems}\n\nFeel free to open live demos or inspect the source repositories!`,
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
        ? `${info.name} **${dsa.language} & DSA** me regular problem-solving karte hain:\n\n- **${solvedCount}+ LeetCode Problems Solved** (Arrays, Strings, HashMaps, Trees, Recursion).\n- **LeetCode Profile:** [@${info.leetcodeUsername}](${info.leetcode})\n- **GitHub Repo:** [${dsa.repoName}](${dsa.repoUrl})\n\nWo har solution me Brute Force se Optimal approach aur time/space complexity document karte hain.`
        : `${info.name} practices **Data Structures & Algorithms (${dsa.language})** consistently:\n\n- **${solvedCount}+ LeetCode Problems Solved** across Arrays, Strings, HashMaps, Trees, and Recursion.\n- **LeetCode Profile:** [@${info.leetcodeUsername}](${info.leetcode})\n- **GitHub Repository:** [${dsa.repoName}](${dsa.repoUrl})\n\nSolutions are structured cleanly with time and space complexity trade-offs.`,
      suggestions: [
        "What projects has Gopal built?",
        "What is his college & CGPA?",
        "Download Resume",
      ],
      actions: [
        { label: "⚡ View DSA Section", action: "dsa" },
        { label: "🏆 Open LeetCode", url: info.leetcode },
      ],
    };
  }

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
    const primaryEdu = education[0];
    const extraSchools = education
      .slice(1)
      .map((e) => `${e.org} (${e.title} - ${e.period})`)
      .join(", ");

    return {
      reply: isHindi
        ? `${info.name} ki academic details:\n\n- **College:** ${primaryEdu?.title || "B.Tech CSE"} (${primaryEdu?.period || "2024 – 2028"}) at **${primaryEdu?.org || "SRMU"}**.\n- **Current Standing:** **${cgpa}**${extraSchools ? `\n- **Schooling:** ${extraSchools}` : ""}\n\nWo CS core subjects (OOP, DBMS, OS) ke saath full-stack engineering par focus kar rahe hain.`
        : `Here is ${info.name}'s academic background:\n\n- **University:** ${primaryEdu?.title || "B.Tech CSE"} (${primaryEdu?.period || "2024 – 2028"}) at **${primaryEdu?.org || "SRMU"}**.\n- **Standing:** **${cgpa}**${extraSchools ? `\n- **Schooling:** ${extraSchools}` : ""}\n\nHe pairs core CS fundamentals with hands-on software engineering projects.`,
      suggestions: [
        "What are Gopal's primary skills?",
        "What projects has he built?",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

  if (
    query.includes("skill") ||
    query.includes("tech") ||
    query.includes("stack") ||
    query.includes("language") ||
    query.includes("framework") ||
    query.includes("know")
  ) {
    const skillList = skillGroups.map((g) => `- **${g.title}:** ${g.skills.join(", ")}`).join("\n");

    return {
      reply: isHindi
        ? `${info.name} ke primary technical skills:\n\n${skillList}\n\nActive focus: ${focusAreas.slice(0, 3).join(", ")}.`
        : `${info.name}'s technical skill set spans:\n\n${skillList}\n\nCurrently focused on: ${focusAreas.slice(0, 3).join(", ")}.`,
      suggestions: [
        "What full-stack projects has he built?",
        "Tell me about his DSA skills",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

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
        ? `${info.name} **Software Engineering / Full-Stack Internships** ke liye actively open hain!\n\n**Connect Directly:**\n- **Email:** [${info.email}](mailto:${info.email})\n- **WhatsApp / Phone:** [${info.phone}](https://wa.me/${whatsapp})\n- **LinkedIn:** [${info.githubUsername || "linkedin"}](${info.linkedin})\n- **GitHub:** [${info.githubUsername || "github"}](${info.github})\n- **Location:** ${info.location}`
        : `${info.name} is open for **Software Engineering & Full-Stack Web Development internships and roles**!\n\n**Direct Contact Information:**\n- **Email:** [${info.email}](mailto:${info.email})\n- **WhatsApp / Phone:** [${info.phone}](https://wa.me/${whatsapp})\n- **LinkedIn:** [Profile](${info.linkedin})\n- **GitHub:** [${info.githubUsername || "GitHub"}](${info.github})\n- **Location:** ${info.location}`,
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
        ? `**OOPs ke 4 Core Pillars:**\n\n1. **Encapsulation:** Data aur methods ko ek single unit (class) me wrap karna with private fields & getters/setters.\n2. **Inheritance:** Code reusability ke liye parent class se properties child class me inherit karna (\`extends\`).\n3. **Polymorphism:** Same method name with different behaviors (Method Overloading & Overriding).\n4. **Abstraction:** Internal complex implementation hide karke sirf essential functionality expose karna (Abstract Classes & Interfaces).\n\n${info.name} in concepts ko ${dsa.language} aur modular full-stack web architectures me apply karte hain.`
        : `**Core Pillars of Object-Oriented Programming (OOP):**\n\n1. **Encapsulation:** Bundling data and methods into a single class with controlled access modifiers.\n2. **Inheritance:** Reusing and extending functionality from base classes to derived classes.\n3. **Polymorphism:** Allowing objects to respond dynamically through method overloading and overriding.\n4. **Abstraction:** Hiding low-level implementation details behind clean interfaces.\n\n${info.name} applies these principles across ${dsa.language} systems and full-stack web applications.`,
      suggestions: [
        "What projects has Gopal built?",
        "Tell me about his DSA background",
        "Download Resume",
      ],
      actions: [{ label: "📄 Download Resume", url: resume, action: "resume" }],
    };
  }

  const primaryEdu = education[0];
  return {
    reply: isHindi
      ? `**${info.name}** (${primaryEdu?.org || "SRMU"}, ${primaryEdu?.period || "2024–2028"}, **${cgpa}**) ek software developer hain jo **${dsa.language} & DSA (${solvedCount}+ LeetCode)** aur **Full-Stack Web Development (React, Node.js, Express, MongoDB)** par focus karte hain.\n\nAap unke projects, skills, education ya resume ke baare me poochh sakte hain!`
      : `**${info.name}** is a **B.Tech CSE student at ${primaryEdu?.org || "SRMU"}** (${cgpa}, ${primaryEdu?.period || "2024–2028"}) focused on **${dsa.language} & DSA (${solvedCount}+ LeetCode problems solved)** and **Full-Stack Web Development**.\n\nFeel free to ask about his projects, technical skills, problem solving, or internship availability!`,
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
