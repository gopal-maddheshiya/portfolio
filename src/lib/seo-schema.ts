import { FAQS } from "@/data/faq";
import { type Certification, type DsaInfo, type PersonalInfo, type Project } from "@/data/profile";

export function generateSeoSchema(
  info: PersonalInfo,
  projects: Project[] = [],
  certifications: Certification[] = [],
  dsaInfo?: DsaInfo,
) {
  const baseUrl = info.siteUrl.replace(/\/$/, "");
  const personId = `${baseUrl}/#person`;
  const websiteId = `${baseUrl}/#website`;
  const profilePageId = `${baseUrl}/#profilepage`;

  const sameAsProfiles = [
    info.github,
    info.linkedin,
    info.leetcode,
    "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
    "https://www.codechef.com/users/gopal_code_96",
    "https://www.hackerrank.com/profile/gopalmaddheshiy1",
  ].filter(Boolean);

  const skillsList = [
    "Java",
    "Data Structures and Algorithms",
    "Object-Oriented Programming (OOP)",
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

  const faqEntities = FAQS.map((faq) => ({
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
        alternateName: ["Gopal", "Gopal Maddhesia", "Gopal Kumar Maddheshiya"],
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
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Shri Ramswaroop Memorial University (SRMU)",
          url: "https://srmu.ac.in",
        },
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
