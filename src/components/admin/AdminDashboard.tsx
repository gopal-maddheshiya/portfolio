import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  User,
  BookOpen,
  Briefcase,
  Layers,
  Code2,
  Award,
  Sparkles,
  Mail,
  Camera,
  Settings,
  Menu,
  X,
  ChevronRight,
  Search,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

// Tabs
import { HeroTab } from "@/components/admin/tabs/HeroTab";
import { AboutTab } from "@/components/admin/tabs/AboutTab";
import { ProjectsTab } from "@/components/admin/tabs/ProjectsTab";
import { SkillsTab } from "@/components/admin/tabs/SkillsTab";
import { DsaTab } from "@/components/admin/tabs/DsaTab";
import { CertificationsTab } from "@/components/admin/tabs/CertificationsTab";
import { GalleryTab } from "@/components/admin/tabs/GalleryTab";
import { JourneyTab } from "@/components/admin/tabs/JourneyTab";
import { ContactTab } from "@/components/admin/tabs/ContactTab";
import { SettingsTab } from "@/components/admin/tabs/SettingsTab";

interface AdminDashboardProps {
  onSignOut: () => void;
  userEmail: string;
}

export type TabType =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "dsa"
  | "certifications"
  | "gallery"
  | "journey"
  | "contact"
  | "settings";

interface NavGroup {
  groupTitle: string;
  items: Array<{
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    description: string;
  }>;
}

export function AdminDashboard({ onSignOut, userEmail }: AdminDashboardProps) {
  const { data, updateData, saveData, resetToDefaults, isSaving } = usePortfolio();
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Global Ctrl+S / Cmd+S Save Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveData]);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navGroups: NavGroup[] = [
    {
      groupTitle: "Profile & Identity",
      items: [
        {
          id: "hero",
          label: "Hero & Profile",
          icon: User,
          description: "Hero headline, typewriter roles, photo & links",
        },
        {
          id: "about",
          label: "About & Education",
          icon: BookOpen,
          description: "Bio story, snapshot stats & university timeline",
        },
      ],
    },
    {
      groupTitle: "Portfolio Content",
      items: [
        {
          id: "projects",
          label: "Projects Manager",
          icon: Briefcase,
          count: data.projects?.length,
          description: "Projects, tech stacks, live links & screenshots",
        },
        {
          id: "skills",
          label: "Skills & Tech Stack",
          icon: Layers,
          count: data.skillGroups?.length,
          description: "Categorized skill chips and primary highlights",
        },
        {
          id: "dsa",
          label: "DSA & Coding Profiles",
          icon: Code2,
          description: "Problem metrics, difficulty, topics & handles",
        },
      ],
    },
    {
      groupTitle: "Credentials & Media",
      items: [
        {
          id: "certifications",
          label: "Certifications",
          icon: Award,
          count: data.certifications?.length,
          description: "Verified certificates, contest wins & PDF files",
        },
        {
          id: "gallery",
          label: "Academic Gallery",
          icon: Camera,
          count: (data.academicGallery || []).length,
          description: "Hackathon photos, demo videos & context notes",
        },
        {
          id: "journey",
          label: "Highlights & Journey",
          icon: Sparkles,
          description: "Top badges below hero & learning milestones",
        },
      ],
    },
    {
      groupTitle: "Configuration & SEO",
      items: [
        {
          id: "contact",
          label: "Contact & Resume CTA",
          icon: Mail,
          description: "Contact section details & resume banner",
        },
        {
          id: "settings",
          label: "SEO & Backups",
          icon: Settings,
          description: "Meta tags, 1-click JSON backup & restore",
        },
      ],
    },
  ];

  // Filter navigation items by live search
  const filteredNavGroups = navGroups
    .map((group) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return group;
      const filteredItems = group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          group.groupTitle.toLowerCase().includes(q),
      );
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  const currentTabGroup =
    navGroups.find((g) => g.items.some((item) => item.id === activeTab)) || navGroups[0];

  const currentTabItem =
    navGroups.flatMap((g) => g.items).find((item) => item.id === activeTab) ||
    navGroups[0].items[0];

  const CurrentTabIcon = currentTabItem.icon;

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* ─── 1. FIXED LEFT SIDEBAR (DESKTOP) ─── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 border-r border-border/80 bg-card/95 backdrop-blur-xl h-screen fixed inset-y-0 left-0 z-40 select-none shadow-xs">
        {/* Brand / Studio Header */}
        <div className="p-4 lg:p-5 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-gradient-to-br from-primary via-primary/95 to-amber-600 text-white flex items-center justify-center font-display font-black text-base shadow-md shadow-primary/25 ring-1 ring-white/20 shrink-0">
              G
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-bold text-sm tracking-tight text-foreground truncate">
                  Portfolio Studio
                </h1>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 shrink-0">
                  PRO
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                  Cloud Live Sync
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Filter / Search Input */}
        <div className="px-3.5 pt-3 pb-1">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-border/70 bg-surface/60 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear filter"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* User Badge */}
        <div className="mx-3.5 my-2 p-2 rounded-xl bg-surface/60 border border-border/60 flex items-center justify-between text-xs backdrop-blur-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-[11px] shrink-0 border border-primary/25">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
            </div>
            <span
              className="text-muted-foreground truncate font-mono text-[11px]"
              title={userEmail}
            >
              {userEmail}
            </span>
          </div>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20 shrink-0">
            Admin
          </span>
        </div>

        {/* Navigation List (Scrollable, Independent from page) */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-2 space-y-4 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/60 hover:[&::-webkit-scrollbar-thumb]:bg-border">
          {filteredNavGroups.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No section matching &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredNavGroups.map((group) => (
              <div key={group.groupTitle} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75 mb-1.5">
                  {group.groupTitle}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150 cursor-pointer text-left ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/20 ring-1 ring-primary/40"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/70 hover:translate-x-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`size-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.count !== undefined ? (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0 transition-colors ${
                              isActive
                                ? "bg-white/25 text-white"
                                : "bg-secondary text-muted-foreground border border-border/50 group-hover:border-border"
                            }`}
                          >
                            {item.count}
                          </span>
                        ) : isActive ? (
                          <ChevronRight className="size-3.5 opacity-70 shrink-0" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3.5 border-t border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="size-3.5 text-primary" />
              <span>Preview Live Site</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">↗</span>
          </a>

          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ─── 2. MOBILE DRAWER OVERLAY ─── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-xs bg-card border-r border-border h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  G
                </div>
                <div>
                  <span className="font-display font-bold text-sm block">Portfolio Studio</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Cloud Live Sync
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Mobile Filter Input */}
            <div className="p-3 border-b border-border/50">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-border/70 bg-surface/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-4">
              {filteredNavGroups.map((group) => (
                <div key={group.groupTitle} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {group.groupTitle}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.count !== undefined && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-secondary text-muted-foreground">
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-3 border-t border-border space-y-1">
              <button
                type="button"
                onClick={onSignOut}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. MAIN WORKSPACE AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen md:pl-64 lg:pl-72">
        {/* Sticky Workspace Top Header */}
        <header className="sticky top-0 z-30 border-b border-border/70 bg-card/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 shadow-2xs">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Mobile hamburger + Active Section Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg border border-border bg-card text-foreground hover:bg-secondary cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="size-4" />
              </button>

              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <CurrentTabIcon className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono truncate">
                    <span>Studio</span>
                    <span>›</span>
                    <span className="text-muted-foreground/80">{currentTabGroup.groupTitle}</span>
                  </div>
                  <h2 className="font-display font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
                    {currentTabItem.label}
                  </h2>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Preview portfolio live"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-card hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
              >
                <ExternalLink className="size-3.5 text-primary" />
                <span>Preview</span>
              </a>

              <button
                type="button"
                onClick={() => resetToDefaults()}
                title="Reset to local profile defaults"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={() => saveData()}
                disabled={isSaving}
                title="Save live changes (Shortcut: Ctrl+S)"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/95 hover:from-primary/95 hover:to-primary px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Save className="size-3.5" />
                )}
                <span>{isSaving ? "Saving..." : "Save Live"}</span>
                <kbd className="hidden lg:inline-flex items-center ml-0.5 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono font-medium text-primary-foreground/90 border border-white/15">
                  Ctrl+S
                </kbd>
              </button>
            </div>
          </div>
        </header>

        {/* Tab Forms Body Container */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-16">
          {activeTab === "hero" && <HeroTab data={data} updateData={updateData} />}
          {activeTab === "about" && <AboutTab data={data} updateData={updateData} />}
          {activeTab === "projects" && <ProjectsTab data={data} updateData={updateData} />}
          {activeTab === "skills" && <SkillsTab data={data} updateData={updateData} />}
          {activeTab === "dsa" && <DsaTab data={data} updateData={updateData} />}
          {activeTab === "certifications" && (
            <CertificationsTab data={data} updateData={updateData} />
          )}
          {activeTab === "gallery" && <GalleryTab data={data} updateData={updateData} />}
          {activeTab === "journey" && <JourneyTab data={data} updateData={updateData} />}
          {activeTab === "contact" && <ContactTab data={data} updateData={updateData} />}
          {activeTab === "settings" && (
            <SettingsTab
              data={data}
              updateData={updateData}
              resetToDefaults={resetToDefaults}
              saveData={saveData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
