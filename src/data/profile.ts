import chatImage from "@/assets/node-chat.png";
import jobsImage from "@/assets/job-card.png";
import weatherImage from "@/assets/weather.png";

export const PERSONAL_INFO = {
  name: "Gopal Maddheshiya",
  role: "B.Tech CSE Student | Java & Full-Stack Developer",
  subtitle: "Java & Full-Stack Developer · DSA & API Integration",
  location: "Maharajganj, Uttar Pradesh, India",
  email: "gopalmaddheshiya138@gmail.com",
  phone: "+91 6388354988",
  // Digits only, with country code (no +, no spaces) — used for wa.me links
  whatsapp: "916388354988",
  github: "https://github.com/gopal-maddheshiya",
  githubUsername: "gopal-maddheshiya",
  leetcode: "https://leetcode.com/u/gopal-maddheshiya/",
  leetcodeUsername: "gopal-maddheshiya",
  linkedin: "https://www.linkedin.com/in/gopal-maddheshiya",
  resume: "/gopal-cv.pdf",
  siteUrl: "https://gopal-maddheshiya.vercel.app",
  ogImage: "https://gopal-maddheshiya.vercel.app/og-image.png",
  siteDescription:
    "Computer Science student focused on Java, Data Structures & Algorithms and full-stack web development with React, Node.js and MongoDB.",
} as const;

export const HIGHLIGHTS = [
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

export const FOCUS_AREAS = [
  "Java & Data Structures",
  "REST API Development",
  "MongoDB & Databases",
  "Object-Oriented Design",
  "Full-Stack Web Dev",
];

export const SKILL_GROUPS = [
  {
    title: "Programming & DSA",
    skills: ["Java", "Data Structures", "Algorithms", "OOP Concepts", "Complexity Analysis"],
    primary: true,
  },
  {
    title: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React.js", "Responsive Design"],
    primary: true,
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express.js", "REST APIs", "CRUD Operations"],
    primary: true,
  },
  {
    title: "Databases",
    skills: ["MongoDB", "Mongoose", "MySQL"],
    primary: false,
  },
  {
    title: "Developer Tools",
    skills: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "Postman", "LeetCode"],
    primary: false,
  },
  {
    title: "CS Fundamentals",
    skills: ["OOP", "Operating Systems", "DBMS", "Computer Networks"],
    primary: false,
  },
];

export type Project = {
  title: string;
  year: string;
  summary: string;
  problem: string;
  technologies: string[];
  features: string[];
  image?: string;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "Node.js & MongoDB Message API",
    year: "2025",
    summary:
      "A RESTful message API built with Node.js, Express.js, MongoDB and Mongoose, implementing complete CRUD operations with persistent cloud database storage.",
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
      "Error handling",
      "Responsive UI",
      "GitHub Pages deployment",
    ],
    image: weatherImage,
    githubUrl: "https://github.com/gopal-maddheshiya/weather-app",
    liveUrl: "https://gopal-maddheshiya.github.io/weather-app/",
    featured: true,
  },
  {
    title: "Job Listing Cards — React",
    year: "2026",
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
      "Responsive card layout",
      "Render deployment",
    ],
    image: jobsImage,
    githubUrl: "https://github.com/gopal-maddheshiya/react-learning/tree/main/04-cards-project",
    liveUrl: "https://react-learning-gyof.onrender.com/",
    featured: true,
  },
];

export const DSA_INFO = {
  problemsSolved: "50+",
  language: "Java",
  repoName: "dsa-with-java",
  repoUrl: "https://github.com/gopal-maddheshiya/dsa-with-java",
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
    "Solutions organised by topic and pattern",
    "Multiple approaches where the trade-off matters",
    "Time and space complexity noted with each solution",
  ],
};

export const CODING_PROFILES = [
  {
    name: "LeetCode",
    url: PERSONAL_INFO.leetcode,
    username: PERSONAL_INFO.leetcodeUsername,
    description: "Java solutions and ongoing problem-solving practice.",
    icon: "code" as const,
  },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
    username: "gopalmaddheshiya",
    description: "Coding practice and data structures learning.",
    icon: "terminal" as const,
  },
  {
    name: "CodeChef",
    url: "https://www.codechef.com/users/gopal_code_96",
    username: "gopal_code_96",
    description: "Competitive programming and algorithm practice.",
    icon: "codechef" as const,
  },
  {
    name: "HackerRank",
    url: "https://www.hackerrank.com/profile/gopalmaddheshiy1",
    username: "gopalmaddheshiy1",
    description: "Problem solving challenges and skills badges.",
    icon: "trophy" as const,
  },
] as const;

export const JOURNEY = [
  {
    phase: "01",
    title: "Java Fundamentals & OOP",
    detail:
      "Object-oriented principles, classes, inheritance, collections framework, and clean code structure.",
    status: "done" as const,
    tags: ["Java", "OOP", "Collections"],
  },
  {
    phase: "02",
    title: "Core Data Structures",
    detail:
      "Arrays, strings, recursion, sorting algorithms, and searching techniques with Big-O complexity analysis.",
    status: "done" as const,
    tags: ["Arrays", "Recursion", "Big-O"],
  },
  {
    phase: "03",
    title: "Daily LeetCode Problem Solving",
    detail:
      "Practicing Java problem solving with arrays, strings, recursion and common problem-solving patterns.",
    status: "active" as const,
    tags: ["LeetCode", "Java", "Algorithms"],
  },
  {
    phase: "04",
    title: "Full-Stack Web Development",
    detail:
      "Building end-to-end applications with React interfaces, Express REST APIs, and MongoDB persistence.",
    status: "active" as const,
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    phase: "05",
    title: "Trees, Graphs & Advanced Patterns",
    detail:
      "Currently practicing binary search trees, tree traversals, graph algorithms (BFS/DFS), and dynamic programming.",
    status: "next" as const,
    tags: ["Trees", "Graphs", "DP"],
  },
  {
    phase: "06",
    title: "System Fundamentals & Architecture",
    detail:
      "Deepening understanding of database indexing, REST design patterns, and deployment pipelines.",
    status: "next" as const,
    tags: ["System Basics", "Databases", "APIs"],
  },
];

export const EDUCATION = [
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
  skills: readonly string[];
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

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "dsa", label: "DSA" },
  { id: "profiles", label: "Profiles" },
  { id: "certifications", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
