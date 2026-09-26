import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/portfolio/About";
import { AcademicGallery } from "@/components/portfolio/AcademicGallery";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { DSA } from "@/components/portfolio/DSA";
import { FAQ } from "@/components/portfolio/FAQ";
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
import { CERTIFICATIONS, DSA_INFO, PERSONAL_INFO, PROJECTS } from "@/data/profile";
import { generateSeoSchema } from "@/lib/seo-schema";

const TITLE = `${PERSONAL_INFO.name} | ${PERSONAL_INFO.role}`;
const DESCRIPTION = PERSONAL_INFO.siteDescription;

const schemaData = generateSeoSchema(PERSONAL_INFO, PROJECTS, CERTIFICATIONS, DSA_INFO);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "Gopal Maddheshiya, Gopal Maddheshiya SRMU, Java Developer, Full-Stack Developer, MERN Stack, React Developer, Node.js, LeetCode, DSA, Shri Ramswaroop Memorial University, SIH 2026, KisanSarthi, Software Engineering Intern, Web Development",
      },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${PERSONAL_INFO.siteUrl}/` },
      { property: "og:image", content: PERSONAL_INFO.ogImage },
      { property: "og:image:secure_url", content: PERSONAL_INFO.ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: `${PERSONAL_INFO.name} — ${PERSONAL_INFO.role} Portfolio`,
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: PERSONAL_INFO.ogImage },
    ],
    links: [
      { rel: "canonical", href: `${PERSONAL_INFO.siteUrl}/` },
      {
        rel: "alternate",
        type: "text/plain",
        href: "/llms.txt",
        title: "LLM Context",
      },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(schemaData),
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
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lift focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
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
          <FAQ />
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
