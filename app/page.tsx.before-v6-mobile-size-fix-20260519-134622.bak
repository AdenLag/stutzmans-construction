"use client";

import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type View = "home" | "projects" | "adminLogin" | "admin";

type Project = {
  id: string;
  title: string;
  tag: string;
  description: string;
  featured: boolean;
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
  projectsIntro: string;
  footerText: string;
  logoUrl: string;
  projects: Project[];
};

const STORAGE_KEY = "stutzmans-construction-site-v5";
const OWNER_PIN = "3026";

const temporaryPhotos = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=85",
];

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
    "Finished custom homes can start around $275 per square foot. Remodels, garages, shops, additions, and exterior projects may be lower depending on scope. High-end custom homes, premium finishes, large garages, specialty layouts, or unique materials may price higher after the full project is reviewed.",
  priceBackground: temporaryPhotos[1],
  backgroundColor: "#050303",
  panelColor: "rgba(255,255,255,.07)",
  accentColor: "#9f1239",
  textColor: "#ffffff",
  mutedTextColor: "#b8b0b0",
  projectsIntro:
    "Browse homes, remodels, garages, shops, additions, exterior work, and finish details. Each project can hold multiple photos.",
  footerText: "Montana construction company • Custom homes • Remodels • Garages • Exterior finish",
  logoUrl: "/stutzmans-logo.jpeg",
  projects: [
    {
      id: "mountain-modern",
      title: "Mountain Modern Custom Home",
      tag: "Finished Home",
      description:
        "A clean modern home concept with warm exterior materials, sharp roof lines, oversized glass, and a premium finished feel.",
      featured: true,
      photos: [temporaryPhotos[0], temporaryPhotos[1], temporaryPhotos[2]],
    },
    {
      id: "garage-addition",
      title: "Garage & Exterior Addition",
      tag: "Garage Build",
      description:
        "A practical garage and exterior upgrade designed for storage, clean curb appeal, and long-term durability.",
      featured: true,
      photos: [temporaryPhotos[3], temporaryPhotos[4], temporaryPhotos[5]],
    },
    {
      id: "interior-remodel",
      title: "Premium Remodel Concept",
      tag: "Remodel",
      description:
        "Interior and exterior remodeling focused on clean finish work, better layouts, and a higher-end final look.",
      featured: false,
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

export default function Home() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [view, setView] = useState<View>("home");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activePhotos, setActivePhotos] = useState<Record<string, number>>({});
  const [savedNotice, setSavedNotice] = useState("");
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SiteContent;
        setContent({ ...defaultContent, ...parsed, projects: parsed.projects?.length ? parsed.projects : defaultContent.projects });
      }
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
      }) as CSSProperties,
    [content],
  );

  const featuredProjects = content.projects.filter((p) => p.featured).slice(0, 4);
  const visibleProjects = view === "home" ? featuredProjects : content.projects;

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
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
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
          title: "New Project",
          tag: "Project",
          description: "Add a short description for this build.",
          featured: false,
          photos: [temporaryPhotos[0]],
        },
      ],
    }));
  }

  function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    setContent((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
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
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_8%,rgba(159,18,57,.24),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(255,255,255,.09),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.03),transparent_28%)]" />
      <div className="relative z-10 pb-28 md:pb-0">
        <Header content={content} view={view} setView={setView} />

        {view === "home" && (
          <>
            <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 pb-12 pt-10 md:grid-cols-[1.02fr_.98fr] md:px-8 md:pt-20">
              <div>
                <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[.32em] text-rose-200 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  {content.eyebrow}
                </div>
                <h1 className="max-w-3xl text-6xl font-black leading-[.88] tracking-[-.07em] text-white drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-[7.9rem]">
                  {content.heroTitle}
                </h1>
                <p className="mt-7 max-w-2xl text-xl leading-9 text-[var(--muted)] md:text-2xl md:leading-10">
                  {content.heroBody}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href={`tel:${normalizePhone(content.phone)}`} className="rounded-2xl bg-[var(--accent)] px-7 py-4 text-lg font-black text-white shadow-2xl shadow-rose-950/40 transition active:scale-[.98]">
                    Call now
                  </a>
                  <button onClick={() => setView("projects")} className="rounded-2xl border border-white/10 bg-white/10 px-7 py-4 text-lg font-black text-white shadow-2xl shadow-black/40 backdrop-blur-xl transition active:scale-[.98]">
                    View projects
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-[2.4rem] border border-white/10 bg-white/8 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
                  <ProjectCard project={featuredProjects[0] || content.projects[0]} activePhotos={activePhotos} movePhoto={movePhoto} large />
                </div>
              </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 md:grid-cols-3 md:px-8">
              {["Custom homes", "Remodels", "Garages & shops"].map((label) => (
                <div key={label} className="rounded-[1.7rem] border border-white/10 bg-white/8 p-6 shadow-xl shadow-black/30 backdrop-blur-xl">
                  <div className="text-lg font-black text-white">{label}</div>
                  <div className="mt-2 text-xs font-black uppercase tracking-[.22em] text-[var(--muted)]">Premium finish</div>
                </div>
              ))}
            </section>

            <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
              <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/8 shadow-2xl shadow-black/50 backdrop-blur-xl md:grid md:grid-cols-[.85fr_1.15fr]">
                <div className="min-h-[320px] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.18)),url(${content.priceBackground})` }} />
                <div className="p-7 md:p-10">
                  <div className="text-xs font-black uppercase tracking-[.35em] text-rose-200">Base guide</div>
                  <h2 className="mt-4 text-5xl font-black tracking-[-.06em] text-white md:text-6xl">{content.basePrice}</h2>
                  <h3 className="mt-5 text-2xl font-black text-white">{content.priceTitle}</h3>
                  <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{content.priceText}</p>
                </div>
              </div>
            </section>

            <ProjectsSection title="Featured projects" intro="A few selected builds and concepts for the homepage." projects={visibleProjects} activePhotos={activePhotos} movePhoto={movePhoto} />
          </>
        )}

        {view === "projects" && (
          <ProjectsSection title="All projects" intro={content.projectsIntro} projects={content.projects} activePhotos={activePhotos} movePhoto={movePhoto} fullPage />
        )}

        {view === "adminLogin" && (
          <section className="mx-auto flex min-h-[72vh] max-w-lg items-center px-5 py-20">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/8 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <div className="text-xs font-black uppercase tracking-[.3em] text-rose-200">Owner portal</div>
              <h1 className="mt-4 text-4xl font-black tracking-[-.04em] text-white">Sign in</h1>
              <p className="mt-3 text-[var(--muted)]">Enter the owner PIN to edit website content, photos, prices, colors, and projects.</p>
              <input value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitPin()} type="password" className="mt-6 w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 text-xl font-black text-white outline-none ring-rose-600/40 focus:ring-4" placeholder="Owner PIN" />
              {pinError && <div className="mt-3 text-sm font-black text-red-300">{pinError}</div>}
              <button onClick={submitPin} className="mt-5 w-full rounded-2xl bg-[var(--accent)] px-5 py-4 text-lg font-black text-white">Open editor</button>
            </div>
          </section>
        )}

        {view === "admin" && <AdminPanel content={content} updateContent={updateContent} updateProject={updateProject} addProject={addProject} deleteProject={deleteProject} uploadLogo={uploadLogo} uploadPriceBackground={uploadPriceBackground} uploadProjectPhotos={uploadProjectPhotos} save={save} savedNotice={savedNotice} setView={setView} />}

        <Footer content={content} openAdmin={openAdmin} />
        <MobileDock view={view} setView={setView} content={content} />
      </div>
    </main>
  );
}

function Header({ content, view, setView }: { content: SiteContent; view: View; setView: (v: View) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/72 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-4">
        <button onClick={() => setView("home")} className="flex min-w-0 items-center gap-4 text-left">
          <img src={content.logoUrl} alt="Stutzman's Construction logo" className="h-16 w-28 shrink-0 object-contain drop-shadow-[0_0_20px_rgba(159,18,57,.55)] md:h-20 md:w-36" />
          <div className="hidden min-w-0 sm:block">
            <div className="text-[10px] font-black uppercase tracking-[.35em] text-rose-200 md:text-xs">Custom homes • Remodels • Garages</div>
            <div className="mt-1 text-2xl font-black tracking-[-.04em] text-white md:text-3xl">{content.companyName}</div>
          </div>
        </button>
        <nav className="hidden rounded-full border border-white/10 bg-white/8 p-1 shadow-xl shadow-black/30 backdrop-blur-xl md:flex">
          <button onClick={() => setView("home")} className={`rounded-full px-7 py-3 text-lg font-black ${view === "home" ? "bg-white text-black" : "text-white/75"}`}>Home</button>
          <button onClick={() => setView("projects")} className={`rounded-full px-7 py-3 text-lg font-black ${view === "projects" ? "bg-white text-black" : "text-white/75"}`}>Projects</button>
        </nav>
        <a href={`tel:${normalizePhone(content.phone)}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-xl shadow-black/30 md:px-6 md:text-base">Call {nicePhone(content.phone)}</a>
      </div>
    </header>
  );
}

function ProjectsSection({ title, intro, projects, activePhotos, movePhoto, fullPage }: { title: string; intro: string; projects: Project[]; activePhotos: Record<string, number>; movePhoto: (id: string, dir: 1 | -1) => void; fullPage?: boolean }) {
  return (
    <section className={`mx-auto max-w-7xl px-5 ${fullPage ? "py-16" : "py-12"} md:px-8`}>
      <div className="text-xs font-black uppercase tracking-[.38em] text-rose-200">Project gallery</div>
      <h2 className="mt-5 text-6xl font-black tracking-[-.07em] text-white md:text-8xl">{title}</h2>
      <p className="mt-6 max-w-4xl text-2xl leading-10 text-[var(--muted)]">{intro}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} activePhotos={activePhotos} movePhoto={movePhoto} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, activePhotos, movePhoto, large }: { project: Project; activePhotos: Record<string, number>; movePhoto: (id: string, dir: 1 | -1) => void; large?: boolean }) {
  const index = activePhotos[project.id] || 0;
  const photo = project.photos[index] || temporaryPhotos[0];
  return (
    <article className={`group relative overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/8 shadow-2xl shadow-black/50 ${large ? "min-h-[560px]" : "min-h-[520px]"}`}>
      <img src={photo} alt={project.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
      {project.photos.length > 1 && (
        <>
          <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, -1); }} className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-3xl font-black text-white opacity-90 shadow-xl backdrop-blur-xl transition md:opacity-0 md:group-hover:opacity-100">‹</button>
          <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, 1); }} className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-3xl font-black text-white opacity-90 shadow-xl backdrop-blur-xl transition md:opacity-0 md:group-hover:opacity-100">›</button>
        </>
      )}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-9 md:p-8 md:pb-10">
        <div className="mb-4 inline-flex max-w-[calc(100%-6rem)] rounded-full border border-white/15 bg-white/72 px-5 py-2 text-xs font-black uppercase tracking-[.28em] text-black shadow-xl backdrop-blur-xl">{project.tag}</div>
        <h3 className="max-w-[calc(100%-1rem)] text-4xl font-black leading-none tracking-[-.05em] text-white md:text-5xl">{project.title}</h3>
        <p className="mt-4 max-w-[92%] text-lg leading-8 text-white/82 md:text-xl md:leading-9">{project.description}</p>
        {project.photos.length > 1 && (
          <div className="mt-5 flex justify-end gap-2 pr-3">
            {project.photos.map((_, dotIndex) => <span key={dotIndex} className={`h-3 rounded-full transition-all ${dotIndex === index ? "w-12 bg-white" : "w-3 bg-white/35"}`} />)}
          </div>
        )}
      </div>
    </article>
  );
}

function AdminPanel({ content, updateContent, updateProject, addProject, deleteProject, uploadLogo, uploadPriceBackground, uploadProjectPhotos, save, savedNotice, setView }: { content: SiteContent; updateContent: (p: Partial<SiteContent>) => void; updateProject: (id: string, p: Partial<Project>) => void; addProject: () => void; deleteProject: (id: string) => void; uploadLogo: (e: ChangeEvent<HTMLInputElement>) => void; uploadPriceBackground: (e: ChangeEvent<HTMLInputElement>) => void; uploadProjectPhotos: (id: string, e: ChangeEvent<HTMLInputElement>) => void; save: () => void; savedNotice: string; setView: (v: View) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-black uppercase tracking-[.35em] text-rose-200">Owner control room</div>
          <h1 className="mt-2 text-5xl font-black tracking-[-.06em] text-white">Website editor</h1>
          <p className="mt-2 text-[var(--muted)]">Edit text, colors, pricing, logo, price image, homepage featured projects, and all project photos.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView("home")} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-black text-white">Preview</button>
          <button onClick={() => save()} className="rounded-2xl bg-[var(--accent)] px-6 py-3 font-black text-white">Save</button>
        </div>
      </div>
      {savedNotice && <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 font-black text-emerald-200">{savedNotice}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="Main site text">
          <Input label="Company name" value={content.companyName} onChange={(v) => updateContent({ companyName: v })} />
          <Input label="Top small text" value={content.eyebrow} onChange={(v) => updateContent({ eyebrow: v })} />
          <Textarea label="Hero headline" value={content.heroTitle} onChange={(v) => updateContent({ heroTitle: v })} />
          <Textarea label="Hero paragraph" value={content.heroBody} onChange={(v) => updateContent({ heroBody: v })} />
          <Input label="Phone" value={content.phone} onChange={(v) => updateContent({ phone: v })} />
          <Input label="Email" value={content.email} onChange={(v) => updateContent({ email: v })} />
          <Textarea label="Footer text" value={content.footerText} onChange={(v) => updateContent({ footerText: v })} />
        </AdminCard>

        <AdminCard title="Colors and logo">
          <Color label="Background" value={content.backgroundColor} onChange={(v) => updateContent({ backgroundColor: v })} />
          <Color label="Accent" value={content.accentColor} onChange={(v) => updateContent({ accentColor: v })} />
          <Color label="Text" value={content.textColor} onChange={(v) => updateContent({ textColor: v })} />
          <Color label="Muted text" value={content.mutedTextColor} onChange={(v) => updateContent({ mutedTextColor: v })} />
          <label className="block rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-rose-200">Upload logo</div>
            <input type="file" accept="image/*" onChange={uploadLogo} className="w-full text-sm text-white" />
          </label>
          <img src={content.logoUrl} alt="Logo preview" className="h-32 w-full object-contain" />
        </AdminCard>

        <AdminCard title="Pricing block">
          <Input label="Price label" value={content.basePrice} onChange={(v) => updateContent({ basePrice: v })} />
          <Input label="Price title" value={content.priceTitle} onChange={(v) => updateContent({ priceTitle: v })} />
          <Textarea label="Price text" value={content.priceText} onChange={(v) => updateContent({ priceText: v })} />
          <label className="block rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-rose-200">Price block background photo</div>
            <input type="file" accept="image/*" onChange={uploadPriceBackground} className="w-full text-sm text-white" />
          </label>
        </AdminCard>

        <AdminCard title="Projects page text">
          <Textarea label="Projects intro" value={content.projectsIntro} onChange={(v) => updateContent({ projectsIntro: v })} />
          <button onClick={addProject} className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 font-black text-white">Add new project</button>
        </AdminCard>
      </div>

      <div className="mt-8 space-y-6">
        {content.projects.map((project) => (
          <AdminCard key={project.id} title={project.title || "Project"}>
            <div className="grid gap-4 lg:grid-cols-2">
              <Input label="Project title" value={project.title} onChange={(v) => updateProject(project.id, { title: v })} />
              <Input label="Project tag" value={project.tag} onChange={(v) => updateProject(project.id, { tag: v })} />
            </div>
            <Textarea label="Project description" value={project.description} onChange={(v) => updateProject(project.id, { description: v })} />
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 font-black text-white">
              <input type="checkbox" checked={project.featured} onChange={(e) => updateProject(project.id, { featured: e.target.checked })} />
              Show this project on homepage
            </label>
            <label className="block rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-rose-200">Add multiple photos</div>
              <input type="file" accept="image/*" multiple onChange={(e) => uploadProjectPhotos(project.id, e)} className="w-full text-sm text-white" />
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {project.photos.map((photo, index) => (
                <div key={photo + index} className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <img src={photo} alt="Project" className="h-32 w-full object-cover" />
                  <button onClick={() => updateProject(project.id, { photos: project.photos.filter((_, i) => i !== index) })} className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white">Remove</button>
                </div>
              ))}
            </div>
            <button onClick={() => deleteProject(project.id)} className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 font-black text-red-200">Delete project</button>
          </AdminCard>
        ))}
      </div>
    </section>
  );
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl"><h2 className="mb-5 text-2xl font-black tracking-[-.04em] text-white">{title}</h2><div className="space-y-4">{children}</div></div>;
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-rose-200">{label}</div><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold text-white outline-none ring-rose-600/40 focus:ring-4" /></label>;
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="block"><div className="mb-2 text-xs font-black uppercase tracking-[.2em] text-rose-200">{label}</div><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-bold leading-7 text-white outline-none ring-rose-600/40 focus:ring-4" /></label>;
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4"><span className="text-sm font-black uppercase tracking-[.18em] text-rose-200">{label}</span><input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-20 rounded-xl border border-white/10 bg-transparent" /></label>;
}

function Footer({ content, openAdmin }: { content: SiteContent; openAdmin: () => void }) {
  return (
    <footer className="mx-auto max-w-7xl px-5 py-12 text-center text-xs text-white/38 md:px-8">
      <div>{content.footerText}</div>
      <div className="mt-2">{nicePhone(content.phone)} • {content.email}</div>
      <button onClick={openAdmin} className="mt-5 text-[10px] text-white/20 underline decoration-white/10 underline-offset-4 transition hover:text-white/45">owner</button>
    </footer>
  );
}

function MobileDock({ view, setView, content }: { view: View; setView: (v: View) => void; content: SiteContent }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 p-3 backdrop-blur-2xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[1.7rem] border border-white/10 bg-white/8 p-1 shadow-2xl shadow-black/60">
        <button onClick={() => setView("home")} className={`rounded-[1.35rem] py-3 font-black ${view === "home" ? "bg-white text-black" : "text-white/70"}`}>Home</button>
        <button onClick={() => setView("projects")} className={`rounded-[1.35rem] py-3 font-black ${view === "projects" ? "bg-white text-black" : "text-white/70"}`}>Projects</button>
        <a href={`tel:${normalizePhone(content.phone)}`} className="rounded-[1.35rem] bg-[var(--accent)] py-3 text-center font-black text-white">Call</a>
      </div>
    </div>
  );
}
