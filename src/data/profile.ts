import dsaTrackerImage from "@/assets/dsa-tracker.webp";
import tradingCompanyImage from "@/assets/trading-company.webp";
import chatImage from "@/assets/node-chat.webp";
import jobsImage from "@/assets/job-card.webp";
import weatherImage from "@/assets/weather.webp";
import defaultProfilePhoto from "@/assets/gopal-profile.jpg";

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
  resume: string;
  siteUrl: string;
  ogImage: string;
  siteDescription: string;
  profilePhoto?: string;
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
  resume: "/gopal-cv.pdf",
  siteUrl: "https://gopal-maddheshiya.vercel.app",
  ogImage: "https://gopal-maddheshiya.vercel.app/og-image.jpg",
  siteDescription:
    "Computer Science student focused on Java, Data Structures & Algorithms and full-stack web development with React, Node.js and MongoDB.",
  profilePhoto: defaultProfilePhoto,
};

export interface HeroData {
  greetingBadge: string;
  headlinePrefix: string;
  typewriterRoles: string[];
  floatingBadge1: string;
  floatingBadge2: string;
  availabilityStatus: string;
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
  floatingBadge2: "Full-Stack",
  availabilityStatus: "Online",
};

export interface AboutData {
  eyebrow: string;
  title: string;
  description: string;
  storyTitle: string;
  storyParagraphs: string[];
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
    cgpa: "CGPA 7.62",
    dsaPractice: "Java · LeetCode",
    stack: "Java & Full-Stack",
    batch: "2028 Batch",
    university: "SRMU University",
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
}

export const RESUME_CTA_DATA: ResumeCTAData = {
  eyebrow: "Resume / Curriculum Vitae",
  title: "Interested in my profile for an internship or role?",
  description:
    "My single-page resume covers my academic coursework at SRMU, core competencies in Java & DSA, full-stack project portfolio, and coding profile achievements.",
  tags: ["Single-Page PDF", "Java & Full-Stack Focus"],
  buttonText: "Download Resume",
};

export interface ContactData {
  eyebrow: string;
  title: string;
  description: string;
  availabilityNote: string;
}

export const CONTACT_DATA: ContactData = {
  eyebrow: "Contact",
  title: "Let's connect & build something impactful.",
  description:
    "Have an internship opportunity, a project to collaborate on, or just want to discuss algorithms and full-stack development? Reach out via form or WhatsApp!",
  availabilityNote: "Open to Summer 2026 SWE & Full-Stack Internships",
};

export interface HighlightItem {
  label: string;
  detail: string;
  section: string;
  icon: string;
}

export const HIGHLIGHTS: HighlightItem[] = [
  { label: "B.Tech CSE", detail: "2024–2028 · CGPA 7.62", section: "about", icon: "grad" },
  { label: "Java & DSA", detail: "Active LeetCode Practice", section: "dsa", icon: "code" },
  { label: "Full-Stack Dev", detail: "React · Node · Mongo", section: "projects", icon: "db" },
  {
    label: "Verified Credentials",
    detail: "SRMU & Web Certificates",
    section: "certifications",
    icon: "award",
  },
  { label: "Opportunities", detail: "Open to SWE Roles", section: "contact", icon: "sparkles" },
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
  category?: string;
  summary: string;
  problem?: string;
  technologies: string[];
  features: string[];
  image?: string;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "DSA & Interview Prep Tracker",
    year: "2026",
    category: "Full-Stack MERN",
    summary:
      "A production-ready preparation platform to track problem-solving velocity, log multi-attempt learnings, and prioritize revision using an interval-based spaced repetition model.",
    problem:
      "Engineered to solve unstructured coding practice with automated revision queues, difficulty distribution trends, and developer heatmap insights.",
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
    liveUrl: "https://dsa-tracker-xi-weld.vercel.app",
    featured: true,
  },
  {
    title: "Arun Gopal Traders — E-Commerce",
    year: "2026",
    category: "Full-Stack & Cloud",
    summary:
      "A production-ready bilingual grocery and retail e-commerce platform with live order tracking, Supabase PostgreSQL with RLS, realtime sync, Gemini AI, and automated billing.",
    problem:
      "Built for commercial retail operations with real-time stock and order management, localized dual language catalog, and AI-assisted admin intelligence.",
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
    liveUrl: "https://gopal-maddheshiya.vercel.app",
    featured: true,
  },
  {
    title: "Node.js & MongoDB Message REST API",
    year: "2025",
    category: "Backend & APIs",
    summary:
      "A RESTful message API built with Node.js, Express.js, MongoDB and Mongoose, implementing complete CRUD operations with persistent cloud database storage on Render.",
    problem:
      "Built to understand how persistent data flows across the web stack — connecting Express REST endpoints with Mongoose schema modeling and MongoDB Atlas.",
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
    summary:
      "A client-side weather application integrating the OpenWeatherMap API with asynchronous JavaScript, browser geolocation, temperature conversion and responsive UI.",
    problem:
      "Checking current weather and multi-day forecasts seamlessly across cities with instant geolocation detection and unit conversion.",
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
    summary:
      "A React component practice project focused on reusable components, props-driven rendering and responsive card layouts.",
    problem:
      "Practicing modular React component composition, structured prop passing, and data-driven rendering of dynamic role cards.",
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

export const DSA_INFO = {
  problemsSolved: "53+",
  totalSolvedCount: 53,
  language: "Java",
  repoName: "dsa-with-java",
  repoUrl: "https://github.com/gopal-maddheshiya/dsa-with-java",
  difficulty: [
    {
      label: "Easy",
      count: 29,
      percent: 55,
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
    { topic: "Arrays & Strings", count: 18 },
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
}

export const CODING_PROFILES: CodingProfile[] = [
  {
    name: "LeetCode",
    url: PERSONAL_INFO.leetcode,
    username: PERSONAL_INFO.leetcodeUsername,
    description: "Java solutions and ongoing problem-solving practice.",
    icon: "code",
  },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
    username: "gopalmaddheshiya",
    description: "Coding practice and data structures learning.",
    icon: "terminal",
  },
  {
    name: "CodeChef",
    url: "https://www.codechef.com/users/gopal_code_96",
    username: "gopal_code_96",
    description: "Competitive programming and algorithm practice.",
    icon: "codechef",
  },
  {
    name: "HackerRank",
    url: "https://www.hackerrank.com/profile/gopalmaddheshiy1",
    username: "gopalmaddheshiy1",
    description: "Problem solving challenges and skills badges.",
    icon: "trophy",
  },
];

export interface JourneyMilestone {
  phase: string;
  title: string;
  detail: string;
  status: "done" | "active" | "next";
  tags: string[];
}

export const JOURNEY: JourneyMilestone[] = [
  {
    phase: "01",
    title: "Java Fundamentals & OOP",
    detail:
      "Object-oriented principles, classes, inheritance, collections framework, and clean code structure.",
    status: "done",
    tags: ["Java", "OOP", "Collections"],
  },
  {
    phase: "02",
    title: "Core Data Structures",
    detail:
      "Arrays, strings, recursion, sorting algorithms, and searching techniques with Big-O complexity analysis.",
    status: "done",
    tags: ["Arrays", "Recursion", "Big-O"],
  },
  {
    phase: "03",
    title: "Daily LeetCode Problem Solving",
    detail:
      "Practicing Java problem solving with arrays, strings, recursion and common problem-solving patterns.",
    status: "active",
    tags: ["LeetCode", "Java", "Algorithms"],
  },
  {
    phase: "04",
    title: "Full-Stack Web Development",
    detail:
      "Building end-to-end applications with React interfaces, Express REST APIs, and MongoDB persistence.",
    status: "active",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    phase: "05",
    title: "Trees, Graphs & Advanced Patterns",
    detail:
      "Currently practicing binary search trees, tree traversals, graph algorithms (BFS/DFS), and dynamic programming.",
    status: "next",
    tags: ["Trees", "Graphs", "DP"],
  },
  {
    phase: "06",
    title: "System Fundamentals & Architecture",
    detail:
      "Deepening understanding of database indexing, REST design patterns, and deployment pipelines.",
    status: "next",
    tags: ["System Basics", "Databases", "APIs"],
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
    detail: "CGPA 7.62",
  },
  { title: "Class XII", org: "Modern Academy", period: "2024", detail: "" },
  { title: "Class X", org: "Modern Academy", period: "2021", detail: "" },
];

export type Certification = {
  title: string;
  org: string;
  period: string;
  detail: string;
  skills: string[];
  certificateUrl?: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Find The Language",
    org: "Shri Ramswaroop Memorial University",
    period: "Feb 2026",
    detail: "Critical thinking, problem-solving, and algorithmic programming contest.",
    skills: ["Problem Solving", "Logic", "Java"],
    certificateUrl: "/certificates/find-the-language.pdf",
  },
  {
    title: "HTML Course Completion",
    org: "Prashant Jain",
    period: "Nov 2024",
    detail: "Semantic HTML5, DOM architecture, web accessibility, and page layout structuring.",
    skills: ["HTML5", "Semantic Web", "DOM"],
    certificateUrl: "/certificates/html-certificate.pdf",
  },
  {
    title: "CSS Course Completion",
    org: "Prashant Jain",
    period: "Nov 2024",
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
  thumbnailUrl?: string;
  category?: string; // e.g. "Hackathon", "College Event", "Lab Project", "Workshop", "Campus"
  date?: string; // e.g. "2025" or "Oct 2025"
}

export const ACADEMIC_GALLERY: AcademicMediaItem[] = [];

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "dsa", label: "DSA" },
  { id: "profiles", label: "Profiles" },
  { id: "certifications", label: "Certificates" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];
