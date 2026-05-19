"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ProjectPhoto = {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  year: string;
  note: string;
  featured?: boolean;
};

const PHONE = "406-607-7888";
const EMAIL = "stutzmansconstruction@gmail.com";

const starterProjects: ProjectPhoto[] = [
  {
    id: "custom-home-1",
    title: "Mountain View Custom Home",
    category: "Custom Home",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
    year: "2026",
    note: "Full custom exterior with premium roof lines, clean finish work, and modern curb appeal.",
    featured: true,
  },
  {
    id: "barndominium-1",
    title: "Modern Ranch Build",
    category: "New Build",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1600&auto=format&fit=crop",
    year: "2025",
    note: "Open-concept build with strong framing, warm materials, and durable exterior finishes.",
  },
  {
    id: "interior-1",
    title: "Luxury Interior Finish",
    category: "Remodel",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
    year: "2025",
    note: "Premium trim, clean wall lines, detailed finish work, and bright open living space.",
  },
  {
    id: "kitchen-1",
    title: "Kitchen Upgrade",
    category: "Kitchen",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=1600&auto=format&fit=crop",
    year: "2024",
    note: "Custom kitchen work with clean cabinets, modern lighting, and durable surfaces.",
  },
  {
    id: "deck-1",
    title: "Outdoor Living Deck",
    category: "Decks",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1600&auto=format&fit=crop",
    year: "2024",
    note: "Outdoor living upgrade built for family gatherings, views, and long-lasting use.",
  },
  {
    id: "roof-1",
    title: "Exterior Refresh",
    category: "Exterior",
    location: "Montana",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1600&auto=format&fit=crop",
    year: "2024",
    note: "Exterior improvement with a stronger first impression and clean construction detail.",
  },
];

const services = [
  "Custom homes",
  "New construction",
  "Remodels",
  "Additions",
  "Framing",
  "Roofing",
  "Decks",
  "Siding",
  "Finish work",
  "Project planning",
];

const process = [
  ["01", "Walkthrough", "We look at the property, listen to what you want, and help shape the plan."],
  ["02", "Clear estimate", "You get a clean scope, timeline expectations, and honest communication."],
  ["03", "Build", "The job is handled with strong craftsmanship, clean work, and steady updates."],
  ["04", "Final detail", "We finish strong with the little details that make the build feel complete."],
];

function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectPhoto[]>(starterProjects);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<ProjectPhoto | null>(null);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [draft, setDraft] = useState({ title: "", category: "Custom Home", location: "Montana", year: "2026", note: "" });
  const [draftImage, setDraftImage] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("stutzmans-project-gallery-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setProjects(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stutzmans-project-gallery-v1", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (window.location.hash === "#owner-upload") setOwnerOpen(true);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const visibleProjects = activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory);
  const featured = projects.find((p) => p.featured) || projects[0];

  function addProject() {
    if (!draft.title.trim() || !draftImage) return alert("Add a title and photo first.");
    const next: ProjectPhoto = {
      id: `project-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category.trim() || "Project",
      location: draft.location.trim() || "Montana",
      image: draftImage,
      year: draft.year.trim() || new Date().getFullYear().toString(),
      note: draft.note.trim() || "Recently completed project by Stutzman's Construction.",
      featured: false,
    };
    setProjects((prev) => [next, ...prev]);
    setDraft({ title: "", category: "Custom Home", location: "Montana", year: "2026", note: "" });
    setDraftImage("");
  }

  function handleFile(file?: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function removeProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080605] text-white selection:bg-red-900/60">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(120,22,42,.45),transparent_28%),radial-gradient(circle_at_80%_4%,rgba(255,255,255,.08),transparent_24%),linear-gradient(140deg,#090605,#15100e_44%,#050505)]" />
      <div className="fixed inset-0 -z-10 opacity-[.18] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:44px_44px]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src="/stutzmans-logo.jpeg" alt="Stutzman's Construction" className="h-12 w-16 rounded-2xl object-cover ring-1 ring-white/15" />
            <div>
              <div className="text-sm font-black uppercase tracking-[.22em] text-white/95">Stutzman's</div>
              <div className="text-[11px] font-bold uppercase tracking-[.28em] text-red-200/70">Construction</div>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-white/70 md:flex">
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#process" className="hover:text-white">Process</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href={`tel:${PHONE.replace(/-/g, "")}`} className="rounded-full bg-white px-4 py-2 text-sm font-black text-black shadow-2xl shadow-red-950/40 transition hover:scale-[1.03]">
            Call {PHONE}
          </a>
        </div>
      </header>

      <section id="top" className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.05fr_.95fr] md:pb-24 md:pt-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-red-100 shadow-2xl backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.8)]" /> Montana construction company
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[.92] tracking-[-.06em] text-white md:text-7xl lg:text-8xl">
            Built strong. Finished clean. Made to stand out.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
            Stutzman's Construction builds custom homes, remodels, additions, decks, roofing, siding, and detailed finish work with a clean, premium look from first walkthrough to final detail.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${PHONE.replace(/-/g, "")}`} className="rounded-2xl bg-[#7b1830] px-6 py-4 text-center font-black text-white shadow-2xl shadow-red-950/50 transition hover:scale-[1.02] hover:bg-[#8f1e39]">
              Start a project
            </a>
            <a href="#work" className="rounded-2xl border border-white/12 bg-white/8 px-6 py-4 text-center font-black text-white backdrop-blur-xl transition hover:bg-white/14">
              View completed work
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {["Custom Builds", "Remodels", "Exterior Work"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[.06] p-4 text-center backdrop-blur-xl">
                <div className="text-sm font-black text-white">{item}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/45">Premium finish</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-red-900/40 via-white/5 to-black blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/12 bg-white/8 p-3 shadow-2xl shadow-black/70 backdrop-blur-2xl">
            <img src={featured.image} alt={featured.title} className="h-[560px] w-full rounded-[2rem] object-cover" />
            <div className="absolute inset-x-6 bottom-6 rounded-[2rem] border border-white/12 bg-black/55 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[.22em] text-red-100/80">Featured project</div>
                  <h2 className="mt-1 text-2xl font-black tracking-[-.04em]">{featured.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/68">{featured.note}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-black">{featured.year}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="text-sm font-black uppercase tracking-[.28em] text-red-200/70">Project gallery</div>
            <h2 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-6xl">Homes and projects</h2>
            <p className="mt-4 max-w-2xl text-white/65">Temporary showcase photos are in place now. The owner upload portal can replace these with real completed homes.</p>
          </div>
          <button onClick={() => setOwnerOpen(true)} className="rounded-2xl border border-white/12 bg-white/8 px-5 py-3 text-sm font-black text-white backdrop-blur-xl hover:bg-white/14">
            Owner photo upload
          </button>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cx("shrink-0 rounded-full px-4 py-2 text-sm font-black transition", activeCategory === cat ? "bg-white text-black" : "border border-white/10 bg-white/7 text-white/70 hover:text-white")}>
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <button key={project.id} onClick={() => setSelected(project)} className={cx("group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.06] text-left shadow-2xl shadow-black/30 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[.09]", index === 0 && activeCategory === "All" ? "lg:col-span-2" : "") }>
              <div className="relative h-72 overflow-hidden">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-black uppercase tracking-widest backdrop-blur-xl">{project.category}</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black tracking-[-.04em]">{project.title}</h3>
                  <p className="mt-1 text-sm text-white/70">{project.location} • {project.year}</p>
                </div>
              </div>
              <p className="p-5 text-sm leading-6 text-white/65">{project.note}</p>
            </button>
          ))}
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-10">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="text-sm font-black uppercase tracking-[.28em] text-red-200/70">What we do</div>
              <h2 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-5xl">Construction with a high-end finish.</h2>
              <p className="mt-4 leading-7 text-white/65">Clean communication, strong workmanship, and the kind of detail that makes the project feel professional.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <div key={service} className="rounded-3xl border border-white/10 bg-black/25 p-4 font-black text-white/88">
                  <span className="mr-2 text-red-300">✓</span>{service}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-5 py-16">
        <div className="text-sm font-black uppercase tracking-[.28em] text-red-200/70">How it works</div>
        <h2 className="mt-3 text-4xl font-black tracking-[-.05em] md:text-6xl">Simple process. Serious result.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {process.map(([num, title, text]) => (
            <div key={num} className="rounded-[2rem] border border-white/10 bg-white/[.06] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <div className="text-5xl font-black tracking-[-.08em] text-red-200/25">{num}</div>
              <h3 className="mt-4 text-xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-5 py-16 pb-24">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#7b1830] via-[#1a0d0d] to-black p-8 shadow-2xl shadow-black/60 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr] md:items-center">
            <div>
              <h2 className="text-4xl font-black tracking-[-.05em] md:text-6xl">Ready to talk about your build?</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/72">Call, text, or email Stutzman's Construction and start with a walkthrough.</p>
            </div>
            <div className="grid gap-3">
              <a href={`tel:${PHONE.replace(/-/g, "")}`} className="rounded-2xl bg-white px-6 py-4 text-center font-black text-black">Call {PHONE}</a>
              <a href={`mailto:${EMAIL}`} className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-center font-black text-white backdrop-blur-xl">{EMAIL}</a>
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-xl" onClick={() => setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-[#100c0b] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={selected.image} alt={selected.title} className="max-h-[68vh] w-full object-cover" />
            <div className="p-6">
              <div className="text-xs font-black uppercase tracking-[.22em] text-red-200/70">{selected.category} • {selected.location} • {selected.year}</div>
              <h3 className="mt-2 text-3xl font-black tracking-[-.04em]">{selected.title}</h3>
              <p className="mt-3 leading-7 text-white/70">{selected.note}</p>
              <button onClick={() => setSelected(null)} className="mt-5 rounded-2xl bg-white px-5 py-3 font-black text-black">Close</button>
            </div>
          </div>
        </div>
      )}

      {ownerOpen && (
        <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/80 p-4 backdrop-blur-xl">
          <div className="mx-auto my-8 max-w-4xl rounded-[2rem] border border-white/12 bg-[#100c0b] p-5 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[.22em] text-red-200/70">Private owner area</div>
                <h3 className="mt-2 text-3xl font-black tracking-[-.04em]">Upload project photos</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">Temporary browser-based upload portal. For production owner uploads across all devices, connect this to Supabase Storage next.</p>
              </div>
              <button onClick={() => setOwnerOpen(false)} className="rounded-full bg-white/10 px-4 py-2 font-black">✕</button>
            </div>

            {!unlocked ? (
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[.06] p-5">
                <p className="text-sm text-white/70">Enter owner PIN. Temporary PIN is <b>7888</b>.</p>
                <div className="mt-4 flex gap-3">
                  <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Owner PIN" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                  <button onClick={() => pin === "7888" ? setUnlocked(true) : alert("Wrong PIN")} className="rounded-2xl bg-white px-5 py-3 font-black text-black">Unlock</button>
                </div>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-[.9fr_1.1fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[.06] p-5">
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
                  <button onClick={() => fileRef.current?.click()} className="flex h-56 w-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 bg-black/25 text-center font-black text-white/70">
                    {draftImage ? <img src={draftImage} alt="Preview" className="h-full w-full rounded-[1.5rem] object-cover" /> : "Choose project photo"}
                  </button>
                  <div className="mt-4 grid gap-3">
                    <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Project title" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                    <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} placeholder="Category" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Location" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                      <input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} placeholder="Year" className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                    </div>
                    <textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Short project note" className="min-h-28 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 font-bold outline-none" />
                    <button onClick={addProject} className="rounded-2xl bg-[#7b1830] px-5 py-4 font-black text-white">Add to website gallery</button>
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/[.06] p-5">
                  <h4 className="text-xl font-black">Current website photos</h4>
                  <div className="mt-4 grid gap-3">
                    {projects.map((project) => (
                      <div key={project.id} className="flex gap-3 rounded-2xl bg-black/25 p-3">
                        <img src={project.image} alt={project.title} className="h-16 w-20 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-black">{project.title}</div>
                          <div className="text-xs text-white/50">{project.category}</div>
                        </div>
                        <button onClick={() => removeProject(project.id)} className="rounded-xl bg-red-950/70 px-3 text-sm font-black">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
