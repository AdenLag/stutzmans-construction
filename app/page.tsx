"use client";

import { useEffect, useMemo, useState } from "react";

type ProjectPhoto = {
  id: string;
  title: string;
  category: string;
  location: string;
  size: string;
  featured: boolean;
  image: string;
  description: string;
};

const OWNER_PIN = "3026";
const OWNER_PRICE_KEY = "stutzmans-base-price";
const OWNER_PHOTOS_KEY = "stutzmans-project-photos";

const starterPhotos: ProjectPhoto[] = [
  {
    id: "mountain-custom",
    title: "Mountain View Custom Home",
    category: "Custom Home",
    location: "Montana",
    size: "4 Bed • 3 Bath",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    description:
      "A warm, high-end custom build with a strong exterior profile, open living areas, and refined finishes.",
  },
  {
    id: "modern-ranch",
    title: "Modern Ranch Build",
    category: "New Construction",
    location: "Montana",
    size: "Open Concept",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
    description:
      "Clean exterior lines, large windows, practical layout, and a premium family-home feel.",
  },
  {
    id: "craftsman-entry",
    title: "Craftsman Exterior",
    category: "Exterior Finish",
    location: "Montana",
    size: "Premium Detail",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
    description:
      "Detailed trim work, upgraded siding, and curb appeal built to feel timeless.",
  },
  {
    id: "luxury-interior",
    title: "High-End Interior Finish",
    category: "Interior Finish",
    location: "Montana",
    size: "Custom Detail",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
    description:
      "Modern lighting, premium materials, and a clean, comfortable living space.",
  },
  {
    id: "kitchen-build",
    title: "Custom Kitchen Package",
    category: "Kitchen",
    location: "Montana",
    size: "Luxury Finish",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=85",
    description:
      "A showpiece kitchen with strong storage, quality surfaces, and family-friendly flow.",
  },
  {
    id: "garage-shop",
    title: "Garage & Shop Build",
    category: "Garage / Shop",
    location: "Montana",
    size: "Detached Build",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=85",
    description:
      "Functional space for vehicles, tools, equipment, and long-term storage.",
  },
];

function money(value: string) {
  const clean = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(clean) || clean <= 0) return "$275";
  return clean.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function Home() {
  const [page, setPage] = useState<"home" | "projects" | "owner">("home");
  const [basePrice, setBasePrice] = useState("275");
  const [photos, setPhotos] = useState<ProjectPhoto[]>(starterPhotos);
  const [pin, setPin] = useState("");
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [notice, setNotice] = useState("");

  const [newPhoto, setNewPhoto] = useState<ProjectPhoto>({
    id: "",
    title: "",
    category: "Custom Home",
    location: "Montana",
    size: "",
    featured: false,
    image: "",
    description: "",
  });

  useEffect(() => {
    try {
      const savedPrice = localStorage.getItem(OWNER_PRICE_KEY);
      const savedPhotos = localStorage.getItem(OWNER_PHOTOS_KEY);
      if (savedPrice) setBasePrice(savedPrice);
      if (savedPhotos) {
        const parsed = JSON.parse(savedPhotos);
        if (Array.isArray(parsed)) setPhotos(parsed);
      }
    } catch {
      // local editing fallback only
    }
  }, []);

  function savePhotos(next: ProjectPhoto[]) {
    setPhotos(next);
    localStorage.setItem(OWNER_PHOTOS_KEY, JSON.stringify(next));
  }

  function savePrice(value: string) {
    const clean = String(value).replace(/[^0-9]/g, "").slice(0, 6);
    setBasePrice(clean || "275");
    localStorage.setItem(OWNER_PRICE_KEY, clean || "275");
  }

  const featuredPhotos = useMemo(
    () => photos.filter((p) => p.featured).slice(0, 6),
    [photos],
  );

  function unlockOwner() {
    if (pin.trim() !== OWNER_PIN) {
      setNotice("Incorrect owner code.");
      return;
    }
    setOwnerUnlocked(true);
    setNotice("Owner tools unlocked.");
  }

  function addProjectPhoto() {
    if (!newPhoto.title.trim() || !newPhoto.image.trim()) {
      setNotice("Add a project title and image URL first.");
      return;
    }

    const nextPhoto: ProjectPhoto = {
      ...newPhoto,
      id:
        newPhoto.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now(),
      location: newPhoto.location.trim() || "Montana",
      description:
        newPhoto.description.trim() ||
        "Quality construction project completed by Stutzman's Construction.",
    };

    savePhotos([nextPhoto, ...photos]);
    setNewPhoto({
      id: "",
      title: "",
      category: "Custom Home",
      location: "Montana",
      size: "",
      featured: false,
      image: "",
      description: "",
    });
    setNotice("Project photo added.");
  }

  function toggleFeatured(id: string) {
    const next = photos.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p,
    );
    savePhotos(next);
  }

  function removePhoto(id: string) {
    savePhotos(photos.filter((p) => p.id !== id));
    setNotice("Project removed.");
  }

  function resetDemoPhotos() {
    savePhotos(starterPhotos);
    setNotice("Demo photos restored.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070403] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(178,52,28,.42),transparent_34%),radial-gradient(circle_at_90%_15%,rgba(255,190,94,.18),transparent_30%),linear-gradient(135deg,#090403,#170807_40%,#030202)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090403]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => setPage("home")}
            className="group flex items-center gap-3 text-left"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber-400/35 via-red-600/20 to-transparent blur-xl transition group-hover:blur-2xl" />
              <img
                src="/stutzmans-logo.jpeg"
                alt="Stutzman's Construction"
                className="relative h-20 w-20 rounded-[1.55rem] border border-amber-200/25 object-cover shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:h-24 sm:w-24"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.35em] text-amber-200/70">
                Custom Homes
              </p>
              <h1 className="text-lg font-black tracking-tight sm:text-2xl">
                Stutzman&apos;s Construction
              </h1>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {[
              ["home", "Home"],
              ["projects", "Projects"],
              ["owner", "Owner"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key as "home" | "projects" | "owner")}
                className={`rounded-full px-5 py-3 text-sm font-black transition ${
                  page === key
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <a
            href="tel:4060000000"
            className="rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-red-600 px-4 py-3 text-sm font-black text-black shadow-2xl shadow-orange-900/30 transition hover:scale-[1.03] sm:px-6"
          >
            Call Now
          </a>
        </div>
      </header>

      {page === "home" && (
        <>
          <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-amber-200/20 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-amber-100 shadow-xl shadow-black/30 backdrop-blur-xl">
                Premium residential construction
              </div>
              <h2 className="max-w-4xl text-5xl font-black leading-[.92] tracking-[-.06em] sm:text-7xl lg:text-8xl">
                Built strong. Finished clean. Made to feel like home.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Stutzman&apos;s Construction builds custom homes, premium
                interiors, exterior finishes, garages, shops, and high-quality
                residential projects with detail that stands out.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <p className="text-sm font-bold text-white/55">
                    Base starting point
                  </p>
                  <p className="mt-1 text-4xl font-black text-amber-200">
                    {money(basePrice)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/55">
                    per square foot
                  </p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl sm:col-span-2">
                  <p className="text-sm font-bold uppercase tracking-[.2em] text-orange-200/80">
                    Pricing note
                  </p>
                  <p className="mt-2 text-lg font-bold leading-7 text-white/85">
                    Standard builds can start around {money(basePrice)} per
                    square foot. High-end custom homes, premium finishes, large
                    garages, specialty layouts, or unique materials may be
                    higher after the full scope is reviewed.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:stutzmansconstruction@gmail.com"
                  className="rounded-full bg-white px-7 py-4 text-center text-sm font-black text-black shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
                >
                  Request an Estimate
                </a>
                <button
                  onClick={() => setPage("projects")}
                  className="rounded-full border border-white/15 bg-white/10 px-7 py-4 text-sm font-black text-white backdrop-blur-xl transition hover:bg-white/15"
                >
                  View Project Gallery
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[3.5rem] bg-gradient-to-br from-amber-400/25 via-red-700/25 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/10 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
                <img
                  src={featuredPhotos[0]?.image || starterPhotos[0].image}
                  alt="Featured home build"
                  className="h-[470px] w-full rounded-[2.3rem] object-cover"
                />
                <div className="absolute inset-x-6 bottom-6 rounded-[2rem] border border-white/10 bg-black/55 p-5 backdrop-blur-2xl">
                  <p className="text-xs font-black uppercase tracking-[.28em] text-amber-200">
                    Featured build
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    {featuredPhotos[0]?.title || "Custom Home Build"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Modern craftsmanship, dependable structure, and sharp finish
                    details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[.3em] text-amber-200/70">
                  Featured projects
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-[-.04em]">
                  Selected work
                </h2>
              </div>
              <button
                onClick={() => setPage("projects")}
                className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-xl hover:bg-white/15"
              >
                See All
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPhotos.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Custom Homes", "Complete residential builds from planning through finish."],
                ["Premium Finishes", "Interior and exterior details that make the home feel high-end."],
                ["Garages & Shops", "Functional builds for work, storage, equipment, and vehicles."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl"
                >
                  <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-300 to-red-600 shadow-lg shadow-red-950/40" />
                  <h3 className="text-2xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {page === "projects" && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[.3em] text-amber-200/70">
                Project gallery
              </p>
              <h2 className="mt-2 text-5xl font-black tracking-[-.06em] sm:text-7xl">
                Homes & projects
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
                This page can hold all completed homes, builds, remodels,
                garages, and finish work. The owner tools can choose which
                projects appear on the main homepage.
              </p>
            </div>
            <button
              onClick={() => setPage("owner")}
              className="w-fit rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-xl hover:bg-white/15"
            >
              Owner Photo Tools
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((project) => (
              <ProjectCard key={project.id} project={project} large />
            ))}
          </div>
        </section>
      )}

      {page === "owner" && (
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.3em] text-amber-200/70">
              Owner tools
            </p>
            <h2 className="mt-2 text-4xl font-black tracking-[-.05em] sm:text-6xl">
              Website control panel
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/65">
              Hidden owner-only area for changing the visible base price,
              adding project photos, and choosing which projects show on the
              main page.
            </p>

            {!ownerUnlocked ? (
              <div className="mt-8 max-w-md rounded-[2rem] border border-white/10 bg-black/25 p-5">
                <label className="text-sm font-black text-white/70">
                  Owner PIN
                </label>
                <input
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  type="password"
                  placeholder="Enter owner PIN"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35 focus:border-amber-200/50"
                />
                <button
                  onClick={unlockOwner}
                  className="mt-3 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-red-600 px-5 py-4 font-black text-black"
                >
                  Unlock
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-5">
                <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
                  <h3 className="text-2xl font-black">Base price</h3>
                  <p className="mt-2 leading-7 text-white/60">
                    This updates the public pricing section. Current display:
                    <span className="font-black text-amber-200">
                      {" "}
                      {money(basePrice)} / sq ft
                    </span>
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={basePrice}
                      onChange={(e) => savePrice(e.target.value)}
                      inputMode="numeric"
                      className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none focus:border-amber-200/50"
                    />
                    <button
                      onClick={() => savePrice("275")}
                      className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 font-black text-white"
                    >
                      Reset to 275
                    </button>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
                  <h3 className="text-2xl font-black">Add project photo</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input
                      value={newPhoto.title}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, title: e.target.value })
                      }
                      placeholder="Project title"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35"
                    />
                    <input
                      value={newPhoto.category}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, category: e.target.value })
                      }
                      placeholder="Category"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35"
                    />
                    <input
                      value={newPhoto.location}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, location: e.target.value })
                      }
                      placeholder="Location"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35"
                    />
                    <input
                      value={newPhoto.size}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, size: e.target.value })
                      }
                      placeholder="Size / short detail"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35"
                    />
                    <input
                      value={newPhoto.image}
                      onChange={(e) =>
                        setNewPhoto({ ...newPhoto, image: e.target.value })
                      }
                      placeholder="Image URL"
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35 sm:col-span-2"
                    />
                    <textarea
                      value={newPhoto.description}
                      onChange={(e) =>
                        setNewPhoto({
                          ...newPhoto,
                          description: e.target.value,
                        })
                      }
                      placeholder="Project description"
                      className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-white outline-none placeholder:text-white/35 sm:col-span-2"
                    />
                    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-bold text-white/80">
                      <input
                        checked={newPhoto.featured}
                        onChange={(e) =>
                          setNewPhoto({
                            ...newPhoto,
                            featured: e.target.checked,
                          })
                        }
                        type="checkbox"
                        className="h-5 w-5"
                      />
                      Show on main page
                    </label>
                    <button
                      onClick={addProjectPhoto}
                      className="rounded-2xl bg-gradient-to-r from-amber-300 to-red-600 px-5 py-4 font-black text-black"
                    >
                      Add Project
                    </button>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <h3 className="text-2xl font-black">Manage projects</h3>
                    <button
                      onClick={resetDemoPhotos}
                      className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white"
                    >
                      Restore demo photos
                    </button>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {photos.map((project) => (
                      <div
                        key={project.id}
                        className="grid gap-3 rounded-2xl border border-white/10 bg-white/8 p-3 sm:grid-cols-[92px_1fr_auto]"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-24 w-full rounded-xl object-cover sm:w-24"
                        />
                        <div>
                          <p className="font-black">{project.title}</p>
                          <p className="text-sm text-white/55">
                            {project.category} • {project.location}
                          </p>
                          <p className="mt-1 text-xs font-bold text-amber-200/80">
                            {project.featured
                              ? "Shows on main page"
                              : "Gallery page only"}
                          </p>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <button
                            onClick={() => toggleFeatured(project.id)}
                            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-black"
                          >
                            {project.featured ? "Hide Main" : "Add Main"}
                          </button>
                          <button
                            onClick={() => removePhoto(project.id)}
                            className="rounded-xl bg-red-500/20 px-3 py-2 text-xs font-black text-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {notice && (
              <p className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/10 px-4 py-3 font-bold text-amber-100">
                {notice}
              </p>
            )}
          </div>
        </section>
      )}

      <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xl font-black">Stutzman&apos;s Construction</p>
              <p className="mt-1 text-sm text-white/55">
                stutzmansconstruction@gmail.com
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPage("home")}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/70"
              >
                Home
              </button>
              <button
                onClick={() => setPage("projects")}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/70"
              >
                Projects
              </button>
              <button
                onClick={() => setPage("owner")}
                className="rounded-full bg-white/5 px-4 py-2 text-xs font-black text-white/25 transition hover:bg-white/10 hover:text-white/70"
                title="Owner area"
              >
                Owner
              </button>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center md:hidden">
        <div className="grid w-full max-w-sm grid-cols-3 rounded-[1.5rem] border border-white/10 bg-black/65 p-1 shadow-2xl shadow-black/70 backdrop-blur-2xl">
          <button
            onClick={() => setPage("home")}
            className={`rounded-[1.15rem] py-3 text-xs font-black ${
              page === "home" ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("projects")}
            className={`rounded-[1.15rem] py-3 text-xs font-black ${
              page === "projects" ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Photos
          </button>
          <button
            onClick={() => setPage("owner")}
            className={`rounded-[1.15rem] py-3 text-xs font-black ${
              page === "owner" ? "bg-white text-black" : "text-white/60"
            }`}
          >
            Owner
          </button>
        </div>
      </div>
    </main>
  );
}

function ProjectCard({
  project,
  large = false,
}: {
  project: ProjectPhoto;
  large?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-[2.1rem] border border-white/10 bg-white/10 shadow-2xl shadow-black/35 backdrop-blur-xl">
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className={`${large ? "h-72" : "h-60"} w-full object-cover transition duration-700 group-hover:scale-110`}
        />
        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-2 text-xs font-black uppercase tracking-[.16em] text-amber-100 backdrop-blur-xl">
          {project.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-black tracking-[-.03em]">
            {project.title}
          </h3>
          <p className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/60">
            {project.location}
          </p>
        </div>
        {project.size && (
          <p className="mt-2 text-sm font-black text-amber-200/80">
            {project.size}
          </p>
        )}
        <p className="mt-3 leading-7 text-white/62">{project.description}</p>
      </div>
    </article>
  );
}
