import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { driver, directives, setup, standings, wins } from "@/lib/prototype-data";

const featured = wins.filter((project) => project.featured).slice(0, 4);

export default function Home() {
  return (
    <main className="portfolio min-h-screen bg-[#090a0b] text-[#f0f0ec] selection:bg-[#c8ff62] selection:text-[#10120b]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a href="#top" className="font-mono text-xs tracking-[0.2em] text-white/80">SJ<span className="text-[#c8ff62]">.</span></a>
        <nav className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 md:flex">
          <a className="hover:text-white" href="#work">Selected work</a><a className="hover:text-white" href="#experience">Experience</a><a className="hover:text-white" href="#about">About</a>
        </nav>
        <Link href="/f1/" className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 transition hover:border-[#c8ff62]/60 hover:text-[#c8ff62]">F1 version <ArrowUpRight size={13} /></Link>
      </header>

      <section id="top" className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center overflow-hidden px-6 pb-20 pt-16 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-[-8rem] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-white/[0.055] lg:block" />
        <div className="pointer-events-none absolute right-[-2rem] top-1/2 hidden h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-white/[0.07] lg:block" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45"><span className="h-px w-8 bg-[#c8ff62]" />Independent engineer · Urbana-Champaign, Illinois</p>
          <h1 className="max-w-4xl text-[clamp(4.25rem,11.2vw,10rem)] font-medium leading-[0.82] tracking-[-0.085em]">Shubh<br /><span className="text-white/35">Jain</span></h1>
          <div className="mt-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <p className="max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">I build intelligent systems, thoughtful products, and tools that make complex ideas useful.</p>
            <a href="#work" aria-label="Explore selected work" className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 transition hover:border-[#c8ff62] hover:bg-[#c8ff62] hover:text-black"><ArrowDown size={17} className="transition group-hover:translate-y-0.5" /></a>
          </div>
        </div>
        <div className="relative z-10 mt-20 grid grid-cols-2 border-t border-white/10 pt-5 text-xs sm:grid-cols-4">
          {[["01", "Computer Science", "University of Illinois"], ["02", "AI systems", "Research & engineering"], ["03", "3.83 / 4.00", "Cumulative GPA"], ["04", "Open to", "Internship opportunities"]].map(([n, label, detail]) => <div key={n} className="border-l border-white/10 py-2 pl-4 first:border-0 first:pl-0 sm:pl-6"><span className="font-mono text-[9px] text-[#c8ff62]">{n}</span><p className="mt-3 text-sm text-white/85">{label}</p><p className="mt-1 text-xs text-white/40">{detail}</p></div>)}
        </div>
      </section>

      <section id="work" className="border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between"><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8ff62]">01 / Selected work</p><h2 className="text-4xl font-medium tracking-[-0.055em] sm:text-6xl">Built with intent.</h2></div><span className="hidden font-mono text-[10px] text-white/35 sm:block">2024 — 2026</span></div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {featured.map((project, i) => <article key={project.id} className="group grid gap-5 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center sm:gap-8"><span className="font-mono text-xs text-white/30">0{i + 1}</span><div><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className="text-xl tracking-tight sm:text-2xl">{project.name}</h3><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">{project.year} · {project.role}</span></div><p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/48">{project.overview}</p><div className="mt-3 flex flex-wrap gap-2">{project.tech.slice(0, 4).map((tech) => <span key={tech} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] text-white/45">{tech}</span>)}</div></div><div className="flex gap-3 sm:opacity-0 sm:transition sm:group-hover:opacity-100">{project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#c8ff62]">{link.label}<ArrowUpRight size={12} /></a>)}</div></article>)}
          </div>
        </div>
      </section>

      <section id="experience" className="border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8ff62]">02 / Experience</p><h2 className="max-w-md text-4xl font-medium leading-[1.02] tracking-[-0.06em] sm:text-6xl">Curiosity, put to work.</h2><p className="mt-6 max-w-sm text-sm leading-relaxed text-white/45">Engineering across AI, research, and product teams — from early-stage ideas to dependable systems.</p></div>
          <div className="divide-y divide-white/10 border-y border-white/10">{standings.slice(0, 4).map((role) => <article key={`${role.team}-${role.period}`} className="py-6"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline"><h3 className="text-lg">{role.team}</h3><span className="font-mono text-[10px] text-white/35">{role.period}</span></div><p className="mt-1 text-sm text-[#c8ff62]/80">{role.role}</p><p className="mt-3 text-sm leading-relaxed text-white/45">{role.note}</p></article>)}</div>
        </div>
      </section>

      <section id="about" className="border-t border-white/10 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8ff62]">03 / About</p><h2 className="text-4xl font-medium tracking-[-0.06em] sm:text-6xl">Systems thinker.<br />Hands-on builder.</h2></div>
          <div><p className="max-w-2xl text-lg leading-relaxed text-white/60">{driver.intro}</p><div className="mt-9 grid gap-8 border-t border-white/10 pt-7 sm:grid-cols-2"><div><p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Research & writing</p>{directives.filter((x) => x.kind === "Paper" || x.kind === "Book" || x.kind === "Patent").slice(0, 4).map((item) => <p key={item.title} className="mb-2 text-sm text-white/65">{item.title}<span className="ml-2 font-mono text-[9px] text-white/30">{item.year}</span></p>)}</div><div><p className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Selected tools</p>{setup.slice(0, 4).map((group) => <p key={group.unit} className="mb-2 text-sm text-white/65"><span className="text-white/35">{group.unit} / </span>{group.parts.slice(0, 4).join(" · ")}</p>)}</div></div></div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c8ff62]">Have a good problem?</p><a href={`mailto:${driver.email}`} className="mt-4 block text-3xl tracking-[-0.05em] transition hover:text-[#c8ff62] sm:text-5xl">Let&apos;s talk.</a><p className="mt-3 text-sm text-white/40">{driver.email}</p></div><div className="flex items-center gap-5">{[{ href: driver.github, label: "GitHub", Icon: Github }, { href: driver.linkedin, label: "LinkedIn", Icon: Linkedin }, { href: `mailto:${driver.email}`, label: "Email", Icon: Mail }].map(({ href, label, Icon }) => <a key={label} href={href} aria-label={label} className="text-white/45 transition hover:text-[#c8ff62]"><Icon size={17} /></a>)}<a href={driver.resumeUrl} target="_blank" rel="noreferrer" className="ml-3 border-b border-white/30 pb-1 font-mono text-[9px] uppercase tracking-wider text-white/60 transition hover:border-[#c8ff62] hover:text-[#c8ff62]">Résumé <ArrowUpRight size={11} className="inline" /></a></div></div>
        <div className="mx-auto mt-16 flex max-w-7xl justify-between border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/25"><span>© {new Date().getFullYear()} Shubh Jain</span><span>Designed with clarity</span></div>
      </footer>
    </main>
  );
}
