"use client";

import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type View = "home" | "projects" | "adminLogin" | "admin";

type Project = {
  id: string;
  title: string;
  tag: string;
  category: string;
  description: string;
  homeSlot: 1 | 2 | 3 | null;
  photos: string[];
};

type SiteContent = {
  companyName: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  phone: string;
  email: string;
  basePrice: string;
  priceTitle: string;
  priceText: string;
  priceBackground: string;
  backgroundColor: string;
  panelColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  labelTextColor: string;
  titleTextColor: string;
  projectTitleColor: string;
  projectDescriptionColor: string;
  headerTextColor: string;
  projectsIntro: string;
  footerText: string;
  logoUrl: string;
  categories: string[];
  projects: Project[];
};

const STORAGE_KEY = "stutzmans-construction-site-v8";
const OLD_STORAGE_KEYS = ["stutzmans-construction-site-v7", "stutzmans-construction-site-v6", "stutzmans-construction-site-v5"];
const OWNER_PIN = "3026";

const temporaryPhotos = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85",
];

const defaultCategories = ["Homes", "Additions", "Remodels", "Garages & Shops"];

const defaultContent: SiteContent = {
  companyName: "Stutzman's Construction",
  eyebrow: "CUSTOM HOMES • REMODELS • GARAGES",
  heroTitle: "Built strong. Finished clean. Made to stand out.",
  heroBody:
    "Stutzman's Construction builds custom homes, remodels, garages, shops, additions, roofing, siding, and detailed finish work with a clean, premium look from first walkthrough to final detail.",
  phone: "406-607-7888",
  email: "stutzmansconstruction@gmail.com",
  basePrice: "$275 / sq ft",
  priceTitle: "Custom home pricing",
  priceText:
    "Full finished custom homes can start around $275 per square foot. Remodels, garages, shops, additions, and other work may be lower or higher depending on scope, finishes, materials, site conditions, and project details.",
  priceBackground: temporaryPhotos[1],
  backgroundColor: "#050303",
  panelColor: "rgba(255,255,255,.07)",
  accentColor: "#9f1239",
  textColor: "#ffffff",
  mutedTextColor: "#b8b0b0",
  labelTextColor: "#fecdd3",
  titleTextColor: "#ffffff",
  projectTitleColor: "#ffffff",
  projectDescriptionColor: "#d6d0d0",
  headerTextColor: "#ffffff",
  projectsIntro:
    "Browse homes, remodels, garages, shops, additions, exterior work, and finish details. Each project can hold multiple photos.",
  footerText: "Montana construction company • Custom homes • Remodels • Garages • Exterior finish",
  logoUrl: "/stutzmans-logo.jpeg",
  categories: defaultCategories,
  projects: [
    {
      id: "mountain-modern",
      title: "Mountain Modern Custom Home",
      tag: "Finished Home",
      category: "Homes",
      description:
        "A clean modern home concept with warm exterior materials, sharp roof lines, oversized glass, and a premium finished feel.",
      homeSlot: 1,
      photos: [temporaryPhotos[0], temporaryPhotos[1], temporaryPhotos[2]],
    },
    {
      id: "garage-addition",
      title: "Garage & Exterior Addition",
      tag: "Garage Build",
      category: "Garages & Shops",
      description:
        "A practical garage and exterior upgrade designed for storage, clean curb appeal, and long-term durability.",
      homeSlot: 2,
      photos: [temporaryPhotos[3], temporaryPhotos[4], temporaryPhotos[5]],
    },
    {
      id: "interior-remodel",
      title: "Premium Remodel Concept",
      tag: "Remodel",
      category: "Remodels",
      description:
        "Interior and exterior remodeling focused on clean finish work, better layouts, and a higher-end final look.",
      homeSlot: 3,
      photos: [temporaryPhotos[2], temporaryPhotos[5], temporaryPhotos[1]],
    },
  ],
};

function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

function nicePhone(phone: string) {
  const digits = normalizePhone(phone);
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function migrateContent(raw: unknown): SiteContent {
  const parsed = (raw || {}) as Partial<SiteContent> & { projects?: Array<Partial<Project> & { featured?: boolean }> };
  const categories = parsed.categories?.length ? parsed.categories : defaultCategories;
  const projects = parsed.projects?.length
    ? parsed.projects.map((project, index) => ({
        id: project.id || `project-${index + 1}`,
        title: project.title || "Untitled Project",
        tag: project.tag || "Project",
        category: project.category || categories[index % categories.length] || "Homes",
        description: project.description || "Add a short description for this project.",
        homeSlot:
          project.homeSlot === 1 || project.homeSlot === 2 || project.homeSlot === 3
            ? project.homeSlot
            : project.featured && index < 3
              ? ((index + 1) as 1 | 2 | 3)
              : null,
        photos: project.photos?.length ? project.photos : [temporaryPhotos[index % temporaryPhotos.length]],
      }))
    : defaultContent.projects;

  return {
    ...defaultContent,
    ...parsed,
    categories,
    projects,
    labelTextColor: parsed.labelTextColor || defaultContent.labelTextColor,
    titleTextColor: parsed.titleTextColor || defaultContent.titleTextColor,
    projectTitleColor: parsed.projectTitleColor || defaultContent.projectTitleColor,
    projectDescriptionColor: parsed.projectDescriptionColor || defaultContent.projectDescriptionColor,
    headerTextColor: parsed.headerTextColor || defaultContent.headerTextColor,
  };
}

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [view, setView] = useState<View>("home");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activePhotos, setActivePhotos] = useState<Record<string, number>>({});
  const [savedNotice, setSavedNotice] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [newCategory, setNewCategory] = useState("");
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const key of OLD_STORAGE_KEYS) {
          raw = localStorage.getItem(key);
          if (raw) break;
        }
      }
      if (raw) setContent(migrateContent(JSON.parse(raw)));
    } catch {
      setContent(defaultContent);
    }
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [view]);

  const themeStyle = useMemo(
    () =>
      ({
        "--bg": content.backgroundColor,
        "--panel": content.panelColor,
        "--accent": content.accentColor,
        "--text": content.textColor,
        "--muted": content.mutedTextColor,
        "--label": content.labelTextColor,
        "--title": content.titleTextColor,
        "--project-title": content.projectTitleColor,
        "--project-description": content.projectDescriptionColor,
        "--header-text": content.headerTextColor,
      }) as CSSProperties,
    [content],
  );

  const homeProjects = [1, 2, 3]
    .map((slot) => content.projects.find((project) => project.homeSlot === slot))
    .filter(Boolean) as Project[];

  const projectPageProjects = projectFilter === "All" ? content.projects : content.projects.filter((project) => project.category === projectFilter);

  function save(next = content) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedNotice("Saved on this device.");
    window.setTimeout(() => setSavedNotice(""), 1700);
  }

  function updateContent(patch: Partial<SiteContent>) {
    setContent((prev) => ({ ...prev, ...patch }));
  }

  function updateProject(id: string, patch: Partial<Project>) {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => (project.id === id ? { ...project, ...patch } : project)),
    }));
  }

  function setHomeSlot(projectId: string, slot: 1 | 2 | 3 | null) {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((project) => {
        if (slot && project.homeSlot === slot) return { ...project, homeSlot: null };
        if (project.id === projectId) return { ...project, homeSlot: slot };
        return project;
      }),
    }));
  }

  function movePhoto(projectId: string, dir: 1 | -1) {
    const project = content.projects.find((p) => p.id === projectId);
    if (!project?.photos.length) return;
    setActivePhotos((prev) => {
      const current = prev[projectId] || 0;
      const next = (current + dir + project.photos.length) % project.photos.length;
      return { ...prev, [projectId]: next };
    });
  }

  function addProject() {
    const id = `project-${Date.now()}`;
    setContent((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id,
          title: "",
          tag: "",
          category: prev.categories[0] || "Homes",
          description: "",
          homeSlot: null,
          photos: [],
        },
      ],
    }));
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }

  function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    setContent((prev) => ({ ...prev, projects: prev.projects.filter((project) => project.id !== id) }));
  }

  function addCategory() {
    const clean = newCategory.trim();
    if (!clean || content.categories.includes(clean)) return;
    updateContent({ categories: [...content.categories, clean] });
    setNewCategory("");
  }

  function deleteCategory(category: string) {
    if (content.categories.length <= 1) return;
    const nextCategories = content.categories.filter((item) => item !== category);
    setContent((prev) => ({
      ...prev,
      categories: nextCategories,
      projects: prev.projects.map((project) => (project.category === category ? { ...project, category: nextCategories[0] || "Homes" } : project)),
    }));
    if (projectFilter === category) setProjectFilter("All");
  }

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    updateContent({ logoUrl: url });
  }

  async function uploadPriceBackground(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    updateContent({ priceBackground: url });
  }

  async function uploadProjectPhotos(projectId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const urls = await Promise.all(files.map(fileToDataUrl));
    const project = content.projects.find((p) => p.id === projectId);
    updateProject(projectId, { photos: [...(project?.photos || []), ...urls] });
  }

  function openAdmin() {
    setView("adminLogin");
    setPin("");
    setPinError("");
  }

  function submitPin() {
    if (pin.trim() === OWNER_PIN) {
      setPinError("");
      setView("admin");
      return;
    }
    setPinError("Wrong PIN.");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]" style={themeStyle}>
      <div ref={topRef} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_14%_8%,rgba(159,18,57,.22),transparent_32%),radial-gradient(circle_at_90%_18%,rgba(255,255,255,.07),transparent_27%),linear-gradient(180deg,rgba(255,255,255,.025),transparent_28%)]" />
      <div className="relative z-10 pb-28 md:pb-0">
        <Header content={content} view={view} setView={setView} />

        {view === "home" && (
          <>
            <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-8 md:grid-cols-[1.03fr_.97fr] md:px-7 md:pt-14">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-[10px] font-black uppercase tracking-[.28em] text-[var(--label)] shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  {content.eyebrow}
                </div>
                <h1 className="max-w-3xl text-[clamp(2.8rem,8vw,6.7rem)] font-black leading-[.9] tracking-[-.07em] text-[var(--title)] drop-shadow-2xl">
                  {content.heroTitle}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl md:leading-9">
                  {content.heroBody}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={`tel:${normalizePhone(content.phone)}`} className="rounded-2xl bg-[var(--accent)] px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-rose-950/35 transition active:scale-[.98]">
                    Call now
                  </a>
                  <button onClick={() => setView("projects")} className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-black/35 backdrop-blur-xl transition active:scale-[.98]">
                    View projects
                  </button>
                </div>
              </div>

              <div className="relative">
                {homeProjects[0] && <ProjectCard project={homeProjects[0]} activePhotos={activePhotos} movePhoto={movePhoto} large />}
              </div>
            </section>

            <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 md:grid-cols-3 md:px-7">
              {["Custom homes", "Remodels", "Garages & shops"].map((label) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/25 backdrop-blur-xl">
                  <div className="text-base font-black text-[var(--title)]">{label}</div>
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[.2em] text-[var(--muted)]">Premium finish</div>
                </div>
              ))}
            </section>

            <section className="mx-auto max-w-6xl px-5 py-10 md:px-7">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-2xl shadow-black/45 backdrop-blur-xl md:grid md:grid-cols-[.84fr_1.16fr]">
                <div className="min-h-[260px] bg-cover bg-center md:min-h-[340px]" style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.12)),url(${content.priceBackground})` }} />
                <div className="p-6 md:p-8">
                  <div className="text-[11px] font-black uppercase tracking-[.32em] text-[var(--label)]">Base guide</div>
                  <h2 className="mt-4 text-[clamp(2.4rem,6vw,4.8rem)] font-black tracking-[-.06em] text-[var(--title)]">{content.basePrice}</h2>
                  <h3 className="mt-4 text-xl font-black text-[var(--title)] md:text-2xl">{content.priceTitle}</h3>
                  <p className="mt-3 text-base leading-8 text-[var(--muted)] md:text-lg">{content.priceText}</p>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-6xl px-5 py-10 md:px-7">
              <div className="text-[11px] font-black uppercase tracking-[.35em] text-[var(--label)]">Featured projects</div>
              <h2 className="mt-4 text-[clamp(2.4rem,7vw,5.6rem)] font-black tracking-[-.07em] text-[var(--title)]">Built to show the finish.</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {homeProjects.slice(1, 3).map((project) => (
                  <ProjectCard key={project.id} project={project} activePhotos={activePhotos} movePhoto={movePhoto} />
                ))}
              </div>
            </section>
          </>
        )}

        {view === "projects" && (
          <ProjectsSection
            title="All projects"
            intro={content.projectsIntro}
            projects={projectPageProjects}
            categories={content.categories}
            activeFilter={projectFilter}
            setFilter={setProjectFilter}
            activePhotos={activePhotos}
            movePhoto={movePhoto}
            fullPage
          />
        )}

        {view === "adminLogin" && (
          <section className="mx-auto flex min-h-[70vh] max-w-lg items-center px-5 py-16">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/8 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="text-xs font-black uppercase tracking-[.3em] text-[var(--label)]">Owner portal</div>
              <h1 className="mt-4 text-4xl font-black tracking-[-.04em] text-[var(--title)]">Sign in</h1>
              <p className="mt-3 text-[var(--muted)]">Enter the owner PIN to edit website content, photos, prices, colors, and projects.</p>
              <input value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitPin()} type="password" className="mt-6 w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-xl font-black text-white outline-none ring-rose-600/40 focus:ring-4" placeholder="Owner PIN" />
              {pinError && <div className="mt-3 text-sm font-black text-red-300">{pinError}</div>}
              <button onClick={submitPin} className="mt-5 w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-lg font-black text-white">Open editor</button>
            </div>
          </section>
        )}

        {view === "admin" && (
          <AdminPanel
            content={content}
            updateContent={updateContent}
            updateProject={updateProject}
            setHomeSlot={setHomeSlot}
            addProject={addProject}
            deleteProject={deleteProject}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            uploadLogo={uploadLogo}
            uploadPriceBackground={uploadPriceBackground}
            uploadProjectPhotos={uploadProjectPhotos}
            save={save}
            savedNotice={savedNotice}
            setView={setView}
          />
        )}

        <Footer content={content} openAdmin={openAdmin} />
        <MobileDock view={view} setView={setView} content={content} />
      </div>
    </main>
  );
}

function Header({ content, view, setView }: { content: SiteContent; view: View; setView: (v: View) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/58 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-7 md:py-4">
        <button onClick={() => setView("home")} className="flex min-w-0 items-center gap-3 text-left md:gap-4">
          <span className="logo-clean flex h-auto w-[82px] shrink-0 items-center justify-center overflow-visible bg-transparent md:w-32">
            <img src={content.logoUrl} alt="Stutzman's Construction logo" className="h-auto max-h-[54px] w-full object-contain md:max-h-[72px]" />
          </span>
          <div className="min-w-0">
            <div className="hidden text-[10px] font-black uppercase tracking-[.28em] text-[var(--label)] sm:block md:text-[11px]">Custom homes • Remodels • Garages</div>
            <div className="line-clamp-2 max-w-[185px] text-lg font-black leading-[.98] tracking-[-.04em] text-[var(--header-text)] sm:max-w-none md:mt-1 md:text-2xl">{content.companyName}</div>
          </div>
        </button>
        <nav className="hidden rounded-full border border-white/10 bg-white/8 p-1 shadow-xl shadow-black/25 backdrop-blur-xl md:flex">
          <button onClick={() => setView("home")} className={`rounded-full px-6 py-2.5 text-base font-black ${view === "home" ? "bg-white text-black" : "text-white/75"}`}>Home</button>
          <button onClick={() => setView("projects")} className={`rounded-full px-6 py-2.5 text-base font-black ${view === "projects" ? "bg-white text-black" : "text-white/75"}`}>Projects</button>
        </nav>
        <a href={`tel:${normalizePhone(content.phone)}`} className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-xl shadow-black/25 md:inline-flex">Call {nicePhone(content.phone)}</a>
      </div>
    </header>
  );
}

function ProjectsSection({ title, intro, projects, categories, activeFilter, setFilter, activePhotos, movePhoto, fullPage }: { title: string; intro: string; projects: Project[]; categories: string[]; activeFilter: string; setFilter: (filter: string) => void; activePhotos: Record<string, number>; movePhoto: (id: string, dir: 1 | -1) => void; fullPage?: boolean }) {
  return (
    <section className={`mx-auto max-w-6xl px-5 ${fullPage ? "py-10" : "py-10"} md:px-7`}>
      <div className="sticky top-[78px] z-30 -mx-5 mb-8 border-b border-white/10 bg-black/52 px-5 py-3 backdrop-blur-2xl md:top-[90px] md:-mx-7 md:px-7">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((category) => (
            <button key={category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${activeFilter === category ? "border-white bg-white text-black" : "border-white/10 bg-white/8 text-white/75"}`}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="text-[11px] font-black uppercase tracking-[.35em] text-[var(--label)]">Project gallery</div>
      <h2 className="mt-4 text-[clamp(2.6rem,8vw,5.8rem)] font-black tracking-[-.07em] text-[var(--title)]">{title}</h2>
      <p className="mt-5 max-w-4xl text-lg leading-8 text-[var(--muted)] md:text-xl md:leading-9">{intro}</p>
      <div className="mt-8 grid gap-7 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} activePhotos={activePhotos} movePhoto={movePhoto} />
        ))}
      </div>
      {!projects.length && <div className="mt-8 rounded-3xl border border-white/10 bg-white/8 p-8 text-center font-black text-[var(--muted)]">No projects in this category yet.</div>}
    </section>
  );
}

function ProjectCard({ project, activePhotos, movePhoto, large }: { project: Project; activePhotos: Record<string, number>; movePhoto: (id: string, dir: 1 | -1) => void; large?: boolean }) {
  const index = activePhotos[project.id] || 0;
  const photo = project.photos[index] || temporaryPhotos[0];
  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/8 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className={`group relative overflow-hidden bg-black/30 ${large ? "min-h-[360px] md:min-h-[430px]" : "min-h-[280px] md:min-h-[330px]"}`}>
        <img src={photo} alt={project.title || "Project photo"} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/10" />
        {project.photos.length > 1 && (
          <>
            <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, -1); }} className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-3xl font-black text-white shadow-xl backdrop-blur-xl transition active:scale-95">‹</button>
            <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, 1); }} className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-3xl font-black text-white shadow-xl backdrop-blur-xl transition active:scale-95">›</button>
            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
              {project.photos.map((_, dotIndex) => <span key={dotIndex} className={`h-2 rounded-full transition-all ${dotIndex === index ? "w-9 bg-white" : "w-2 bg-white/45"}`} />)}
            </div>
          </>
        )}
      </div>
      <div className="p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-white/70 px-4 py-1.5 text-[10px] font-black uppercase tracking-[.22em] text-black shadow-xl backdrop-blur-xl">{project.tag || "Project"}</span>
          <span className="rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-[10px] font-black uppercase tracking-[.2em] text-[var(--label)]">{project.category}</span>
        </div>
        <h3 className="text-3xl font-black leading-none tracking-[-.05em] text-[var(--project-title)] md:text-4xl">{project.title || "Untitled project"}</h3>
        <p className="mt-3 text-base leading-7 text-[var(--project-description)] md:text-lg md:leading-8">{project.description || "Add a project description in the owner settings."}</p>
      </div>
    </article>
  );
}

function AdminPanel({ content, updateContent, updateProject, setHomeSlot, addProject, deleteProject, newCategory, setNewCategory, addCategory, deleteCategory, uploadLogo, uploadPriceBackground, uploadProjectPhotos, save, savedNotice, setView }: { content: SiteContent; updateContent: (p: Partial<SiteContent>) => void; updateProject: (id: string, p: Partial<Project>) => void; setHomeSlot: (id: string, slot: 1 | 2 | 3 | null) => void; addProject: () => void; deleteProject: (id: string) => void; newCategory: string; setNewCategory: (v: string) => void; addCategory: () => void; deleteCategory: (category: string) => void; uploadLogo: (e: ChangeEvent<HTMLInputElement>) => void; uploadPriceBackground: (e: ChangeEvent<HTMLInputElement>) => void; uploadProjectPhotos: (id: string, e: ChangeEvent<HTMLInputElement>) => void; save: () => void; savedNotice: string; setView: (v: View) => void }) {
  const homeProjects = [1, 2, 3].map((slot) => content.projects.find((project) => project.homeSlot === slot));

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 md:px-7">
      <div className="sticky top-[78px] z-30 mb-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/60 p-4 shadow-2xl shadow-black/45 backdrop-blur-2xl md:top-[92px] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[.32em] text-[var(--label)]">Owner control room</div>
          <h1 className="mt-1 text-3xl font-black tracking-[-.06em] text-[var(--title)] md:text-4xl">Website editor</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("home")} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white">Preview</button>
          <button onClick={() => save()} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white">Save changes</button>
        </div>
      </div>
      {savedNotice && <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 font-black text-emerald-200">{savedNotice}</div>}

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard title="Main site text">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Company name" value={content.companyName} onChange={(v) => updateContent({ companyName: v })} />
            <Input label="Top small text" value={content.eyebrow} onChange={(v) => updateContent({ eyebrow: v })} />
          </div>
          <Textarea label="Hero headline" value={content.heroTitle} onChange={(v) => updateContent({ heroTitle: v })} />
          <Textarea label="Hero paragraph" value={content.heroBody} onChange={(v) => updateContent({ heroBody: v })} />
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Phone" value={content.phone} onChange={(v) => updateContent({ phone: v })} />
            <Input label="Email" value={content.email} onChange={(v) => updateContent({ email: v })} />
          </div>
          <Textarea label="Footer text" value={content.footerText} onChange={(v) => updateContent({ footerText: v })} />
        </AdminCard>

        <AdminCard title="Logo and images">
          <UploadButton label="Upload logo" helper="Logo preview has no forced box/background." onChange={uploadLogo} />
          <div className="rounded-2xl border border-white/10 bg-transparent p-4">
            <img src={content.logoUrl} alt="Logo preview" className="logo-clean mx-auto h-28 w-full object-contain" />
          </div>
          <UploadButton label="Change price photo" helper="Current price photo is shown below." onChange={uploadPriceBackground} />
          <img src={content.priceBackground} alt="Current price block" className="h-40 w-full rounded-2xl border border-white/10 object-cover" />
        </AdminCard>

        <AdminCard title="Color controls">
          <div className="grid gap-3 md:grid-cols-2">
            <Color label="Background" value={content.backgroundColor} onChange={(v) => updateContent({ backgroundColor: v })} />
            <Color label="Accent/buttons" value={content.accentColor} onChange={(v) => updateContent({ accentColor: v })} />
            <Color label="Main text" value={content.textColor} onChange={(v) => updateContent({ textColor: v })} />
            <Color label="Paragraph/muted" value={content.mutedTextColor} onChange={(v) => updateContent({ mutedTextColor: v })} />
            <Color label="Labels/eyebrows" value={content.labelTextColor} onChange={(v) => updateContent({ labelTextColor: v })} />
            <Color label="Big titles" value={content.titleTextColor} onChange={(v) => updateContent({ titleTextColor: v })} />
            <Color label="Project titles" value={content.projectTitleColor} onChange={(v) => updateContent({ projectTitleColor: v })} />
            <Color label="Project text" value={content.projectDescriptionColor} onChange={(v) => updateContent({ projectDescriptionColor: v })} />
            <Color label="Header text" value={content.headerTextColor} onChange={(v) => updateContent({ headerTextColor: v })} />
          </div>
        </AdminCard>

        <AdminCard title="Pricing and projects text">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Price label" value={content.basePrice} onChange={(v) => updateContent({ basePrice: v })} />
            <Input label="Price title" value={content.priceTitle} onChange={(v) => updateContent({ priceTitle: v })} />
          </div>
          <Textarea label="Price text" value={content.priceText} onChange={(v) => updateContent({ priceText: v })} />
          <Textarea label="Projects intro" value={content.projectsIntro} onChange={(v) => updateContent({ projectsIntro: v })} />
        </AdminCard>
      </div>

      <AdminCard title="Project categories" className="mt-6">
        <div className="flex flex-wrap gap-2">
          {content.categories.map((category) => (
            <div key={category} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-black text-white">
              {category}
              <button onClick={() => deleteCategory(category)} className="text-white/45 hover:text-red-200">×</button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCategory()} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold text-white outline-none" placeholder="Add category" />
          <button onClick={addCategory} className="rounded-2xl bg-[var(--accent)] px-5 py-3 font-black text-white">Add</button>
        </div>
      </AdminCard>

      <AdminCard title="Home page project slots" className="mt-6">
        <div className="grid gap-3 md:grid-cols-3">
          {homeProjects.map((project, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-[10px] font-black uppercase tracking-[.22em] text-[var(--label)]">Home Project {index + 1}</div>
              <div className="mt-2 font-black text-white">{project?.title || "Not selected"}</div>
              <div className="mt-1 text-sm text-[var(--muted)]">{index === 0 ? "Top large card" : "Bottom card"}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="mt-6 space-y-4">
        {content.projects.map((project) => (
          <AdminProjectCard key={project.id} project={project} categories={content.categories} updateProject={updateProject} setHomeSlot={setHomeSlot} uploadProjectPhotos={uploadProjectPhotos} deleteProject={deleteProject} />
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-dashed border-white/20 bg-white/6 p-5 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <button onClick={addProject} className="w-full rounded-2xl bg-[var(--accent)] px-6 py-4 text-lg font-black text-white shadow-xl shadow-black/30">Add new project</button>
        <p className="mt-3 text-sm text-[var(--muted)]">Adds a blank project template at the bottom. New projects show on the Projects page only unless you assign a Home Project slot.</p>
      </div>
    </section>
  );
}

function AdminProjectCard({ project, categories, updateProject, setHomeSlot, uploadProjectPhotos, deleteProject }: { project: Project; categories: string[]; updateProject: (id: string, p: Partial<Project>) => void; setHomeSlot: (id: string, slot: 1 | 2 | 3 | null) => void; uploadProjectPhotos: (id: string, e: ChangeEvent<HTMLInputElement>) => void; deleteProject: (id: string) => void }) {
  return (
    <div id={project.id} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4 shadow-xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[.24em] text-[var(--label)]">{project.homeSlot ? `Home Project ${project.homeSlot}` : "Projects page only"}</div>
          <h2 className="mt-1 text-2xl font-black tracking-[-.04em] text-white">{project.title || "Blank project"}</h2>
        </div>
        <button onClick={() => deleteProject(project.id)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-black text-red-200">Delete</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Input label="Title" value={project.title} onChange={(v) => updateProject(project.id, { title: v })} />
        <Input label="Tag" value={project.tag} onChange={(v) => updateProject(project.id, { tag: v })} />
        <label className="block">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--label)]">Category</div>
          <select value={project.category} onChange={(e) => updateProject(project.id, { category: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold text-white outline-none">
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--label)]">Home slot</div>
          <select value={project.homeSlot || ""} onChange={(e) => setHomeSlot(project.id, e.target.value ? (Number(e.target.value) as 1 | 2 | 3) : null)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold text-white outline-none">
            <option value="">Projects page only</option>
            <option value="1">Home Project 1 - top</option>
            <option value="2">Home Project 2 - bottom</option>
            <option value="3">Home Project 3 - bottom</option>
          </select>
        </label>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_.62fr]">
        <Textarea label="Description" value={project.description} onChange={(v) => updateProject(project.id, { description: v })} />
        <UploadButton label="Add project photos" helper="You can select multiple photos." multiple onChange={(e) => uploadProjectPhotos(project.id, e)} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {project.photos.map((photo, index) => (
          <div key={photo + index} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <img src={photo} alt="Project" className="h-28 w-full object-cover" />
            <button onClick={() => updateProject(project.id, { photos: project.photos.filter((_, i) => i !== index) })} className="absolute right-1.5 top-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-black text-white backdrop-blur">Remove</button>
          </div>
        ))}
        {!project.photos.length && <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center text-sm font-bold text-[var(--muted)] md:col-span-2">No photos yet</div>}
      </div>
    </div>
  );
}

function AdminCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.7rem] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl ${className}`}><h2 className="mb-4 text-2xl font-black tracking-[-.04em] text-white">{title}</h2><div className="space-y-3">{children}</div></div>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><div className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--label)]">{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold text-white outline-none ring-rose-600/40 focus:ring-4" /></label>;
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><div className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--label)]">{label}</div><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold leading-7 text-white outline-none ring-rose-600/40 focus:ring-4" /></label>;
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"><span className="text-xs font-black uppercase tracking-[.14em] text-[var(--label)]">{label}</span><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent" /></label>;
}

function UploadButton({ label, helper, onChange, multiple }: { label: string; helper?: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; multiple?: boolean }) {
  const id = useMemo(() => `upload-${Math.random().toString(36).slice(2)}`, []);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <label htmlFor={id} className="block cursor-pointer rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-black shadow-xl shadow-black/25 transition active:scale-[.98]">
        {label}
      </label>
      <input id={id} type="file" accept="image/*" multiple={multiple} onChange={onChange} className="sr-only" />
      {helper && <p className="mt-2 text-center text-xs font-bold text-[var(--muted)]">{helper}</p>}
    </div>
  );
}

function Footer({ content, openAdmin }: { content: SiteContent; openAdmin: () => void }) {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-10 text-center text-xs text-white/38 md:px-7">
      <div>{content.footerText}</div>
      <div className="mt-2">{nicePhone(content.phone)} • {content.email}</div>
      <button onClick={openAdmin} className="mt-5 text-[10px] text-white/20 underline decoration-white/10 underline-offset-4 transition hover:text-white/45">owner</button>
    </footer>
  );
}

function MobileDock({ view, setView, content }: { view: View; setView: (v: View) => void; content: SiteContent }) {
  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-50 w-[min(270px,calc(100vw-7.5rem))] -translate-x-1/2 rounded-[1.55rem] border border-white/10 bg-black/45 p-1.5 shadow-2xl shadow-black/55 backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-2 gap-1.5">
          <button onClick={() => setView("home")} className={`rounded-[1.2rem] py-3 text-sm font-black ${view === "home" ? "bg-white text-black" : "text-white/75"}`}>Home</button>
          <button onClick={() => setView("projects")} className={`rounded-[1.2rem] py-3 text-sm font-black ${view === "projects" ? "bg-white text-black" : "text-white/75"}`}>Projects</button>
        </div>
      </div>
      <a href={`tel:${normalizePhone(content.phone)}`} className="fixed bottom-9 right-4 z-50 rounded-full bg-[var(--accent)] px-4 py-3 text-xs font-black text-white shadow-2xl shadow-black/55 md:hidden">Call</a>
    </>
  );
}

