import { FAQS } from "@/data/faq";
import { PERSONAL_INFO, type Certification, type PersonalInfo, type Project } from "@/data/profile";
import type { PortfolioData } from "@/lib/supabase";

/** Extracts a raw token even if the user pastes the full GSC `<meta name="google-site-verification" content="..." />` tag. */
export function extractGoogleVerificationToken(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const match = trimmed.match(/content=["']([^"']+)["']/i);
  return (match?.[1] ?? trimmed).trim();
}

/** Single source of truth for canonical profile URLs used across JSON-LD `sameAs` and `<link rel="me">`. */
export function collectSameAsProfiles(
  info: PersonalInfo,
  portfolioData?: Partial<PortfolioData> | null,
): string[] {
  const dynamicCodingUrls =
    portfolioData?.codingProfiles
      ?.filter((p) => !p.hidden)
      .map((p) => p.url)
      .filter((url): url is string => Boolean(url && url.trim().startsWith("http"))) || [];

  const candidates = [
    info.github,
    info.linkedin,
    info.leetcode,
    info.medium ?? PERSONAL_INFO.medium,
    info.substack ?? PERSONAL_INFO.substack,
    info.reddit ?? PERSONAL_INFO.reddit,
    info.facebook ?? PERSONAL_INFO.facebook,
    info.instagram ?? PERSONAL_INFO.instagram,
    ...dynamicCodingUrls,
    "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
    "https://www.codechef.com/users/gopal_code_96",
    "https://www.hackerrank.com/profile/gopalmaddheshiy1",
  ]
    .map((u) => (typeof u === "string" ? u.trim() : ""))
    .filter((u) => u.startsWith("http"));

  return Array.from(new Set(candidates));
}

export function generateSeoSchema(
  info: PersonalInfo,
  projects: Project[] = [],
  certifications: Certification[] = [],
  portfolioData?: Partial<PortfolioData> | null,
) {
  const baseUrl = (info.siteUrl || "https://gopal-maddheshiya.vercel.app").replace(/\/$/, "");
  const personId = `${baseUrl}/#person`;
  const websiteId = `${baseUrl}/#website`;
  const profilePageId = `${baseUrl}/#profilepage`;

  const sameAsProfiles = collectSameAsProfiles(info, portfolioData);

  const dynamicSkills = portfolioData?.skillGroups?.flatMap((g) => g.skills) || [];
  const skillsList = Array.from(
    new Set([
      "Java",
      "Data Structures and Algorithms",
      "Object-Oriented Programming (OOP)",
      ...dynamicSkills,
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Mongoose ODM",
      "TypeScript",
      "JavaScript ES6+",
      "Tailwind CSS v4",
      "Supabase",
      "PostgreSQL",
      "RESTful API Development",
      "JWT Authentication",
      "Git & GitHub",
      "Vercel",
      "Render",
      "Full-Stack Web Development",
      "Software Engineering",
    ]),
  );

  const dynamicEducation = portfolioData?.education || [];
  const alumniList =
    dynamicEducation.length > 0
      ? dynamicEducation.map((edu) => ({
          "@type": "EducationalOrganization" as const,
          name: edu.org,
        }))
      : [
          {
            "@type": "EducationalOrganization" as const,
            name: "Shri Ramswaroop Memorial University (SRMU)",
            url: "https://srmu.ac.in",
          },
        ];

  const projectItemList = projects.map((proj, idx) => ({
    "@type": "SoftwareSourceCode",
    position: idx + 1,
    name: proj.title,
    description: proj.summary,
    codeRepository: proj.githubUrl,
    url: proj.liveUrl || proj.githubUrl,
    programmingLanguage: proj.technologies.slice(0, 5),
    runtimePlatform: "Web Browser",
    creator: {
      "@id": personId,
    },
  }));

  const activeFaqs =
    portfolioData?.faqs && portfolioData.faqs.length > 0 ? portfolioData.faqs : FAQS;

  const faqEntities = activeFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer.replace(/\n/g, "<br/>"),
    },
  }));

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: info.name,
        alternateName: [
          "Gopal",
          "Gopal Maddhesia",
          "Gopal Kumar Maddheshiya",
          "gopal-maddheshiya",
          "gopalmaddheshiya63",
          "gopal_96",
          "@gopal-maddheshiya",
          "@gopalmaddheshiya",
        ],
        jobTitle: info.role,
        description: info.siteDescription,
        url: baseUrl,
        image: info.ogImage,
        email: `mailto:${info.email}`,
        telephone: info.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Maharajganj",
          addressRegion: "Uttar Pradesh",
          addressCountry: "IN",
        },
        sameAs: sameAsProfiles,
        alumniOf: alumniList,
        knowsAbout: skillsList,
        knowsLanguage: ["en", "hi"],
        hasOccupation: {
          "@type": "Occupation",
          name: "Software Engineer / Full-Stack Developer",
          occupationLocation: {
            "@type": "AdministrativeArea",
            name: "India",
          },
          skills: skillsList.slice(0, 10).join(", "),
        },
        award: [
          "Smart India Hackathon (SIH 2026) Participant — KisanSarthi",
          "SRMU VIVEKA 5.0 Find The Language Programming Contest Winner",
        ],
        hasCredential: certifications.map((c) => ({
          "@type": "EducationalOccupationalCredential",
          name: c.title,
          recognizedBy: {
            "@type": "Organization",
            name: c.org,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: `${info.name} — Portfolio & Knowledge Base`,
        description: info.siteDescription,
        publisher: {
          "@id": personId,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: `${baseUrl}/`,
        name: `${info.name} | ${info.role}`,
        description: info.siteDescription,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": personId,
        },
        mainEntity: {
          "@id": personId,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: info.ogImage,
          caption: `${info.name} - Software Engineer & Full-Stack Developer`,
        },
      },
      {
        "@type": "ItemList",
        name: `${info.name}'s Featured Software Projects`,
        description:
          "Collection of production-grade full-stack web applications, AI systems, and developer tools created by Gopal Maddheshiya.",
        numberOfItems: projectItemList.length,
        itemListElement: projectItemList,
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        name: `Frequently Asked Questions About ${info.name}`,
        description: `Direct answers to common questions about Gopal Maddheshiya's background, full-stack skillset, projects, LeetCode DSA practice, and internship availability.`,
        mainEntity: faqEntities,
      },
    ],
  };

  return schemaGraph;
}
