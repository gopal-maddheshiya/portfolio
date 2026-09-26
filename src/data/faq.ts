export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Skills" | "Projects" | "DSA" | "Internships" | "Contact";
}

export const FAQS: FAQItem[] = [
  {
    id: "who-is-gopal",
    question: "Who is Gopal Maddheshiya?",
    answer:
      "Gopal Maddheshiya is a Computer Science Engineering (B.Tech CSE) student at Shri Ramswaroop Memorial University (SRMU, 2024–2028 batch) and a passionate Java & Full-Stack Web Developer based in Uttar Pradesh, India. He combines algorithmic rigor in Java and Data Structures with practical end-to-end product development using React, Node.js, Express, and MongoDB.",
    category: "General",
  },
  {
    id: "tech-stack-skills",
    question: "What technologies and programming languages does Gopal specialize in?",
    answer:
      "Gopal specializes in Java (Object-Oriented Programming, Data Structures & Algorithms, Big-O complexity), Frontend Development (React.js, TypeScript, Tailwind CSS v4, HTML5/CSS3), Backend Development (Node.js, Express.js, RESTful APIs, JWT Authentication), Databases & Cloud (MongoDB Atlas, Mongoose, Supabase, PostgreSQL, MySQL), and Developer Tools (Git, GitHub, VS Code, IntelliJ IDEA, Vercel, Render).",
    category: "Skills",
  },
  {
    id: "top-projects",
    question: "What are Gopal Maddheshiya's notable projects?",
    answer:
      "Gopal has built several production-grade full-stack and AI applications:\n1. KisanSarthi AI (SIH 2026): An AI-driven agricultural decision support platform with multimodal Google Gemini Vision diagnostics, microclimate risk telemetry, and ICAR advisory workflows for farmers.\n2. Arun Gopal Traders: A production-ready bilingual grocery e-commerce web application with real-time stock sync, Supabase PostgreSQL with RLS, automated invoicing, and Gemini AI.\n3. DSA & Interview Prep Tracker: A full-stack MERN spaced-repetition coding revision platform with practice heatmaps, velocity analytics, and timeline logs.\n4. Node.js & MongoDB Message REST API: A robust persistent messaging REST API with complete CRUD operations deployed on Render.",
    category: "Projects",
  },
  {
    id: "dsa-track-record",
    question: "What is Gopal Maddheshiya's problem-solving and DSA track record?",
    answer:
      "Gopal is an active problem solver on LeetCode with 54+ verified Java solutions across Arrays, Strings, Recursion, Two Pointers, Sliding Window, and Binary Search Trees. He documents brute-force to optimal approaches with time and space complexity analysis in his open-source 'dsa-with-java' repository, and maintains active competitive profiles on GeeksforGeeks, CodeChef, and HackerRank.",
    category: "DSA",
  },
  {
    id: "hackathon-credentials",
    question: "What hackathon achievements and certifications does Gopal hold?",
    answer:
      "Gopal participated in the nationwide Smart India Hackathon (SIH) 2026 with project KisanSarthi, earned a felicitation and book prize in SRMU's 'Find The Language' algorithmic competition during VIVEKA 5.0, and holds verified course certificates in Semantic HTML5 and Modern Responsive CSS3.",
    category: "General",
  },
  {
    id: "internship-availability",
    question: "Is Gopal Maddheshiya available for internships or hire?",
    answer:
      "Yes, Gopal is actively open to Summer 2026 Software Development Engineer (SDE), Java Developer, and Full-Stack Web Developer internship opportunities. He is available for remote or in-person roles across India.",
    category: "Internships",
  },
  {
    id: "how-to-contact",
    question: "How can recruiters or collaborators get in touch with Gopal Maddheshiya?",
    answer:
      "You can contact Gopal via email at gopalmaddheshiya138@gmail.com, phone or WhatsApp at +91 6388354988, connect professionally on LinkedIn at linkedin.com/in/gopal-maddheshiya, or check his open-source code on GitHub at github.com/gopal-maddheshiya.",
    category: "Contact",
  },
];
