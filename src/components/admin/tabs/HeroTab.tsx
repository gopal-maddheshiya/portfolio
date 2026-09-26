import React from "react";
import { User, Globe } from "lucide-react";
import type { PortfolioData } from "@/lib/supabase";
import { TagListInput } from "@/components/admin/ui/TagListInput";
import { ImageUploader } from "@/components/admin/ui/ImageUploader";
import { FileUploader } from "@/components/admin/ui/FileUploader";

interface HeroTabProps {
  data: PortfolioData;
  updateData: (updater: Partial<PortfolioData> | ((prev: PortfolioData) => PortfolioData)) => void;
}

export function HeroTab({ data, updateData }: HeroTabProps) {
  const info = data.personalInfo;
  const hero = data.heroData;

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. Hero Identity & Headline */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <User className="size-5 text-primary" />
            <span>Hero Headline, Typewriter &amp; Greeting</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure primary identity, headline badges, rotating typewriter roles, and contact
            info.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => updateData({ personalInfo: { ...info, name: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Primary Role / Title
            </label>
            <input
              type="text"
              value={info.role}
              onChange={(e) => updateData({ personalInfo: { ...info, role: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Greeting Pill Badge
            </label>
            <input
              type="text"
              placeholder="Hi, I'm Gopal Maddheshiya"
              value={hero.greetingBadge || ""}
              onChange={(e) => updateData({ heroData: { ...hero, greetingBadge: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Headline Prefix
            </label>
            <input
              type="text"
              placeholder="Building software as a"
              value={hero.headlinePrefix || ""}
              onChange={(e) =>
                updateData({ heroData: { ...hero, headlinePrefix: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Typewriter Rotating Roles managed via TagListInput */}
          <div className="sm:col-span-2">
            <TagListInput
              label="Typewriter Rotating Roles"
              tags={hero.typewriterRoles || []}
              onChange={(newRoles) =>
                updateData({ heroData: { ...hero, typewriterRoles: newRoles } })
              }
              placeholder="Type role title (e.g. Java & DSA Developer) and press Enter or comma..."
              helpText="These roles rotate dynamically in the Hero headline with glowing cursor typewriter effects."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={info.subtitle}
              onChange={(e) => updateData({ personalInfo: { ...info, subtitle: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Bio / Site Description
            </label>
            <textarea
              rows={3}
              value={info.siteDescription}
              onChange={(e) =>
                updateData({ personalInfo: { ...info, siteDescription: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs min-h-[85px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Top-Left Floating Chip
            </label>
            <input
              type="text"
              placeholder="Java • DSA"
              value={hero.floatingBadge1 || ""}
              onChange={(e) =>
                updateData({ heroData: { ...hero, floatingBadge1: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Bottom-Right Floating Chip
            </label>
            <input
              type="text"
              placeholder="Full-Stack"
              value={hero.floatingBadge2 || ""}
              onChange={(e) =>
                updateData({ heroData: { ...hero, floatingBadge2: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Status Badge Text
            </label>
            <input
              type="text"
              placeholder="Online"
              value={hero.availabilityStatus || ""}
              onChange={(e) =>
                updateData({ heroData: { ...hero, availabilityStatus: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={info.location}
              onChange={(e) => updateData({ personalInfo: { ...info, location: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => updateData({ personalInfo: { ...info, email: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => updateData({ personalInfo: { ...info, phone: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              WhatsApp (Digits with Country Code)
            </label>
            <input
              type="text"
              placeholder="916388354988"
              value={info.whatsapp || ""}
              onChange={(e) => updateData({ personalInfo: { ...info, whatsapp: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Profile Photo Upload */}
      <ImageUploader
        label="Hero Profile Photo (Homepage Hanging ID Avatar)"
        value={info.profilePhoto || ""}
        onChange={(url) => updateData({ personalInfo: { ...info, profilePhoto: url } })}
        folder="profile"
        aspectRatio="portrait"
        aspectRatioLabel="Recommended: 4:5 Portrait or 1:1 Square (800 × 1000 px)"
        helpText="Upload a crisp portrait photo where your face and shoulders are well-centered. Automatically updates the hanging ID physics card on the homepage."
      />

      {/* 3. Universal Single Source Resume PDF */}
      <FileUploader
        label="Resume PDF Document (Universal Single Source)"
        value={info.resume || ""}
        onChange={(url) => updateData({ personalInfo: { ...info, resume: url } })}
        folder="resumes"
        formatBadge="PDF Document"
        helpText="Universal Single Source of Truth: When you upload your resume PDF here, it automatically syncs across the Hero button, Navbar button, Mobile Menu, and Resume CTA Banner."
      />

      {/* 4. Social & Coding Profile Links */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-soft space-y-4">
        <div className="border-b border-border pb-3">
          <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            <span>Social &amp; Coding Profile Links</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Primary social and code repository links used in Hero, Footer, and Contact sections.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              GitHub URL
            </label>
            <input
              type="text"
              value={info.github}
              onChange={(e) => updateData({ personalInfo: { ...info, github: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              GitHub Username
            </label>
            <input
              type="text"
              value={info.githubUsername || ""}
              onChange={(e) =>
                updateData({ personalInfo: { ...info, githubUsername: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              LinkedIn URL
            </label>
            <input
              type="text"
              value={info.linkedin}
              onChange={(e) => updateData({ personalInfo: { ...info, linkedin: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              LeetCode Profile URL
            </label>
            <input
              type="text"
              value={info.leetcode}
              onChange={(e) => updateData({ personalInfo: { ...info, leetcode: e.target.value } })}
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              LeetCode Username Handle
            </label>
            <input
              type="text"
              value={info.leetcodeUsername || ""}
              onChange={(e) =>
                updateData({ personalInfo: { ...info, leetcodeUsername: e.target.value } })
              }
              className="w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
