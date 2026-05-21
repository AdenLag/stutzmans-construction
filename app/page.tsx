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

const STORAGE_KEY = "stutzmans-construction-site-v11";
const OLD_STORAGE_KEYS = ["stutzmans-construction-site-v10", "stutzmans-construction-site-v9", "stutzmans-construction-site-v8", "stutzmans-construction-site-v7", "stutzmans-construction-site-v6", "stutzmans-construction-site-v5"];
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
    .replaceAll("â€¢", "•")
    .replaceAll("â€¹", "‹")
    .replaceAll("â€º", "›")
    .replaceAll("Ã—", "×")
    .replaceAll("â€™", "’")
    .replaceAll("â€œ", "“")
    .replaceAll("â€", "”")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—");
}


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
  integrityBackgroundColor: "#090708",
  integrityAccentColor: "#9f1239",
  integrityTextColor: "#ffffff",
  integrityTitle: "Built with integrity. Built to last.",
  integritySubtitle: "Proudly serving",
  integrityRegion: "Western Montana",
  integrityBody: "Quality craftsmanship, honest communication, and exceptional results from start to finish.",
  serviceAreaTitle: "Western Montana service area",
  serviceAreaText: "We proudly serve the northwest corner of Montana, including Eureka, Fortine, Trego, Yaak, and nearby communities. If your project is close to this area, reach out and we can confirm availability.",
  serviceAreaTownsText: "Eureka • Fortine • Trego • Yaak • Rexford • surrounding rural properties",
  serviceAreaBadgeText: "Northwest Montana focus area",
  serviceAreaMapUrl: "/stutzmans-service-area-map.png",
  companyNameFont: "Georgia",
  heroTitleFont: "Arial Black",
  bodyFont: "Inter",
  projectTitleFont: "Georgia",
  buttonFont: "Inter",
  labelFont: "Montserrat",
  projectsIntro:
    "Browse homes, remodels, garages, shops, additions, exterior work, and finish details. Each project can hold multiple photos.",
  footerText: "Montana construction company • Custom homes • Remodels • Garages • Exterior finish",
  logoUrl: "/stutzmans-logo-transparent.png",
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
);
}

function MontanaTributeStrip() {
  const logos = [
    { src: "/montana-tribute/montana-state-flag-shape.png", alt: "Montana state badge" },
    { src: "/montana-tribute/montana-mountain-flag-shape.png", alt: "Montana mountain flag badge" },
    { src: "/montana-tribute/montana-big-sky-badge.png", alt: "Montana Big Sky Country badge" },
    { src: "/montana-tribute/montana-elk-badge.png", alt: "Montana elk badge" },
    { src: "/montana-tribute/kootenai-national-forest-badge.png", alt: "Kootenai National Forest badge" },
    { src: "/montana-tribute/montana-406-badge.png", alt: "Montana 406 badge" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 md:px-7">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_15%_10%,rgba(159,18,57,.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025))] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl md:p-7">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:linear-gradient(90deg,rgba(255,255,255,.055),transparent_35%,rgba(159,18,57,.09))]" />
        <div className="relative flex flex-col gap-5">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[.34em] text-[var(--label)]">Montana tribute</div>
            <h2 className="mt-2 text-3xl font-black tracking-[-.055em] text-[var(--title)] md:text-5xl">Built with Big Sky pride.</h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-[var(--muted)] md:text-base">
              A small nod to the state, forests, mountains, and communities that shape the work.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:gap-4">
            {logos.map((logo) => (
              <div key={logo.src} className="group flex min-h-[82px] items-center justify-center rounded-2xl border border-white/10 bg-black/28 p-3 shadow-xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-[62px] max-w-full object-contain opacity-80 grayscale contrast-125 sepia-[.18] saturate-[.65] transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-hover:saturate-100"
                />
              </div>
            ))}
          </div>
        </div>
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

