import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/portfolio/About";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { DSA } from "@/components/portfolio/DSA";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { Highlights } from "@/components/portfolio/Highlights";
import { Journey } from "@/components/portfolio/Journey";
import { Navbar } from "@/components/portfolio/Navbar";
import { Profiles } from "@/components/portfolio/Profiles";
import { Projects } from "@/components/portfolio/Projects";
import { ResumeCTA } from "@/components/portfolio/ResumeCTA";
import { Skills } from "@/components/portfolio/Skills";
import { GopalAIAssistant } from "@/components/ai/GopalAIAssistant";
import { PERSONAL_INFO } from "@/data/profile";

const TITLE = "Gopal Maddheshiya | B.Tech CSE Student | Java & Full-Stack Developer";
const DESCRIPTION =
  "Portfolio of Gopal Maddheshiya, a Computer Science Engineering student focused on Java, Data Structures & Algorithms and full-stack web development with React, Node.js and MongoDB.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${PERSONAL_INFO.siteUrl}/` },
      { property: "og:image", content: PERSONAL_INFO.ogImage },
      { property: "og:image:secure_url", content: PERSONAL_INFO.ogImage },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Gopal Maddheshiya — Java & Full-Stack Developer Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: PERSONAL_INFO.ogImage },
    ],
    links: [{ rel: "canonical", href: `${PERSONAL_INFO.siteUrl}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: PERSONAL_INFO.name,
          jobTitle: PERSONAL_INFO.role,
          email: `mailto:${PERSONAL_INFO.email}`,
          address: PERSONAL_INFO.location,
          sameAs: [PERSONAL_INFO.github, PERSONAL_INFO.leetcode, PERSONAL_INFO.linkedin],
          knowsAbout: ["Java", "Data Structures and Algorithms", "React", "Node.js", "MongoDB"],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen w-full bg-background overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="pt-16">
        <Hero />
        <Highlights />
        <About />
        <Skills />
        <Projects />
        <DSA />
        <Journey />
        <Profiles />
        <Certifications />
        <ResumeCTA />
        <Contact />
      </main>
      <Footer />
      <GopalAIAssistant />
    </div>
  );
}
