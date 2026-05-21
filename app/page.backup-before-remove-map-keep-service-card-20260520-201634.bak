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
  // Legacy support for older saved localStorage content that used featured: true/false.
  featured?: boolean;
  photos: string[];
  photoFocus?: Record<string, string>;
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
  integrityBackgroundColor: string;
  integrityAccentColor: string;
  integrityTextColor: string;
  integrityTitle: string;
  integritySubtitle: string;
  integrityRegion: string;
  integrityBody: string;
  serviceAreaTitle: string;
  serviceAreaText: string;
  serviceAreaTownsText: string;
  serviceAreaBadgeText: string;
  serviceAreaMapUrl: string;
  companyNameFont: string;
  heroTitleFont: string;
  bodyFont: string;
  projectTitleFont: string;
  buttonFont: string;
  labelFont: string;
  projectsIntro: string;
  footerText: string;
  logoUrl: string;
  categories: string[];
  projects: Project[];
};

const STORAGE_KEY = "stutzmans-construction-site-v12-montana-premium";
const OLD_STORAGE_KEYS = ["stutzmans-construction-site-v11", "stutzmans-construction-site-v10", "stutzmans-construction-site-v9", "stutzmans-construction-site-v8", "stutzmans-construction-site-v7", "stutzmans-construction-site-v6", "stutzmans-construction-site-v5"];
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
const fontOptions = [
  "Inter",
  "Arial",
  "Helvetica",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
  "Gill Sans",
  "Segoe UI",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Oswald",
  "Raleway",
  "Nunito",
  "Avenir",
  "Futura",
  "Century Gothic",
  "Franklin Gothic Medium",
  "Arial Black",
  "Impact",
  "Georgia",
  "Times New Roman",
  "Garamond",
  "Palatino",
  "Baskerville",
  "Didot",
  "Bodoni 72",
  "Copperplate",
  "Optima",
  "Cambria",
  "Candara",
  "Courier New",
  "Lucida Console",
  "Brush Script MT",
  "Snell Roundhand",
] as const;

function fontStack(font: string) {
  return `${font}, Inter, Arial, sans-serif`;
}

function cleanSavedText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value
    .replaceAll("\u00e2\u20ac\u00a2", "•")
    .replaceAll("\u00e2\u20ac\u00b9", "‹")
    .replaceAll("\u00e2\u20ac\u00ba", "›")
    .replaceAll("\u00c3\u2014", "×")
    .replaceAll("\u00e2\u20ac\u2122", "’")
    .replaceAll("\u00e2\u20ac\u0153", "“")
    .replaceAll("\u00e2\u20ac\u009d", "”")
    .replaceAll("\u00e2\u20ac\u201c", "–")
    .replaceAll("\u00e2\u20ac\u201d", "—");
}


const defaultContent: SiteContent = {
  companyName: "Stutzman's Construction",
  eyebrow: "MONTANA CUSTOM HOMES • REMODELS • SHOPS",
  heroTitle: "Rugged Montana craftsmanship. Premium finish work. Built to last.",
  heroBody:
    "Stutzman's Construction builds custom homes, remodels, garages, shops, additions, roofing, siding, and finish work with a rugged Montana feel and a clean high-end finish from first walkthrough to final detail.",
  phone: "406-607-7888",
  email: "stutzmansconstruction@gmail.com",
  basePrice: "$275 / sq ft",
  priceTitle: "Custom home starting guide",
  priceText:
    "Full finished custom homes can start around $275 per square foot. Final pricing depends on scope, finishes, materials, site access, weather, excavation, utilities, and the details that make each Montana build unique.",
  priceBackground: temporaryPhotos[1],
  backgroundColor: "#040302",
  panelColor: "rgba(255,255,255,.07)",
  accentColor: "#8f1d2c",
  textColor: "#ffffff",
  mutedTextColor: "#b8b0b0",
  labelTextColor: "#ffd4c2",
  titleTextColor: "#ffffff",
  projectTitleColor: "#ffffff",
  projectDescriptionColor: "#d6d0d0",
  headerTextColor: "#ffffff",
  integrityBackgroundColor: "#080605",
  integrityAccentColor: "#8f1d2c",
  integrityTextColor: "#ffffff",
  integrityTitle: "Montana grit. Clean finish. Honest work.",
  integritySubtitle: "Proudly serving",
  integrityRegion: "Northwest Montana",
  integrityBody: "Rugged construction, clean communication, and finish details that hold up through real Montana seasons.",
  serviceAreaTitle: "Northwest Montana service area",
  serviceAreaText: "We proudly serve northwest Montana communities including Eureka, Fortine, Trego, Yaak, Rexford, Stryker, Whitefish, Kalispell, Libby, and nearby rural properties. Reach out and we can confirm availability for your exact project site.",
  serviceAreaTownsText: "Eureka • Fortine • Trego • Yaak • Rexford • Stryker • Whitefish • Kalispell • Libby • surrounding rural properties",
  serviceAreaBadgeText: "Editable Northwest Montana work zone",
  serviceAreaMapUrl: "/stutzmans-where-we-work-map.png",
  companyNameFont: "Georgia",
  heroTitleFont: "Arial Black",
  bodyFont: "Inter",
  projectTitleFont: "Georgia",
  buttonFont: "Inter",
  labelFont: "Montserrat",
  projectsIntro:
    "Browse custom homes, remodels, garages, shops, additions, exterior work, and finish details without repeating the same story on every section. Each project can hold multiple photos, crop settings, and a home-page slot.",
  footerText: "Northwest Montana construction • Custom homes • Remodels • Garages • Shops • Exterior finish",
  logoUrl: "/stutzmans-logo-transparent.png",
  categories: defaultCategories,
  projects: [
    {
      id: "mountain-modern",
      title: "Rugged Mountain Custom Home",
      tag: "Finished Home",
      category: "Homes",
      description:
        "A mountain-ready custom home concept with strong exterior lines, warm natural materials, oversized glass, and a polished high-end finish.",
      homeSlot: 1,
      photos: [temporaryPhotos[0], temporaryPhotos[1], temporaryPhotos[2]],
    },
    {
      id: "garage-addition",
      title: "Mountain Garage & Exterior Addition",
      tag: "Garage Build",
      category: "Garages & Shops",
      description:
        "A rugged garage and exterior upgrade designed for storage, Montana weather, clean curb appeal, and long-term durability.",
      homeSlot: 2,
      photos: [temporaryPhotos[3], temporaryPhotos[4], temporaryPhotos[5]],
    },
    {
      id: "interior-remodel",
      title: "High-End Montana Remodel",
      tag: "Remodel",
      category: "Remodels",
      description:
        "Interior and exterior remodeling focused on stronger layouts, cleaner details, premium finishes, and a warmer Montana home feel.",
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

function getPhotoFocus(project: Project, index: number) {
  return project.photoFocus?.[String(index)] || "50% 50%";
}

function setPhotoFocusValue(project: Project, index: number, axis: "x" | "y", value: number) {
  const current = getPhotoFocus(project, index).split(" ");
  const x = axis === "x" ? `${value}%` : current[0] || "50%";
  const y = axis === "y" ? `${value}%` : current[1] || "50%";
  return { ...(project.photoFocus || {}), [String(index)]: `${x} ${y}` };
}

function migrateContent(raw: unknown): SiteContent {
  const parsed = (raw || {}) as Partial<SiteContent> & { projects?: Array<Partial<Project> & { featured?: boolean }> };
  const categories = parsed.categories?.length ? parsed.categories : defaultCategories;
  const projects = parsed.projects?.length
    ? parsed.projects.map((project, index) => ({
        id: project.id || `project-${index + 1}`,
        title: cleanSavedText(project.title, "Untitled Project"),
        tag: cleanSavedText(project.tag, "Project"),
        category: cleanSavedText(project.category, categories[index % categories.length] || "Homes"),
        description: cleanSavedText(project.description, "Add a short description for this project."),
        homeSlot:
          project.homeSlot === 1 || project.homeSlot === 2 || project.homeSlot === 3
            ? project.homeSlot
            : project.featured && index < 3
              ? ((index + 1) as 1 | 2 | 3)
              : null,
        photos: project.photos?.length ? project.photos : [temporaryPhotos[index % temporaryPhotos.length]],
        photoFocus: project.photoFocus || {},
      }))
    : defaultContent.projects;

  return {
    ...defaultContent,
    ...parsed,
    companyName: cleanSavedText(parsed.companyName, defaultContent.companyName),
    eyebrow: cleanSavedText(parsed.eyebrow, defaultContent.eyebrow),
    heroTitle: cleanSavedText(parsed.heroTitle, defaultContent.heroTitle),
    heroBody: cleanSavedText(parsed.heroBody, defaultContent.heroBody),
    phone: cleanSavedText(parsed.phone, defaultContent.phone),
    email: cleanSavedText(parsed.email, defaultContent.email),
    basePrice: cleanSavedText(parsed.basePrice, defaultContent.basePrice),
    priceTitle: cleanSavedText(parsed.priceTitle, defaultContent.priceTitle),
    priceText: cleanSavedText(parsed.priceText, defaultContent.priceText),
    projectsIntro: cleanSavedText(parsed.projectsIntro, defaultContent.projectsIntro),
    footerText: cleanSavedText(parsed.footerText, defaultContent.footerText),
    logoUrl: parsed.logoUrl && parsed.logoUrl !== "/stutzmans-logo.jpeg" ? parsed.logoUrl : defaultContent.logoUrl,
    categories,
    projects,
    labelTextColor: parsed.labelTextColor || defaultContent.labelTextColor,
    titleTextColor: parsed.titleTextColor || defaultContent.titleTextColor,
    projectTitleColor: parsed.projectTitleColor || defaultContent.projectTitleColor,
    projectDescriptionColor: parsed.projectDescriptionColor || defaultContent.projectDescriptionColor,
    headerTextColor: parsed.headerTextColor || defaultContent.headerTextColor,
    integrityBackgroundColor: parsed.integrityBackgroundColor || defaultContent.integrityBackgroundColor,
    integrityAccentColor: parsed.integrityAccentColor || defaultContent.integrityAccentColor,
    integrityTextColor: parsed.integrityTextColor || defaultContent.integrityTextColor,
    integrityTitle: cleanSavedText(parsed.integrityTitle, defaultContent.integrityTitle),
    integritySubtitle: cleanSavedText(parsed.integritySubtitle, defaultContent.integritySubtitle),
    integrityRegion: cleanSavedText(parsed.integrityRegion, defaultContent.integrityRegion),
    integrityBody: cleanSavedText(parsed.integrityBody, defaultContent.integrityBody),
    serviceAreaTitle: cleanSavedText(parsed.serviceAreaTitle, defaultContent.serviceAreaTitle),
    serviceAreaText: cleanSavedText(parsed.serviceAreaText, defaultContent.serviceAreaText),
    serviceAreaTownsText: cleanSavedText(parsed.serviceAreaTownsText, defaultContent.serviceAreaTownsText),
    serviceAreaBadgeText: cleanSavedText(parsed.serviceAreaBadgeText, defaultContent.serviceAreaBadgeText),
    serviceAreaMapUrl: parsed.serviceAreaMapUrl || defaultContent.serviceAreaMapUrl,
    companyNameFont: parsed.companyNameFont || defaultContent.companyNameFont,
    heroTitleFont: parsed.heroTitleFont || defaultContent.heroTitleFont,
    bodyFont: parsed.bodyFont || defaultContent.bodyFont,
    projectTitleFont: parsed.projectTitleFont || defaultContent.projectTitleFont,
    buttonFont: parsed.buttonFont || defaultContent.buttonFont,
    labelFont: parsed.labelFont || defaultContent.labelFont,
  };
}

function loadStoredContent(): SiteContent {
  try {
    if (typeof window === "undefined") return defaultContent;
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of OLD_STORAGE_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    return raw ? migrateContent(JSON.parse(raw)) : defaultContent;
  } catch {
    return defaultContent;
  }
}
const SITE_ROW_ID = "main";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey };
}

async function loadRemoteContent() {
  const config = getSupabaseConfig();
  if (!config) return null;
  try {
    const response = await fetch(`${config.url}/rest/v1/stutzmans_site_content?id=eq.${SITE_ROW_ID}&select=content`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ content?: unknown }>;
    if (!rows[0]?.content) return null;
    return migrateContent(rows[0].content);
  } catch {
    return null;
  }
}

async function saveRemoteContent(next: SiteContent) {
  const config = getSupabaseConfig();
  if (!config) return false;
  try {
    const response = await fetch(`${config.url}/rest/v1/stutzmans_site_content?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ id: SITE_ROW_ID, content: next }),
    });
    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error("Supabase save failed", response.status, details);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase save error", error);
    return false;
  }
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
    let active = true;
    const local = loadStoredContent();
    setContent(local);
    loadRemoteContent().then((remote) => {
      if (!active || !remote) return;
      setContent(remote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (view === "admin" || view === "adminLogin") return;
    const interval = window.setInterval(() => {
      loadRemoteContent().then((remote) => {
        if (!remote) return;
        setContent(remote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
      });
    }, 15000);
    return () => window.clearInterval(interval);
  }, [view]);

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
        "--integrity-bg": content.integrityBackgroundColor,
        "--integrity-accent": content.integrityAccentColor,
        "--integrity-text": content.integrityTextColor,
        "--font-company": fontStack(content.companyNameFont),
        "--font-hero": fontStack(content.heroTitleFont),
        "--font-body": fontStack(content.bodyFont),
        "--font-project": fontStack(content.projectTitleFont),
        "--font-button": fontStack(content.buttonFont),
        "--font-label": fontStack(content.labelFont),
      }) as CSSProperties,
    [content],
  );

  const homeProjects = [1, 2, 3]
    .map((slot) => content.projects.find((project) => project.homeSlot === slot))
    .filter(Boolean) as Project[];

  const projectPageProjects = projectFilter === "All" ? content.projects : content.projects.filter((project) => project.category === projectFilter);

  async function save(next = content) {
    setSavedNotice("Saving changes...");
    const cleaned = migrateContent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));

    const remoteSaved = await saveRemoteContent(cleaned);

    if (remoteSaved) {
      setContent(cleaned);
      setSavedNotice("Saved for everyone. Returning home...");
      window.setTimeout(() => {
        setSavedNotice("");
        setView("home");
      }, 700);
      return;
    }

    setSavedNotice("Saved on this device only. Supabase did not accept the save.");
    window.alert(
      "Saved on this device only. Supabase did not accept the save yet. Check Vercel environment variables and Supabase RLS policies.",
    );
  }

  async function cancelAdminChanges() {
    const remote = await loadRemoteContent();
    const lastSaved = remote || loadStoredContent();
    setContent(lastSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastSaved));
    setView("home");
    setSavedNotice("Unsaved changes canceled.");
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
    event.target.value = "";
  }

  function reorderProjectPhoto(projectId: string, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    const project = content.projects.find((p) => p.id === projectId);
    if (!project || fromIndex >= project.photos.length || toIndex >= project.photos.length) return;

    const nextPhotos = [...project.photos];
    const [movedPhoto] = nextPhotos.splice(fromIndex, 1);
    nextPhotos.splice(toIndex, 0, movedPhoto);

    const oldFocus = project.photoFocus || {};
    const focusList = project.photos.map((_, index) => oldFocus[String(index)] || "50% 50%");
    const [movedFocus] = focusList.splice(fromIndex, 1);
    focusList.splice(toIndex, 0, movedFocus);
    const nextFocus = focusList.reduce<Record<string, string>>((acc, focus, index) => {
      acc[String(index)] = focus;
      return acc;
    }, {});

    updateProject(projectId, { photos: nextPhotos, photoFocus: nextFocus });
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
    <main className="min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--text)]" style={{ ...themeStyle, fontFamily: "var(--font-body)" }}>
      <div ref={topRef} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_14%_8%,rgba(159,18,57,.22),transparent_32%),radial-gradient(circle_at_90%_18%,rgba(255,255,255,.07),transparent_27%),linear-gradient(180deg,rgba(255,255,255,.025),transparent_28%)]" />
      <div className="relative z-10 pb-28 md:pb-0">
        <Header content={content} view={view} setView={setView} />

        {view === "home" && (
          <>
            <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-10 pt-8 md:grid-cols-[1.03fr_.97fr] md:px-7 md:pt-14">
              <div>
                <div style={{ fontFamily: "var(--font-label)" }} className="mb-5 inline-flex rounded-full border border-white/10 bg-white/8 px-3.5 py-2 text-[10px] font-black uppercase tracking-[.28em] text-[var(--label)] shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  {content.eyebrow}
                </div>
                <h1 style={{ fontFamily: "var(--font-hero)" }} className="max-w-3xl text-[clamp(2.45rem,7.2vw,6.1rem)] font-black leading-[.9] tracking-[-.055em] text-[var(--title)] drop-shadow-2xl">
                  {content.heroTitle}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl md:leading-9">
                  {content.heroBody}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <ContactButtons content={content} compact={false} />
                  <button onClick={() => setView("projects")} style={{ fontFamily: "var(--font-button)" }} className="rounded-2xl border border-white/10 bg-white/10 px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-black/35 backdrop-blur-xl transition active:scale-[.98]">
                    View work
                  </button>
                </div>
              </div>

              <div className="relative">
                {homeProjects[0] && <ProjectCard project={homeProjects[0]} activePhotos={activePhotos} movePhoto={movePhoto} large />}
              </div>
            </section>

            <IntegrityBanner content={content} />

            <section className="mx-auto grid max-w-6xl gap-4 px-5 py-8 md:grid-cols-3 md:px-7">
              {[
                ["Custom homes", "Mountain-ready builds with clean premium detail."],
                ["Remodels", "Better layouts, sharper finish, stronger daily living."],
                ["Garages & shops", "Functional spaces built for tools, trucks, and weather."],
              ].map(([label, body]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/25 backdrop-blur-xl">
                  <div className="text-base font-black text-[var(--title)]">{label}</div>
                  <div className="mt-2 text-sm font-bold leading-6 text-[var(--muted)]">{body}</div>
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
              <h2 className="mt-4 text-[clamp(2.4rem,7vw,5.6rem)] font-black tracking-[-.055em] text-[var(--title)]">Built for Montana. Finished like it matters.</h2>
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
              <p className="mt-3 text-[var(--muted)]">Enter the owner PIN to control website text, photos, prices, colors, fonts, project order, service area copy, and home-page project slots.</p>
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
            reorderProjectPhoto={reorderProjectPhoto}
            save={save}
            cancelChanges={cancelAdminChanges}
            savedNotice={savedNotice}
            setView={setView}
          />
        )}

        {view === "home" && <ServiceAreaSection content={content} />}
        <MontanaTributeStrip />
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
        <button onClick={() => setView("home")} className="flex min-w-0 items-center gap-3 text-left md:gap-5">
          <span className="logo-clean flex h-auto w-[112px] shrink-0 items-center justify-center overflow-visible bg-transparent sm:w-[130px] md:w-44">
            <img src={content.logoUrl} alt="Stutzman's Construction logo" className="h-auto max-h-[68px] w-full object-contain md:max-h-[88px]" />
          </span>
          <div className="min-w-0">
            <div className="hidden text-[10px] font-black uppercase tracking-[.28em] text-[var(--label)] sm:block md:text-[11px]">Custom homes • Remodels • Garages</div>
            <div className="max-w-[47vw] truncate text-lg font-black leading-none tracking-[-.04em] text-[var(--header-text)] sm:max-w-none sm:whitespace-nowrap sm:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,.45)] md:mt-1 md:text-4xl">{content.companyName}</div>
          </div>
        </button>
        <nav className="hidden rounded-full border border-white/10 bg-white/8 p-1 shadow-xl shadow-black/25 backdrop-blur-xl md:flex">
          <button onClick={() => setView("home")} className={`rounded-full px-6 py-2.5 text-base font-black ${view === "home" ? "bg-white text-black" : "text-white/75"}`}>Home</button>
          <button onClick={() => setView("projects")} className={`rounded-full px-6 py-2.5 text-base font-black ${view === "projects" ? "bg-white text-black" : "text-white/75"}`}>Projects</button>
        </nav>
        <a href={`tel:${normalizePhone(content.phone)}`} className="hidden rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-xl shadow-black/25 md:inline-flex">Call</a>
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
      <h2 className="mt-4 text-[clamp(2.6rem,8vw,5.8rem)] font-black tracking-[-.055em] text-[var(--title)]">{title}</h2>
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
        <img src={photo} alt={project.title || "Project photo"} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" style={{ objectPosition: getPhotoFocus(project, index) }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-black/10" />
        {project.photos.length > 1 && (
          <>
            <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, -1); }} className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-5xl font-black leading-none text-white drop-shadow-[0_3px_8px_rgba(0,0,0,.9)] transition active:scale-95">‹</button>
            <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); movePhoto(project.id, 1); }} className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-transparent text-5xl font-black leading-none text-white drop-shadow-[0_3px_8px_rgba(0,0,0,.9)] transition active:scale-95">›</button>
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

function AdminPanel({ content, updateContent, updateProject, setHomeSlot, addProject, deleteProject, newCategory, setNewCategory, addCategory, deleteCategory, uploadLogo, uploadPriceBackground, uploadProjectPhotos, reorderProjectPhoto, save, cancelChanges, savedNotice, setView }: { content: SiteContent; updateContent: (p: Partial<SiteContent>) => void; updateProject: (id: string, p: Partial<Project>) => void; setHomeSlot: (id: string, slot: 1 | 2 | 3 | null) => void; addProject: () => void; deleteProject: (id: string) => void; newCategory: string; setNewCategory: (v: string) => void; addCategory: () => void; deleteCategory: (category: string) => void; uploadLogo: (e: ChangeEvent<HTMLInputElement>) => void; uploadPriceBackground: (e: ChangeEvent<HTMLInputElement>) => void; uploadProjectPhotos: (id: string, e: ChangeEvent<HTMLInputElement>) => void; reorderProjectPhoto: (id: string, fromIndex: number, toIndex: number) => void; save: () => void | Promise<void>; cancelChanges: () => void | Promise<void>; savedNotice: string; setView: (v: View) => void }) {
  const homeProjects = [1, 2, 3].map((slot) => content.projects.find((project) => project.homeSlot === slot));

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 md:px-7">
      <div className="sticky top-[78px] z-30 mb-6 flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/60 p-4 shadow-2xl shadow-black/45 backdrop-blur-2xl md:top-[92px] md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[.32em] text-[var(--label)]">Owner command center</div>
          <h1 className="mt-1 text-3xl font-black tracking-[-.06em] text-[var(--title)] md:text-4xl">Website control center</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setView("home")} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white">Preview site</button>
          <button onClick={cancelChanges} className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-black text-white/80">Cancel edits</button>
          <button onClick={() => save()} className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white">Save website</button>
        </div>
      </div>
      {savedNotice && <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 font-black text-emerald-200">{savedNotice}</div>}

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {[
          ["Copy", "Hero, service area, price guide, footer"],
          ["Brand", "Logo, colors, fonts, premium styling"],
          ["Projects", "Photos, crop, order, categories, home slots"],
          ["Save", "Local backup plus Supabase sync when enabled"],
        ].map(([title, body]) => (
          <div key={title} className="rounded-[1.35rem] border border-white/10 bg-white/8 p-4 shadow-xl shadow-black/25 backdrop-blur-xl">
            <div className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--label)]">{title}</div>
            <p className="mt-2 text-sm font-bold leading-6 text-white/60">{body}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard title="Main website copy">
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

        <AdminCard title="Brand images">
          <UploadButton label="Upload logo" helper="Logo preview has no forced box/background." onChange={uploadLogo} />
          <div className="rounded-2xl border border-white/10 bg-transparent p-4">
            <img src={content.logoUrl} alt="Logo preview" className="logo-clean mx-auto h-28 w-full object-contain" />
          </div>
          <UploadButton label="Change price photo" helper="Current price photo is shown below." onChange={uploadPriceBackground} />
          <img src={content.priceBackground} alt="Current price block" className="h-40 w-full rounded-2xl border border-white/10 object-cover" />
        </AdminCard>

        <AdminCard title="Premium color controls">
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

        <AdminCard title="Typography controls">
          <div className="grid gap-3 md:grid-cols-2">
            <FontSelect label="Company name font" value={content.companyNameFont} onChange={(v) => updateContent({ companyNameFont: v })} />
            <FontSelect label="Hero title font" value={content.heroTitleFont} onChange={(v) => updateContent({ heroTitleFont: v })} />
            <FontSelect label="Body/paragraph font" value={content.bodyFont} onChange={(v) => updateContent({ bodyFont: v })} />
            <FontSelect label="Project title font" value={content.projectTitleFont} onChange={(v) => updateContent({ projectTitleFont: v })} />
            <FontSelect label="Button font" value={content.buttonFont} onChange={(v) => updateContent({ buttonFont: v })} />
            <FontSelect label="Small label font" value={content.labelFont} onChange={(v) => updateContent({ labelFont: v })} />
          </div>
        </AdminCard>

        <AdminCard title="Integrity banner">
          <Textarea label="Integrity headline" value={content.integrityTitle} onChange={(v) => updateContent({ integrityTitle: v })} />
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="Small script line" value={content.integritySubtitle} onChange={(v) => updateContent({ integritySubtitle: v })} />
            <Input label="Region text" value={content.integrityRegion} onChange={(v) => updateContent({ integrityRegion: v })} />
          </div>
          <Textarea label="Short promise text" value={content.integrityBody} onChange={(v) => updateContent({ integrityBody: v })} />
          <div className="grid gap-3 md:grid-cols-3">
            <Color label="Banner background" value={content.integrityBackgroundColor} onChange={(v) => updateContent({ integrityBackgroundColor: v })} />
            <Color label="Banner accent" value={content.integrityAccentColor} onChange={(v) => updateContent({ integrityAccentColor: v })} />
            <Color label="Banner text" value={content.integrityTextColor} onChange={(v) => updateContent({ integrityTextColor: v })} />
          </div>
        </AdminCard>

        <AdminCard title="Montana service area">
          <Input label="Map section title" value={content.serviceAreaTitle} onChange={(v) => updateContent({ serviceAreaTitle: v })} />
          <Textarea label="Map section text" value={content.serviceAreaText} onChange={(v) => updateContent({ serviceAreaText: v })} />
          <Input label="Highlighted area label" value={content.serviceAreaBadgeText} onChange={(v) => updateContent({ serviceAreaBadgeText: v })} />
          <Textarea label="Town list" value={content.serviceAreaTownsText} onChange={(v) => updateContent({ serviceAreaTownsText: v })} />
        </AdminCard>

        <AdminCard title="Pricing + gallery copy">
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
          <AdminProjectCard key={project.id} project={project} categories={content.categories} updateProject={updateProject} setHomeSlot={setHomeSlot} uploadProjectPhotos={uploadProjectPhotos} reorderProjectPhoto={reorderProjectPhoto} deleteProject={deleteProject} />
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-dashed border-white/20 bg-white/6 p-5 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        <button onClick={addProject} className="w-full rounded-2xl bg-[var(--accent)] px-6 py-4 text-lg font-black text-white shadow-xl shadow-black/30">Add new project</button>
        <p className="mt-3 text-sm text-[var(--muted)]">Adds a blank project at the bottom. It will stay on the Projects page until you assign it to a Home Project slot.</p>
      </div>

      <div className="sticky bottom-4 z-40 mt-8 rounded-[1.7rem] border border-white/10 bg-black/70 p-3 shadow-2xl shadow-black/55 backdrop-blur-2xl">
        <div className="grid grid-cols-2 gap-3">
          <button onClick={cancelChanges} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-black text-white">Cancel edits</button>
          <button onClick={() => save()} className="rounded-2xl bg-[var(--accent)] px-5 py-4 text-sm font-black text-white">Save website</button>
        </div>
      </div>
    </section>
  );
}

function AdminProjectCard({ project, categories, updateProject, setHomeSlot, uploadProjectPhotos, reorderProjectPhoto, deleteProject }: { project: Project; categories: string[]; updateProject: (id: string, p: Partial<Project>) => void; setHomeSlot: (id: string, slot: 1 | 2 | 3 | null) => void; uploadProjectPhotos: (id: string, e: ChangeEvent<HTMLInputElement>) => void; reorderProjectPhoto: (id: string, fromIndex: number, toIndex: number) => void; deleteProject: (id: string) => void }) {
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
        <UploadButton label="Add project photos" helper="Select photos, then use Move left / Move right to reorder and the crop sliders to choose what part shows." multiple onChange={(e) => uploadProjectPhotos(project.id, e)} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {project.photos.map((photo, index) => {
          const focus = getPhotoFocus(project, index).split(" ");
          const focusX = Number((focus[0] || "50%").replace("%", "")) || 50;
          const focusY = Number((focus[1] || "50%").replace("%", "")) || 50;
          return (
            <div
              key={photo + index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2"
              title="Use Move left and Move right to change photo order. Use the sliders to choose what part of the photo shows."
            >
              <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-[.14em] text-white/55">
                <span>Photo {index + 1}</span>
                <span>{project.photos.length} total</span>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img src={photo} alt="Project" className="h-28 w-full object-cover" style={{ objectPosition: getPhotoFocus(project, index) }} />
                <button onClick={() => updateProject(project.id, { photos: project.photos.filter((_, i) => i !== index) })} className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-black text-white shadow-lg backdrop-blur">Remove</button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => reorderProjectPhoto(project.id, index, index - 1)}
                  className="rounded-xl border border-white/10 bg-white/10 px-2 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ← Move left
                </button>
                <button
                  type="button"
                  disabled={index === project.photos.length - 1}
                  onClick={() => reorderProjectPhoto(project.id, index, index + 1)}
                  className="rounded-xl border border-white/10 bg-white/10 px-2 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Move right →
                </button>
              </div>
              <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-black/30 p-2">
                <label className="block text-[10px] font-black uppercase tracking-[.14em] text-[var(--label)]">
                  Crop left / right
                  <input type="range" min="0" max="100" value={focusX} onChange={(e) => updateProject(project.id, { photoFocus: setPhotoFocusValue(project, index, "x", Number(e.target.value)) })} className="mt-1 w-full cursor-pointer accent-rose-700" />
                </label>
                <label className="block text-[10px] font-black uppercase tracking-[.14em] text-[var(--label)]">
                  Crop up / down
                  <input type="range" min="0" max="100" value={focusY} onChange={(e) => updateProject(project.id, { photoFocus: setPhotoFocusValue(project, index, "y", Number(e.target.value)) })} className="mt-1 w-full cursor-pointer accent-rose-700" />
                </label>
              </div>
            </div>
          );
        })}
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

function FontSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/25 p-3">
      <div className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--label)]">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-3 text-sm font-black text-white outline-none">
        {fontOptions.map((font) => (
          <option key={font} value={font} style={{ fontFamily: fontStack(font) }}>
            {font}
          </option>
        ))}
      </select>
      <div className="mt-2 truncate text-lg text-white" style={{ fontFamily: fontStack(value) }}>
        Stutzman's Construction
      </div>
    </label>
  );
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

function ContactButtons({ content, compact = false }: { content: SiteContent; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const phone = normalizePhone(content.phone);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (target && wrapperRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, [open]);
  const buttonClass = compact
    ? "rounded-full bg-[var(--accent)] px-4 py-3 text-xs font-black text-white shadow-2xl shadow-black/45 transition active:scale-[.97]"
    : "rounded-2xl bg-[var(--accent)] px-6 py-3.5 text-base font-black text-white shadow-2xl shadow-black/35 transition active:scale-[.98]";
  const menuClass = compact
    ? "absolute bottom-full right-0 mb-2 w-32 overflow-hidden rounded-2xl border border-white/10 bg-black/82 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl"
    : "absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-white/10 bg-black/82 p-1.5 shadow-2xl shadow-black/60 backdrop-blur-2xl";
  const itemClass = "block w-full rounded-xl px-4 py-3 text-left text-sm font-black text-white transition hover:bg-white/12 active:scale-[.98]";

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <button type="button" onClick={() => setOpen((value) => !value)} style={{ fontFamily: "var(--font-button)" }} className={buttonClass} aria-expanded={open} aria-label="Open contact options">
        Contact
      </button>
      {open && (
        <div className={menuClass}>
          <a aria-label={`Call ${nicePhone(content.phone)}`} title={nicePhone(content.phone)} href={`tel:${phone}`} className={itemClass} onClick={() => setOpen(false)}>Call</a>
          <a aria-label={`Text ${nicePhone(content.phone)}`} title={nicePhone(content.phone)} href={`sms:${phone}`} className={itemClass} onClick={() => setOpen(false)}>Text</a>
          <a aria-label={`Email ${content.email}`} title={content.email} href={`mailto:${content.email}`} className={itemClass} onClick={() => setOpen(false)}>Email</a>
        </div>
      )}
    </div>
  );
}



function IntegrityBanner({ content }: { content: SiteContent }) {
  const values = [
    {
      title: "Quality craftsmanship",
      body: "Straight lines, clean finish work, and pride in every visible detail.",
    },
    {
      title: "Honest communication",
      body: "Clear expectations, practical updates, and straight answers from start to finish.",
    },
    {
      title: "Built for Montana",
      body: "Durable work planned around Montana weather, rural sites, and long-term use.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-9 md:px-7">
      <div
        className="relative overflow-hidden rounded-[2.15rem] border border-white/10 p-5 shadow-2xl shadow-black/50 md:p-8"
        style={{
          background:
            `radial-gradient(circle at 10% 12%, ${content.integrityAccentColor}55, transparent 26%), radial-gradient(circle at 88% 18%, rgba(255,255,255,.11), transparent 25%), radial-gradient(circle at 55% 110%, ${content.integrityAccentColor}30, transparent 38%), linear-gradient(135deg, ${content.integrityBackgroundColor}, #040302 68%)`,
          color: content.integrityTextColor,
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,rgba(0,0,0,.58),transparent)]" />
          <div className="absolute -right-24 top-0 h-full w-1/2 skew-x-[-14deg] border-l border-white/10 bg-white/[.045]" />
          <div className="absolute left-0 top-0 h-full w-full opacity-[.095] bg-[radial-gradient(circle_at_20%_80%,white_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="relative grid gap-5 lg:grid-cols-[.78fr_1.22fr] lg:items-stretch">
          <div className="rounded-[1.7rem] border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/30 backdrop-blur-xl md:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 md:w-16" style={{ backgroundColor: content.integrityAccentColor }} />
              <span className="text-[10px] font-black uppercase tracking-[.32em] opacity-80">Stutzman&apos;s Standard</span>
            </div>
            <h2 className="text-[clamp(2rem,5.2vw,4.2rem)] font-black uppercase leading-[.96] tracking-[-.045em]">
              {content.integrityTitle}
            </h2>
            <div className="mt-7 max-w-xl">
              <div className="font-serif text-[clamp(1.35rem,3vw,2.25rem)] italic leading-tight text-white/90">{content.integritySubtitle}</div>
              <div className="mt-1 break-words font-serif text-[clamp(2.1rem,6vw,4.35rem)] italic leading-[.88]" style={{ color: content.integrityAccentColor }}>
                {content.integrityRegion}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.7rem] border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/25 backdrop-blur-xl md:p-7">
            <div>
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-[1.15rem] bg-white text-3xl font-black text-black shadow-xl shadow-black/35">✓</div>
              <p className="max-w-3xl text-[clamp(1.35rem,3.2vw,2.35rem)] font-black leading-[1.25] tracking-[-.04em] text-white/90">
                {content.integrityBody}
              </p>
              <p className="mt-5 max-w-3xl text-base font-bold leading-8 text-white/64 md:text-lg md:leading-9">
                Every project is handled with steady communication, careful planning, and attention to the details people notice years later. From site prep to final finish, Stutzman&apos;s Construction keeps the work clean, durable, and built for Montana living.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {values.map((item) => (
                <div key={item.title} className="rounded-[1.35rem] border border-white/10 bg-black/30 p-4 shadow-lg shadow-black/20">
                  <div className="text-[10px] font-black uppercase tracking-[.18em] text-white/72">{item.title}</div>
                  <p className="mt-3 text-sm font-bold leading-6 text-white/52">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceAreaSection({ content }: { content: SiteContent }) {
  const [zoomed, setZoomed] = useState(false);
  const [activeTown, setActiveTown] = useState("Eureka");
  const towns = [
    { name: "Roosville", x: "59%", y: "7%", labelX: "59%", labelY: "7%" },
    { name: "West Kootenai", x: "39%", y: "13%", labelX: "39%", labelY: "13%" },
    { name: "Eureka", x: "54%", y: "25%", labelX: "54%", labelY: "25%" },
    { name: "Fortine", x: "68%", y: "48%", labelX: "68%", labelY: "48%" },
    { name: "Trego", x: "75%", y: "59%", labelX: "75%", labelY: "59%" },
    { name: "Stryker", x: "82%", y: "66%", labelX: "82%", labelY: "66%" },
    { name: "Olney", x: "91%", y: "91%", labelX: "91%", labelY: "91%" },
    { name: "Yaak", x: "5%", y: "35%", labelX: "5%", labelY: "35%" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-7">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#060403] shadow-2xl shadow-black/55">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(143,29,44,.30),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(255,255,255,.08),transparent_28%),linear-gradient(135deg,rgba(255,255,255,.06),transparent_35%)]" />
        <div className="relative grid gap-0 lg:grid-cols-[1.02fr_.98fr] lg:items-stretch">
          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            onDoubleClick={() => setZoomed(false)}
            className="group relative min-h-[360px] overflow-hidden bg-black text-left outline-none md:min-h-[500px]"
            aria-label="Tap to zoom the West Kootenai service area map. Double tap to reset."
          >
            <img
              src={content.serviceAreaMapUrl || "/stutzmans-where-we-work-map.png"}
              alt="West Kootenai, Eureka, Fortine, Trego, Stryker, Olney, Roosville, and Yaak service area map"
              className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${zoomed ? "scale-[1.32]" : "scale-100"}`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.08),rgba(0,0,0,.02),rgba(0,0,0,.12)),radial-gradient(circle_at_50%_50%,transparent_0,rgba(0,0,0,.14)_88%)]" />
            <div className="absolute inset-3 rounded-[1.65rem] border border-black/20 shadow-[inset_0_0_55px_rgba(0,0,0,.38)]" />
            <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-black/72 px-4 py-2 text-[10px] font-black uppercase tracking-[.24em] text-white shadow-xl backdrop-blur-xl">Tap map to zoom</span>
              <span className="rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-white/82 shadow-xl backdrop-blur-xl">Double tap resets</span>
            </div>
            {towns.map((town) => (
              <span
                key={town.name}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveTown(town.name);
                }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-[10px] font-black shadow-2xl backdrop-blur-xl transition ${activeTown === town.name ? "border-white bg-white text-black scale-110" : "border-black/25 bg-black/72 text-white hover:bg-black/85"}`}
                style={{ left: town.labelX, top: town.labelY }}
                aria-label={`Select ${town.name}`}
              >
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />{town.name}
              </span>
            ))}
            <div className="absolute bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/10 bg-black/76 p-4 shadow-2xl shadow-black/45 backdrop-blur-xl md:left-auto md:w-[340px] md:p-5">
              <div className="text-[10px] font-black uppercase tracking-[.26em] text-red-200">Selected work area</div>
              <div className="mt-2 text-2xl font-black tracking-[-.04em] text-white md:text-3xl">{activeTown}, Montana</div>
              <p className="mt-2 text-sm font-bold leading-6 text-white/64">Map is limited to the towns shown here so the service area stays clean, accurate, and easy to understand.</p>
            </div>
          </button>

          <div className="relative flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <div className="text-[11px] font-black uppercase tracking-[.34em] text-[var(--label)]">Where we work</div>
            <h2 className="mt-4 text-[clamp(2.25rem,5.7vw,4.7rem)] font-black leading-[.92] tracking-[-.055em] text-[var(--title)]">
              {content.serviceAreaTitle}
            </h2>
            <p className="mt-5 text-base font-bold leading-8 text-[var(--muted)] md:text-lg md:leading-9">
              {content.serviceAreaText}
            </p>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/25 backdrop-blur-xl">
              <div className="text-[10px] font-black uppercase tracking-[.24em] text-[var(--label)]">Primary route</div>
              <div className="mt-2 text-xl font-black text-white">{content.serviceAreaBadgeText}</div>
              <p className="mt-3 text-sm font-bold leading-6 text-white/58">{content.serviceAreaTownsText}</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {towns.map((town) => (
                <button key={town.name} type="button" onClick={() => setActiveTown(town.name)} className={`rounded-2xl border px-3 py-3 text-sm font-black transition active:scale-[.98] ${activeTown === town.name ? "border-white bg-white text-black" : "border-white/10 bg-white/8 text-white/80 hover:bg-white/12"}`}>
                  {town.name}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ContactButtons content={content} compact={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MontanaTributeStrip() {
  const logos = [
    { src: "/montana-tribute/montana-elk-badge.png", alt: "Montana Big Sky Country elk badge", wide: false },
    { src: "/montana-tribute/kootenai-national-forest-plaque.png", alt: "Kootenai National Forest plaque", wide: true },
    { src: "/montana-tribute/montana-big-sky-landscape.png", alt: "Montana Big Sky Country landscape badge", wide: true },
    { src: "/montana-tribute/montana-state-flag-shape.png", alt: "Montana state flag badge", wide: true },
    { src: "/montana-tribute/eureka-lions-logo.png", alt: "Eureka Lions logo", wide: false },
  ];

  return (
    <section aria-label="Montana logos" className="mx-auto max-w-6xl px-5 pb-10 pt-2 md:px-7 md:pb-12">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-5 md:gap-x-10">
        {logos.map((logo) => (
          <img
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            className={`${logo.wide ? "max-h-[74px] md:max-h-[86px]" : "max-h-[82px] md:max-h-[96px]"} w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,.45)] opacity-90 transition duration-300 hover:-translate-y-1 hover:opacity-100`}
          />
        ))}
      </div>
    </section>
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
      <div className="fixed bottom-[4.65rem] right-3 z-50 md:hidden">
        <ContactButtons content={content} compact />
      </div>
    </>
  );
}