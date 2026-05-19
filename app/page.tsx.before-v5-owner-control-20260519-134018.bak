"use client";

import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  size: string;
  featured: boolean;
  photos: string[];
};

const OWNER_PIN = "3026";
const PHONE_DISPLAY = "406-607-7888";
const PHONE_LINK = "tel:4066077888";
const EMAIL = "stutzmansconstruction@gmail.com";

const starterProjects: Project[] = [
  {
    id: "mountain-modern",
    title: "Mountain Modern Custom Home",
    location: "Montana",
    category: "Finished Home",
    size: "Custom home build",
    featured: true,
    description:
      "A clean modern home concept with warm exterior materials, sharp roof lines, oversized glass, and a premium finished feel.",
    photos: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1800&q=85",
    ],
  },
  {
    id: "timber-entry",
    title: "Timber Entry & Exterior Detail",
    location: "Montana",
    category: "Exterior Finish",
    size: "Premium finish package",
    featured: true,
    description:
      "Heavy timber accents, stone-inspired textures, and strong curb appeal for a finished home that feels custom from the driveway.",
    photos: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1800&q=85",
    ],
  },
  {
    id: "shop-garage",
    title: "Garage, Shop & Utility Builds",
    location: "Montana",
    category: "Garage / Shop",
    size: "Detached or attached",
    featured: false,
    description:
      "Practical structures built clean and strong — garages, shops, utility spaces, additions, and work-ready layouts.",
    photos: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1597002851479-3e3e60ad6142?auto=format&fit=crop&w=1800&q=85",
    ],
  },
  {
    id: "remodel-finish",
    title: "Interior Remodel & Finish Work",
    location: "Montana",
    category: "Remodel",
    size: "Scope priced after review",
    featured: false,
    description:
      "Remodels, finish upgrades, layout improvements, and detail work priced by scope — often lower than full custom-home pricing.",
    photos: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=85",
    ],
  },
];

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function ProjectPhotoSlider({ project }: { project: Project }) {
  const [index, setIndex] = useState(0);
  const photos = project.photos?.length ? project.photos : starterProjects[0].photos;
  const current = photos[index] || photos[0];

  function move(dir: number) {
    setIndex((prev) => (prev + dir + photos.length) % photos.length);
  }

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950 shadow-2xl shadow-black/50">
      <img
        src={current}
        alt={project.title}
        className="h-[310px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[430px]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

      {photos.length > 1 && (
        <>
          <button
            onClick={() => move(-1)}
            aria-label="Previous project photo"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-2xl text-white opacity-100 shadow-xl backdrop-blur-xl transition hover:bg-white/20 active:scale-95 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={() => move(1)}
            aria-label="Next project photo"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-2xl text-white opacity-100 shadow-xl backdrop-blur-xl transition hover:bg-white/20 active:scale-95 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100"
          >
            ›
          </button>
          <div className="absolute bottom-5 right-5 flex gap-1.5">
            {photos.map((_, dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => setIndex(dotIndex)}
                aria-label={`Show photo ${dotIndex + 1}`}
                className={`h-1.5 rounded-full transition ${
                  dotIndex === index ? "w-8 bg-white" : "w-2 bg-white/45"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
        <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white/85 backdrop-blur-xl">
          {project.category}
        </div>
        <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
          {project.description}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState<"home" | "projects">("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [price, setPrice] = useState("$275");
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftPhotos, setDraftPhotos] = useState("");

  useEffect(() => {
    setPrice(readStored("stutzmans-price", "$275"));
    setProjects(readStored("stutzmans-projects", starterProjects));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("stutzmans-price", JSON.stringify(price));
      localStorage.setItem("stutzmans-projects", JSON.stringify(projects));
    }
  }, [price, projects]);

  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured).slice(0, 3),
    [projects],
  );

  function unlockOwner() {
    if (pinInput.trim() === OWNER_PIN) {
      setOwnerUnlocked(true);
      setPinInput("");
    } else {
      alert("Incorrect owner code.");
    }
  }

  function addProject() {
    const urls = draftPhotos
      .split(/\n|,/)
      .map((x) => x.trim())
      .filter(Boolean);

    if (!draftTitle.trim() || !urls.length) {
      alert("Add a project name and at least one photo URL.");
      return;
    }

    setProjects((prev) => [
      {
        id: `project-${Date.now()}`,
        title: draftTitle.trim(),
        location: "Montana",
        category: "Project",
        size: "Custom scope",
        featured: true,
        description: "A Stutzman's Construction project gallery with multiple photos.",
        photos: urls,
      },
      ...prev,
    ]);
    setDraftTitle("");
    setDraftPhotos("");
  }

  function toggleFeatured(id: string) {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, featured: !project.featured } : project,
      ),
    );
  }

  function removeProject(id: string) {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080605] pb-24 text-white sm:pb-0">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(133,28,28,.45),transparent_34%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,.10),transparent_24%),linear-gradient(135deg,#050505,#17100d_45%,#050505)]" />
        <div className="absolute inset-0 opacity-[.18] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:44px_44px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-3">
          <button onClick={() => setPage("home")} className="flex min-w-0 items-center gap-3 text-left">
            <img
              src="/stutzmans-logo.jpeg"
              alt="Stutzman's Construction"
              className="h-16 w-24 shrink-0 object-contain drop-shadow-[0_12px_34px_rgba(0,0,0,.85)] md:h-24 md:w-36"
            />
            <div className="min-w-0">
              <p className="hidden text-[9px] font-black uppercase tracking-[0.30em] text-red-200/70 sm:block">
                Custom Homes • Remodels • Garages
              </p>
              <h1 className="text-xl font-black leading-tight tracking-tight md:text-3xl">
                Stutzman&apos;s Construction
              </h1>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-2">
            <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl sm:flex">
              <button
                onClick={() => setPage("home")}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  page === "home" ? "bg-white text-black" : "text-white/75 hover:bg-white/10"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setPage("projects")}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  page === "projects" ? "bg-white text-black" : "text-white/75 hover:bg-white/10"
                }`}
              >
                Projects
              </button>
            </nav>

            <a
              href={PHONE_LINK}
              className="rounded-full bg-white px-4 py-2.5 text-sm font-black text-black shadow-xl shadow-white/10 transition hover:scale-[1.02] active:scale-95 md:px-5"
            >
              Call now
            </a>
          </div>
        </div>
      </header>

      <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center border-t border-white/10 bg-black/70 px-4 pb-[calc(env(safe-area-inset-bottom)+.7rem)] pt-2 backdrop-blur-2xl sm:hidden">
        <div className="grid w-full max-w-sm grid-cols-2 rounded-full border border-white/10 bg-white/8 p-1 shadow-2xl shadow-black/60">
          <button
            onClick={() => setPage("home")}
            className={`rounded-full py-3 text-sm font-black transition ${page === "home" ? "bg-white text-black" : "text-white/70"}`}
          >
            Home
          </button>
          <button
            onClick={() => setPage("projects")}
            className={`rounded-full py-3 text-sm font-black transition ${page === "projects" ? "bg-white text-black" : "text-white/70"}`}
          >
            Projects
          </button>
        </div>
      </div>

      {page === "home" ? (
        <>
          <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.05fr_.95fr] md:px-8 md:pb-24 md:pt-16">
            <div className="flex flex-col justify-center">
              <div className="mb-7 inline-flex w-fit rounded-full border border-red-300/20 bg-red-950/30 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-red-100 shadow-2xl shadow-red-950/30 backdrop-blur-xl">
                Montana craftsmanship built right
              </div>

              <h2 className="text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-7xl lg:text-8xl">
                Built clean.
                <span className="block bg-gradient-to-r from-red-200 via-white to-stone-300 bg-clip-text text-transparent">
                  Finished strong.
                </span>
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
                Stutzman&apos;s Construction builds finished homes, remodels, garages,
                additions, shops, and custom projects with a premium eye for structure,
                finish, and long-term value.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={PHONE_LINK}
                  className="rounded-2xl bg-white px-6 py-4 text-center text-base font-black text-black shadow-2xl shadow-white/10 transition hover:scale-[1.02]"
                >
                  Call {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-center text-base font-black text-white backdrop-blur-xl transition hover:bg-white/15"
                >
                  Email for an estimate
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-red-700/30 via-white/5 to-stone-600/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/8 p-3 shadow-2xl shadow-black/60 backdrop-blur-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85"
                  alt="Custom construction home"
                  className="h-[520px] w-full rounded-[2.4rem] object-cover"
                />
                <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/15 bg-black/45 p-5 backdrop-blur-2xl">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">
                    Finished-home pricing
                  </p>
                  <p className="mt-2 text-3xl font-black">{price}/sq ft starting point</p>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    Full finished homes can start around {price} per square foot.
                    Remodels, garages, shops, additions, and smaller scope work can
                    be lower depending on materials, finish level, access, and design.
                    High-end custom homes, premium finishes, large garages, specialty
                    layouts, or unique materials may be higher after the full scope is reviewed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-200/70">
                  Featured work
                </p>
                <h2 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">
                  Featured projects
                </h2>
              </div>
              <button
                onClick={() => setPage("projects")}
                className="w-fit rounded-2xl border border-white/15 bg-white/8 px-5 py-3 text-sm font-black backdrop-blur-xl hover:bg-white/15"
              >
                View all projects →
              </button>
            </div>

            <div className="grid gap-6">
              {featuredProjects.map((project) => (
                <ProjectPhotoSlider key={project.id} project={project} />
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Custom homes", "Finished homes with strong structure and premium detail."],
                ["Remodels", "Interior and exterior upgrades priced by real project scope."],
                ["Garages & shops", "Attached, detached, utility, storage, and work spaces."],
                ["Finish work", "Trim, exterior detail, layouts, and clean final touches."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[2rem] border border-white/10 bg-white/7 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mx-auto max-w-7xl px-4 pb-28 pt-16 md:px-8 md:pb-10">
            <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 text-center backdrop-blur-xl">
              <p className="text-sm text-white/60">
                Stutzman&apos;s Construction • {PHONE_DISPLAY} • {EMAIL}
              </p>

              <span
                onClick={() => setAdminOpen((x) => !x)}
                className="mt-3 inline-block cursor-default select-none text-sm text-white/18 transition hover:text-white/35"
                role="button"
                aria-label="Owner access"
              >
                owner portal
              </span>

              {adminOpen && (
                <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-white/10 bg-black/70 p-4 text-left">
                  {!ownerUnlocked ? (
                    <div className="flex gap-2">
                      <input
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        type="password"
                        placeholder="Owner code"
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                      />
                      <button onClick={unlockOwner} className="rounded-xl bg-white px-4 py-3 font-black text-black">
                        Unlock
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-black uppercase tracking-[0.22em] text-white/50">
                          Finished home base price
                        </label>
                        <input
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="New project title"
                          className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                        />
                        <textarea
                          value={draftPhotos}
                          onChange={(e) => setDraftPhotos(e.target.value)}
                          placeholder="Paste multiple photo URLs, separated by commas or new lines"
                          className="min-h-28 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                        />
                      </div>
                      <button onClick={addProject} className="rounded-xl bg-white px-5 py-3 font-black text-black">
                        Add project with photos
                      </button>

                      <div className="space-y-2">
                        {projects.map((project) => (
                          <div key={project.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 p-3">
                            <span className="text-sm font-bold">{project.title}</span>
                            <div className="flex gap-2">
                              <button onClick={() => toggleFeatured(project.id)} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-black">
                                {project.featured ? "Hide from home" : "Feature on home"}
                              </button>
                              <button onClick={() => removeProject(project.id)} className="rounded-lg bg-red-500/20 px-3 py-2 text-xs font-black text-red-100">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </footer>
        </>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-200/70">
              Project gallery
            </p>
            <h2 className="mt-2 text-5xl font-black tracking-tight md:text-7xl">
              All projects
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
              Browse homes, remodels, garages, shops, additions, and finish work.
              Each project can hold multiple photos.
            </p>
          </div>

          <div className="grid gap-7">
            {projects.map((project) => (
              <ProjectPhotoSlider key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
