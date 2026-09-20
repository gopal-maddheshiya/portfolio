import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/portfolio/About";
import { AcademicGallery } from "@/components/portfolio/AcademicGallery";
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
import { BackToTop } from "@/components/portfolio/BackToTop";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SmoothScrollProvider } from "@/components/common/SmoothScroll";
import { PERSONAL_INFO } from "@/data/profile";

const TITLE = "Gopal Maddheshiya | B.Tech CSE Student | Full-Stack (MERN) Developer";
const DESCRIPTION =
  "Portfolio of Gopal Maddheshiya, a CSE student building full-stack apps with React, Node.js and MongoDB, and practicing DSA in Java.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${PERSONAL_INFO.siteUrl}/` },
      { property: "og:image", content: PERSONAL_INFO.ogImage },
      { property: "og:image:secure_url", content: PERSONAL_INFO.ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Gopal Maddheshiya — Full-Stack (MERN) Developer Portfolio",
      },
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
    <SmoothScrollProvider>
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
          <AcademicGallery />
          <ResumeCTA />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <ErrorBoundary name="AI Assistant">
          <GopalAIAssistant />
        </ErrorBoundary>
      </div>
    </SmoothScrollProvider>
  );
}
