import dsaTrackerImage from "@/assets/dsa-tracker.webp";
import tradingCompanyImage from "@/assets/trading-company.webp";
import chatImage from "@/assets/node-chat.webp";
import jobsImage from "@/assets/job-card.webp";
import weatherImage from "@/assets/weather.webp";
import defaultProfilePhoto from "@/assets/gopal-cutout.webp";

export interface PersonalInfo {
  name: string;
  role: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  githubUsername: string;
  leetcode: string;
  leetcodeUsername: string;
  linkedin: string;
  medium?: string | undefined;
  substack?: string | undefined;
  reddit?: string | undefined;
  facebook?: string | undefined;
  instagram?: string | undefined;
  resume: string;
  siteUrl: string;
  ogImage: string;
  siteDescription: string;
  profilePhoto?: string | undefined;
  monogram?: string | undefined;
  universityShort?: string | undefined;
  footerTagline?: string | undefined;
}

export const PERSONAL_INFO: PersonalInfo = {
  name: "Gopal Maddheshiya",
  role: "B.Tech CSE Student | Java & Full-Stack Developer",
  subtitle: "Java & Full-Stack Developer · DSA & API Integration",
  location: "Maharajganj, Uttar Pradesh, India",
  email: "gopalmaddheshiya138@gmail.com",
  phone: "+91 6388354988",
  whatsapp: "916388354988",
  github: "https://github.com/gopal-maddheshiya",
  githubUsername: "gopal-maddheshiya",
  leetcode: "https://leetcode.com/u/gopal-maddheshiya/",
  leetcodeUsername: "gopal-maddheshiya",
  linkedin: "https://www.linkedin.com/in/gopal-maddheshiya",
  medium: "https://medium.com/@gopal-maddheshiya",
  substack: "https://substack.com/@gopalmaddheshiya",
  reddit: "https://www.reddit.com/user/gopal_96/",
  facebook: "https://www.facebook.com/gopalmaddheshiya63/",
  instagram: "https://www.instagram.com/gopalmaddheshiya63/",
  resume: "/gopal-cv.pdf",
  siteUrl: "https://gopal-maddheshiya.vercel.app",
  ogImage: "https://gopal-maddheshiya.vercel.app/og-image.jpg",
  siteDescription:
    "Computer Science student focused on Java, Data Structures & Algorithms and full-stack web development with React, Node.js and MongoDB.",
  profilePhoto: defaultProfilePhoto,
  monogram: "GM",
  universityShort: "SRMU · CSE '28",
  footerTagline: "Built with code and continuous learning.",
};

export interface HeroData {
  greetingBadge: string;
  headlinePrefix: string;
  typewriterRoles: string[];
  floatingBadge1: string;
  floatingBadge2: string;
  availabilityStatus: string;
  ctaPrimary?: string | undefined;
  ctaSecondary?: string | undefined;
}

export const HERO_DATA: HeroData = {
  greetingBadge: "Hi, I'm Gopal Maddheshiya",
  headlinePrefix: "Building software as a",
  typewriterRoles: [
    "Java & DSA Developer",
    "Full-Stack Web Engineer",
    "MERN Stack Specialist",
    "B.Tech CSE Student",
  ],
  floatingBadge1: "Java • DSA",
  floatingBadge2: "Full-Stack Developer",
  availabilityStatus: "Open to Work",
  ctaPrimary: "View my work",
  ctaSecondary: "View Resume",
};

export interface AboutData {
  eyebrow: string;
  title: string;
  description: string;
  storyTitle: string;
  storyParagraphs: string[];
  availabilityBadge?: string | undefined;
  principles: Array<{ title: string; description: string; icon: string }>;
  snapshot: {
    degree: string;
    cgpa: string;
    dsaPractice: string;
    stack: string;
    batch: string;
    university: string;
  };
  coursework: string[];
}

export const ABOUT_DATA: AboutData = {
  eyebrow: "About Me",
  title: "Passionate about problem solving & engineering web apps.",
  description:
    "A computer science student combining algorithmic rigor in Java with practical full-stack product development.",
  storyTitle: "A developer who learns by building, solving, and iterating.",
  storyParagraphs: [
    "I'm a Computer Science Engineering student at Shri Ramswaroop Memorial University, actively preparing for software engineering roles. My daily work revolves around two pillars: solving algorithmic problems in Java and engineering end-to-end web applications.",
    "On the algorithmic side, I practice problem-solving daily on LeetCode with deliberate focus on time and space complexity. On the development side, I turn ideas into responsive React interfaces backed by Express REST APIs and MongoDB databases.",
  ],
  availabilityBadge: "Open to Internships",
  principles: [
    {
      title: "Java & DSA",
      description: "Algorithmic thinking & Big-O complexity analysis.",
      icon: "code",
    },
    {
      title: "Full-Stack Dev",
      description: "End-to-end web apps with React, Node.js, Express & MongoDB.",
      icon: "cpu",
    },
    {
      title: "Clean Code",
      description: "Modular architecture & structured git commits.",
      icon: "zap",
    },
  ],
  snapshot: {
    degree: "B.Tech CSE",
    cgpa: "CGPA 7.63",
    dsaPractice: "Java · LeetCode",
    stack: "Full-Stack (MERN)",
    batch: "2028 Batch",
    university: "Shri Ramswaroop Memorial University (SRMU)",
  },
  coursework: [
    "Data Structures & Algorithms",
    "Design & Analysis of Algorithms",
    "Object-Oriented Programming (Java)",
    "Database Management Systems",
    "Operating Systems",
    "Software Engineering",
    "Cloud Computing (AWS)",
    "Web Development",
  ],
};

export interface ResumeCTAData {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  buttonText: string;
  updatedLabel?: string | undefined;
}

export const RESUME_CTA_DATA: ResumeCTAData = {
  eyebrow: "Resume / Curriculum Vitae",
  title: "Interested in my profile for an internship or role?",
  description:
    "My single-page resume covers my academic coursework at SRMU, core competencies in Java & DSA, full-stack project portfolio, and coding profile achievements.",
  tags: ["Single-Page PDF", "Java & Full-Stack Focus"],
  buttonText: "Download Resume",
  updatedLabel: "Updated 2026 · 1-Page PDF",
};

export interface ContactData {
  eyebrow: string;
  title: string;
  description: string;
  availabilityNote: string;
  availabilityTitle?: string | undefined;
  availabilitySubtitle?: string | undefined;
  directHeading?: string | undefined;
}

export const CONTACT_DATA: ContactData = {
  eyebrow: "Contact",
  title: "Let's connect & build something impactful.",
  description:
    "Have an internship opportunity, a project to collaborate on, or just want to discuss algorithms and full-stack development? Reach out via form or WhatsApp!",
  availabilityNote: "Open to Summer 2026 SWE & Full-Stack Internships",
  availabilityTitle: "Open for Internship & Full-Time Roles",
  availabilitySubtitle:
    "B.Tech CSE at SRMU · Verified DSA & Full-Stack track record · Typical response within 24 hours.",
  directHeading: "Direct contact",
};

export interface HighlightItem {
  label: string;
  detail: string;
  section: string;
  icon: string;
}

export const HIGHLIGHTS: HighlightItem[] = [
  { label: "B.Tech CSE", detail: "2024–2028 · CGPA 7.63", section: "about", icon: "grad" },
  { label: "Java & DSA", detail: "Active LeetCode Practice", section: "dsa", icon: "code" },
  { label: "Full-Stack Dev", detail: "React · Node · Mongo", section: "projects", icon: "db" },
  {
    label: "Verified Credentials",
    detail: "SRMU & Web Certificates",
    section: "certifications",
    icon: "award",
  },
  {
    label: "Opportunities",
    detail: "Open to SWE Roles",
    section: "contact",
    icon: "sparkles",
  },
];

export const FOCUS_AREAS: string[] = [
  "Java & Data Structures",
  "REST API Development",
  "MongoDB & Databases",
  "Object-Oriented Design",
  "Full-Stack Web Dev",
];

export interface SkillGroup {
  title: string;
  skills: string[];
  primary: boolean;
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Programming & DSA",
    skills: ["Java", "Data Structures", "Algorithms", "OOP Concepts", "Time & Space Complexity"],
    primary: true,
  },
  {
    title: "Frontend Development",
    skills: ["React.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS v4", "HTML5 & CSS3"],
    primary: true,
  },
  {
    title: "Backend & APIs",
    skills: ["Node.js", "Express.js", "RESTful APIs", "JWT Authentication", "Postman API Testing"],
    primary: true,
  },
  {
    title: "Databases & Cloud",
    skills: ["MongoDB Atlas", "Mongoose ODM", "Supabase", "PostgreSQL", "MySQL"],
    primary: false,
  },
  {
    title: "Developer Tools",
    skills: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "Vercel", "Render", "LeetCode"],
    primary: false,
  },
  {
    title: "CS Fundamentals",
    skills: [
      "Object-Oriented Design (OOP)",
      "Database Management (DBMS)",
      "Operating Systems",
      "Computer Networks",
    ],
    primary: false,
  },
];

export type Project = {
  title: string;
  year: string;
  category?: string | undefined;
  role?: string | undefined;
  summary: string;
  problem?: string | undefined;
  architecture?: string | undefined;
  challenges?: string | undefined;
  impact?: string[] | undefined;
  technologies: string[];
  features: string[];
  image?: string | undefined;
  githubUrl: string;
  liveUrl?: string | undefined;
  featured?: boolean | undefined;
};

export const PROJECTS: Project[] = [
  {
    title: "DSA & Interview Prep Tracker",
    year: "2026",
    category: "Full-Stack MERN",
    role: "Sole Full-Stack Developer",
    summary:
      "A production-ready preparation platform to track problem-solving velocity, log multi-attempt learnings, and prioritize revision using an interval-based spaced repetition model.",
    problem:
      "Engineered to solve unstructured coding practice with automated revision queues, difficulty distribution trends, and developer heatmap insights.",
    architecture:
      "Built on a decoupled React SPA and Express REST backend with stateless JWT auth, MongoDB Atlas schema indexing on attempt timestamps, and server-side aggregation pipelines computing daily streaks and difficulty splits.",
    challenges:
      "Balancing fast dashboard load times with multi-attempt history queries by replacing client-side reductions with indexed MongoDB $group and $facet pipelines.",
    impact: [
      "Automated due-date scheduling for spaced-repetition revision queues",
      "Unified 20-week heatmap, topic accuracy, and difficulty breakdown views",
      "JWT-protected multi-attempt timeline logging per problem",
    ],
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "JWT Auth",
      "Recharts",
      "Tailwind CSS",
    ],
    features: [
      "Spaced-repetition revision queue",
      "Native MongoDB analytics aggregations",
      "20-week practice activity heatmap",
      "Velocity & difficulty distribution charts",
      "Multi-attempt timeline logging",
      "JWT authentication & protected API",
    ],
    image: dsaTrackerImage,
    githubUrl: "https://github.com/gopal-maddheshiya/dsa-tracker",
    liveUrl: "https://dsa-tracker-gopal.vercel.app",
    featured: true,
  },
  {
    title: "Arun Gopal Traders — E-Commerce",
    year: "2026",
    category: "Full-Stack & Cloud",
    role: "Lead Full-Stack & Database Architect",
    summary:
      "A production-ready bilingual grocery and retail e-commerce platform with live order tracking, Supabase PostgreSQL with RLS, realtime sync, Gemini AI, and automated billing.",
    problem:
      "Built for commercial retail operations with real-time stock and order management, localized dual language catalog, and AI-assisted admin intelligence.",
    architecture:
      "Powered by React 19 + TanStack Start backed by Supabase PostgreSQL with strict Row-Level Security (RLS) policies, Supabase Realtime channels for live inventory/order broadcasts, Gemini AI catalog search, and client-ready PDF bill generation.",
    challenges:
      "Preventing stock drift and unauthorized admin mutations while keeping checkout snappy — solved via transactional PostgreSQL RPC updates and role-scoped RLS rules.",
    impact: [
      "Dual-language Hindi & English storefront broadening local accessibility",
      "Instant Pub/Sub order tracking & stock sync across customer and admin views",
      "Automated PDF invoice generation cutting manual billing effort",
    ],
    technologies: [
      "React 19",
      "TanStack Start",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS v4",
      "Gemini AI",
    ],
    features: [
      "Supabase PostgreSQL with RLS policies",
      "Realtime Pub/Sub order status sync",
      "Bilingual i18n support (Hindi & English)",
      "Gemini AI product intelligence & search",
      "Automated PDF invoicing & billing",
      "Customer order tracking & admin dashboard",
    ],
    image: tradingCompanyImage,
    githubUrl: "https://github.com/gopal-maddheshiya/trading-company",
    liveUrl: "https://arun-gopal-traders.vercel.app/",
    featured: true,
  },
  {
    title: "KisanSarthi AI — Krishi Suraksha Platform",
    year: "2026",
    category: "AI & Full-Stack",
    role: "Full-Stack & AI Workflow Engineer (SIH 2026)",
    summary:
      "An AI-powered agricultural decision support system combining multimodal vision diagnostics, real-time microclimate risk analysis, and ICAR advisory workflows for farmers.",
    problem:
      "Solves critical delays in crop pest identification and weather vulnerability by providing offline-ready multimodal AI diagnosis, early warning alerts, and verified expert intervention.",
    architecture:
      "Integrates React 18 & TypeScript frontend with Google Gemini Vision AI for leaf/pest image analysis, Open-Meteo telemetry for humidity/temperature risk scoring, Leaflet regional heatmaps, and Supabase PostgreSQL persistence.",
    challenges:
      "Structuring noisy weather and multimodal vision outputs into clear, actionable ICAR-aligned crop advisories usable in low-connectivity rural workflows.",
    impact: [
      "Selected & pitched at Smart India Hackathon (SIH) 2026",
      "Combines leaf image diagnostics with real-time regional disease heatmaps",
      "Actionable ICAR preventive guidance tailored to local microclimate risk",
    ],
    technologies: [
      "React 18",
      "TypeScript",
      "Google Gemini Vision AI",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Leaflet",
      "Open-Meteo API",
    ],
    features: [
      "Multimodal AI crop disease & pest detection",
      "Microclimate telemetry & disease heatmaps",
    ],
    image:
      "https://rnchpivzlmjlvctjqitr.supabase.co/storage/v1/object/public/portfolio-media/projects/1789322060068-KisanSarthiImage.png",
    githubUrl: "https://github.com/gopal-maddheshiya/krishi-suraksha-sih2026",
    liveUrl: "https://krishi-suraksha-sih2026.vercel.app",
    featured: true,
  },
  {
    title: "Node.js & MongoDB Message REST API",
    year: "2025",
    category: "Backend & APIs",
    role: "Backend Engineer",
    summary:
      "A RESTful message API built with Node.js, Express.js, MongoDB and Mongoose, implementing complete CRUD operations with persistent cloud database storage on Render.",
    problem:
      "Built to understand how persistent data flows across the web stack — connecting Express REST endpoints with Mongoose schema modeling and MongoDB Atlas.",
    architecture:
      "Modular Express router architecture separating route controllers, Mongoose validation schemas (sender, receiver, timestamped message documents), HTTP method-override support, and cloud MongoDB Atlas persistence hosted on Render.",
    challenges:
      "Designing clean schema validation and predictable error handling across full create/read/update/delete lifecycles in stateless HTTP routes.",
    impact: [
      "End-to-end persistent CRUD API deployed live on Render",
      "Clean MVC separation between routing, validation, and data models",
    ],
    technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JavaScript", "HTML/CSS"],
    features: [
      "RESTful API endpoints",
      "Complete CRUD operations",
      "MongoDB database persistence",
      "Mongoose data modeling",
      "Sender/receiver/message data handling",
      "Deployed on Render",
    ],
    image: chatImage,
    githubUrl: "https://github.com/gopal-maddheshiya/node-chat-api",
    liveUrl: "https://node-chat-api-luk6.onrender.com/chats",
    featured: true,
  },
  {
    title: "Weather Forecast Web App",
    year: "2025",
    category: "Frontend",
    role: "Frontend Developer",
    summary:
      "A client-side weather application integrating the OpenWeatherMap API with asynchronous JavaScript, browser geolocation, temperature conversion and responsive UI.",
    problem:
      "Checking current weather and multi-day forecasts seamlessly across cities with instant geolocation detection and unit conversion.",
    architecture:
      "Vanilla ES6 async/await fetch layer querying OpenWeatherMap REST endpoints alongside the browser Geolocation API, caching unit preferences for instant °C/°F switching.",
    challenges:
      "Gracefully handling geolocation permission denials and invalid city lookups without breaking UI state.",
    impact: [
      "Instant coordinate-based local weather lookup via browser Geolocation API",
      "Zero-dependency fast static deployment on GitHub Pages",
    ],
    technologies: ["JavaScript", "HTML5", "CSS3", "OpenWeatherMap API", "Geolocation API"],
    features: [
      "OpenWeatherMap REST API integration",
      "Async/await data fetching",
      "Browser Geolocation API",
      "Celsius/Fahrenheit conversion",
      "Dynamic weather rendering",
      "GitHub Pages deployment",
    ],
    image: weatherImage,
    githubUrl: "https://github.com/gopal-maddheshiya/weather-app",
    liveUrl: "https://gopal-maddheshiya.github.io/weather-app/",
    featured: false,
  },
  {
    title: "Job Listing Cards — React",
    year: "2026",
    category: "Frontend",
    role: "Frontend Developer",
    summary:
      "A React component practice project focused on reusable components, props-driven rendering and responsive card layouts.",
    problem:
      "Practicing modular React component composition, structured prop passing, and data-driven rendering of dynamic role cards.",
    architecture:
      "Component-driven React architecture mapping typed job role objects into reusable card components styled with responsive CSS layouts.",
    challenges:
      "Maintaining uniform card geometry and spacing across varying title lengths and tag counts.",
    impact: ["Clean, reusable prop-driven card UI components deployed live on Render"],
    technologies: ["React.js", "JavaScript", "CSS3"],
    features: [
      "Reusable React components",
      "Props-driven rendering",
      "Structured job listing data",
      "Modular component styling",
      "Render deployment",
    ],
    image: jobsImage,
    githubUrl: "https://github.com/gopal-maddheshiya/react-learning/tree/main/04-cards-project",
    liveUrl: "https://react-learning-gyof.onrender.com/",
    featured: false,
  },
];

interface DsaDifficultyItem {
  label: string;
  count: number;
  percent: number;
  color: string;
  bg: string;
  border: string;
  bar: string;
}

export interface DsaTopicItem {
  topic: string;
  count: number;
}

export interface DsaInfo {
  problemsSolved: string;
  totalSolvedCount: number;
  language: string;
  repoName: string;
  repoUrl: string;
  difficulty: DsaDifficultyItem[];
  topicBreakdown: DsaTopicItem[];
  topics: string[];
  notes: string[];
}

export const DSA_INFO: DsaInfo = {
  problemsSolved: "54+",
  totalSolvedCount: 54,
  language: "Java",
  repoName: "dsa-with-java",
  repoUrl: "https://github.com/gopal-maddheshiya/dsa-with-java",
  difficulty: [
    {
      label: "Easy",
      count: 30,
      percent: 56,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      bar: "bg-emerald-500",
    },
    {
      label: "Medium",
      count: 22,
      percent: 41,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bar: "bg-amber-500",
    },
    {
      label: "Hard",
      count: 2,
      percent: 4,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      bar: "bg-rose-500",
    },
  ],
  topicBreakdown: [
    { topic: "Arrays & Strings", count: 19 },
    { topic: "Recursion & Backtracking", count: 10 },
    { topic: "Two Pointers & Window", count: 8 },
    { topic: "Binary Trees & BST", count: 8 },
    { topic: "Sorting & Binary Search", count: 6 },
    { topic: "Linked Lists & Stacks", count: 5 },
  ],
  topics: [
    "Arrays",
    "Strings",
    "Recursion",
    "Sorting",
    "Searching",
    "Binary Trees",
    "Two Pointers",
  ],
  notes: [
    "Solutions organized by topic, data structure, and problem pattern",
    "Multiple approaches (Brute Force → Optimal) documented",
    "Time and Space Big-O complexity noted with every Java solution",
  ],
};

export interface CodingProfile {
  name: string;
  url: string;
  username: string;
  description: string;
  icon: "code" | "terminal" | "codechef" | "trophy";
  highlight?: string | undefined;
  hidden?: boolean | undefined;
}

export const CODING_PROFILES: CodingProfile[] = [
  {
    name: "LeetCode",
    url: PERSONAL_INFO.leetcode,
    username: PERSONAL_INFO.leetcodeUsername,
    description: "Java solutions and ongoing problem-solving practice.",
    icon: "code",
    highlight: "Daily Java Practice",
  },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
    username: "gopalmaddheshiya",
    description: "Coding practice and data structures learning.",
    icon: "terminal",
    highlight: "DSA Core",
  },
  {
    name: "CodeChef",
    url: "https://www.codechef.com/users/gopal_code_96",
    username: "gopal_code_96",
    description: "Competitive programming and algorithm practice.",
    icon: "codechef",
    highlight: "Contests",
  },
  {
    name: "HackerRank",
    url: "https://www.hackerrank.com/profile/gopalmaddheshiy1",
    username: "gopalmaddheshiy1",
    description: "Problem solving challenges and skills badges.",
    icon: "trophy",
    highlight: "Verified Badges",
  },
];

export interface EducationItem {
  title: string;
  org: string;
  period: string;
  detail: string;
}

export const EDUCATION: EducationItem[] = [
  {
    title: "B.Tech, Computer Science Engineering",
    org: "Shri Ramswaroop Memorial University",
    period: "2024 – 2028",
    detail: "CGPA 7.63",
  },
  { title: "Class XII", org: "Modern Academy", period: "2024", detail: "" },
  { title: "Class X", org: "Modern Academy", period: "2021", detail: "" },
];

export type Certification = {
  title: string;
  org: string;
  period: string;
  category?: string | undefined;
  featured?: boolean | undefined;
  detail: string;
  skills: string[];
  certificateUrl?: string | undefined;
};

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Find The Language",
    org: "Shri Ramswaroop Memorial University",
    period: "Feb 2026",
    category: "Contest Win",
    featured: true,
    detail: "Critical thinking, problem-solving, and algorithmic programming contest.",
    skills: ["Problem Solving", "Logic", "Java"],
    certificateUrl: "/certificates/find-the-language.pdf",
  },
  {
    title: "HTML Course Completion",
    org: "Prashant Jain",
    period: "Nov 2024",
    category: "Coursework",
    detail: "Semantic HTML5, DOM architecture, web accessibility, and page layout structuring.",
    skills: ["HTML5", "Semantic Web", "DOM"],
    certificateUrl: "/certificates/html-certificate.pdf",
  },
  {
    title: "CSS Course Completion",
    org: "Prashant Jain",
    period: "Nov 2024",
    category: "Coursework",
    detail: "Modern CSS layout models, Flexbox, CSS Grid, responsive design, and transitions.",
    skills: ["CSS3", "Flexbox", "CSS Grid", "Responsive Design"],
    certificateUrl: "/certificates/css-certificate.pdf",
  },
];

export interface AcademicMediaItem {
  id: string;
  title: string;
  caption: string; // What this relates to / description
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string | undefined;
  category?: string | undefined; // e.g. "Hackathon", "College Event", "Lab Project", "Workshop", "Campus"
  date?: string | undefined; // e.g. "2025" or "Oct 2025"
  featured?: boolean | undefined;
}

export const ACADEMIC_GALLERY: AcademicMediaItem[] = [
  {
    id: "19ffae9b-efeb-4a71-a9c6-41e26ff3796f",
    url: "https://rnchpivzlmjlvctjqitr.supabase.co/storage/v1/object/public/portfolio-media/gallery/1789319737441-IMG_20260907_124651536.jpg",
    date: "2026",
    type: "image",
    title: "Smart India Hackathon (SIH) 2026 — KishanSarthi",
    caption:
      "Participated in Smart India Hackathon (SIH) 2026 with project 'KisanSarthi', focused on solving core agricultural and farmer workflow challenges. Contributed to problem statement research, technical architecture, and pitch presentation.",
    category: "Smart India Hackathon",
    thumbnailUrl: "",
    featured: true,
  },
  {
    id: "14d5d31c-4e82-4d26-bc19-47dd41a9524b",
    url: "https://rnchpivzlmjlvctjqitr.supabase.co/storage/v1/object/public/portfolio-media/gallery/1789435597469-17047.png",
    date: "2026",
    type: "image",
    title: "Project Pitch & Technical Walkthrough — KishanSarthi",
    caption:
      "Delivering a technical walkthrough and pitch for project 'KisanSarthi', explaining the problem of agricultural inefficiencies and outlining our multi-pronged solution strategy involving AI and modern stack.",
    category: "Smart India Hackathon",
    thumbnailUrl: "",
  },
  {
    id: "64a9960f-982c-4868-b072-e059a82ff2a5",
    url: "https://rnchpivzlmjlvctjqitr.supabase.co/storage/v1/object/public/portfolio-media/gallery/1789535278423-17048.jpg",
    date: "2026",
    type: "image",
    title: "Find The Language Competition",
    caption:
      "Competed in 'Find The Language' at SRMU's annual tech fest VIVEKA 5.0. Advanced through rapid syntax identification rounds under strict time constraints into the final programming problem-solving stage, earning a book prize during the felicitation ceremony.",
    category: "Coding Competition",
    thumbnailUrl: "",
  },
];

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "dsa", label: "DSA" },
  { id: "profiles", label: "Profiles" },
  { id: "certifications", label: "Certificates" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export type EditableSectionKey =
  "skills" | "projects" | "dsa" | "profiles" | "certifications" | "gallery" | "faq";

export interface SectionHeaderMeta {
  eyebrow?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
}

export type SectionHeadersMap = Partial<Record<EditableSectionKey, SectionHeaderMeta>>;

export const DEFAULT_SECTION_HEADERS: Record<
  EditableSectionKey,
  { eyebrow: string; title: string; description: string }
> = {
  skills: {
    eyebrow: "Technical Stack",
    title: "Skills & Tech Stack",
    description: "Core full-stack & Java technologies I build with, organized by layer.",
  },
  projects: {
    eyebrow: "Featured Projects",
    title: "Selected Engineering Work",
    description:
      "Production full-stack builds, AI-driven workflows, and REST APIs — inspect code or open any Case Study.",
  },
  dsa: {
    eyebrow: "DSA & Problem Solving",
    title: "Live LeetCode & Problem Solving",
    description:
      "Real-time synchronized coding metrics, problem difficulty distribution, badges, and 1-year practice activity directly from LeetCode.",
  },
  profiles: {
    eyebrow: "Coding Profiles",
    title: "Platforms & Practice",
    description: "Public problem solving, open-source work, and competitive programming profiles.",
  },
  certifications: {
    eyebrow: "Certifications & Achievements",
    title: "Certificates",
    description:
      "Course completions, technical certifications, and university academic achievements.",
  },
  gallery: {
    eyebrow: "Campus Life & Highlights",
    title: "Academic Moments & Media",
    description:
      "A visual showcase of university milestones, hackathon participations, campus workshops, and technical demonstrations.",
  },
  faq: {
    eyebrow: "KNOWLEDGE BASE & AEO",
    title: "Frequently Asked Questions & Verified Facts",
    description:
      "Clear, structured facts about Gopal Maddheshiya's background, B.Tech CSE at SRMU, Java & Full-Stack skills, SIH hackathon projects, and internship availability for visitors and AI answer engines.",
  },
};
