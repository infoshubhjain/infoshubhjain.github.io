import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { directives, driver, honors, pitWall, setup, standings, trophies, volunteering, wins } from "@/lib/prototype-data";
import { ThemeToggle } from "@/components/site/theme-toggle";

const projects = wins;
const research = directives.filter((item) => ["Training", "Paper"].includes(item.kind));
const selectedRoles = standings.filter((role) => role.featured);
const earlierRoles = standings.filter((role) => !role.featured);
const featuredLeadership = pitWall.filter((role) => role.featured).slice(0, 4);
const otherLeadership = pitWall.filter((role) => !featuredLeadership.includes(role));

export default function Home() {
  return (
    <main className="formal-site min-h-screen bg-[#0b0c0d] text-[#e8e9e5] selection:bg-[#c8ff62] selection:text-[#11130d]">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 flex-wrap px-5 py-5 sm:px-8">
        <a href="#top" aria-label="Shubh Jain, home" className="font-mono text-base tracking-[-0.08em] text-white">SJ<span className="text-[#c8ff62]">/</span></a>
        <nav aria-label="Main navigation" className="order-last flex w-full flex-wrap items-center gap-x-5 gap-y-1 font-mono text-sm uppercase tracking-[0.1em] text-white/65 lg:order-none lg:w-auto">
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#experience">Experience</a>
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#teaching">Teaching</a>
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#work">Projects</a>
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#research">Research</a>
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#awards">Awards</a>
          <a className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-2"><ThemeToggle /><Link href="/f1/" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-3.5 font-mono text-xs uppercase tracking-[0.12em] text-white/75 transition hover:border-[#c8ff62]/60 hover:text-[#c8ff62] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8ff62]">F1 version <ArrowUpRight size={13} aria-hidden="true" /></Link></div>
      </header>

      <section id="top" className="mx-auto max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-16 sm:pt-16">
        <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-white/65"><span className="h-px w-7 bg-[#c8ff62]" />Computer Science · UIUC · Urbana-Champaign</p>
        <div className="grid gap-8 md:grid-cols-[1fr_19rem] md:items-end">
          <div>
            <h1 className="text-6xl font-medium leading-[0.88] tracking-[-0.075em] sm:text-8xl">Shubh Jain</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">{driver.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-white/12 pt-4 text-sm md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-white/65">Degree</p><p className="mt-1.5">{driver.degree}</p><p className="mt-0.5 text-white/65">University of Illinois</p></div>
            <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-white/65">Graduation</p><p className="mt-1.5">{driver.graduation}</p></div>
            <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-white/65">Academic record</p><p className="mt-1.5">{driver.gpa}</p><p className="mt-0.5 text-white/65">{honors.join(" · ")}</p></div>
            <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-white/65">Focus</p><p className="mt-1.5">Systems · ML research</p></div>
          </div>
        </div>
        <p className="mt-6 max-w-4xl text-base leading-relaxed text-white/65"><span className="font-medium text-white/80">Coursework: </span>{driver.coursework.join(" · ")}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 font-mono text-xs uppercase tracking-[0.1em]">
          <a href={driver.resumeUrl} target="_blank" rel="noreferrer" className="text-[#c8ff62] underline decoration-[#c8ff62]/35 underline-offset-4 hover:decoration-[#c8ff62] focus-visible:outline-2 focus-visible:outline-[#c8ff62]">Résumé <ArrowUpRight size={11} className="inline" aria-hidden="true" /></a>
          <a href={driver.github} target="_blank" rel="noreferrer" className="text-white/65 hover:text-white">GitHub <ArrowUpRight size={11} className="inline" aria-hidden="true" /></a>
          <a href={driver.linkedin} target="_blank" rel="noreferrer" className="text-white/65 hover:text-white">LinkedIn <ArrowUpRight size={11} className="inline" aria-hidden="true" /></a>
          <a href={`mailto:${driver.email}`} className="text-white/65 hover:text-white">Email <ArrowUpRight size={11} className="inline" aria-hidden="true" /></a>
          <a href="#experience" className="ml-auto hidden items-center gap-1 text-white/65 hover:text-white sm:inline-flex">Experience <ArrowDownRight size={12} aria-hidden="true" /></a>
        </div>
      </section>

      <section id="experience" className="border-t border-white/10 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel n="01" title="Professional experience" aside="Engineering · AI research" />
          <div className="mt-7 divide-y divide-white/10 border-y border-white/10">{selectedRoles.map((role) => <article key={`${role.team}-${role.period}`} className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[11rem_minmax(0,1fr)_11rem]">
            <div><h3 className="text-base">{role.team}</h3>{role.link && <a href={role.link} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-white/65 hover:text-white">Organization <ArrowUpRight size={10} aria-hidden="true" /></a>}</div>
            <div><p className="text-base text-white/75">{role.role}</p><p className="mt-1 text-base leading-relaxed text-white/65">{role.note}</p>{role.points.length > 0 && <p className="mt-2 text-base leading-relaxed text-white/65">{role.points[0]}</p>}{role.points.length > 1 && <details className="mt-3"><summary className="cursor-pointer text-base text-white/65">More about this work</summary><ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-relaxed text-white/65">{role.points.slice(1).map((point) => <li key={point}>{point}</li>)}</ul></details>}</div>
            <p className="font-mono text-xs text-white/65 md:text-right">{role.period}</p>
          </article>)}</div>
          <details className="group mt-5">
            <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-white/65 hover:text-white focus-visible:outline-2 focus-visible:outline-[#c8ff62]">Earlier experience <span aria-hidden="true" className="transition group-open:rotate-90">›</span></summary>
            <div className="mt-2 divide-y divide-white/10 border-y border-white/10">{earlierRoles.map((role) => <article key={`${role.team}-${role.period}`} className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr_11rem]"><h3 className="text-base">{role.team}</h3><div><p className="text-base text-white/70">{role.role}</p><p className="mt-1 text-base leading-relaxed text-white/65">{role.note}</p></div><p className="font-mono text-xs text-white/65 sm:text-right">{role.period}</p></article>)}</div>
          </details>
        </div>
      </section>
      <section id="teaching" className="border-t border-white/10 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-7 md:grid-cols-[11rem_1fr]">
            <div><h2 className="text-lg">Teaching & project leadership</h2><p className="mt-1 text-sm text-white/65">Supporting students and engineering teams</p></div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{featuredLeadership.map((role) => <article key={role.org}><div className="flex justify-between gap-3"><h3 className="text-base">{role.org}</h3><span className="shrink-0 font-mono text-xs text-white/65">{role.period}</span></div><p className="mt-1 text-sm text-white/65">{role.role} · {role.metric}</p></article>)}</div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <details>
            <summary className="min-h-11 cursor-pointer text-base text-white/65">More leadership, mentoring & service</summary>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">{otherLeadership.map((role) => <article key={role.org}><h3 className="text-base">{role.org}</h3><p className="mt-1 text-base text-white/65">{role.role} · {role.period}</p><p className="mt-2 text-base leading-relaxed text-white/65">{role.metric}. {role.note}</p></article>)}</div>
            <div className="mt-6 border-t border-white/10 pt-4">{volunteering.map((item) => <p key={item.org} className="mt-3 text-base leading-relaxed text-white/65"><span className="text-white/75">{item.org}: </span>{item.contribution}</p>)}</div>
          </details>
        </div>
      </section>

      <section id="work" className="border-t border-white/10 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel n="02" title="Projects" aside="Systems · products · tools" />
          <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
            {projects.map((project, index) => <article id={`project-${project.id}`} key={project.id} className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-[2rem_minmax(0,1fr)_13rem] md:py-7">
              <span className="pt-1 font-mono text-xs text-[#c8ff62]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className="text-xl tracking-[-0.035em] sm:text-2xl">{project.name}</h3><span className="font-mono text-xs uppercase tracking-[0.12em] text-white/65">{project.period ?? project.year} · {project.role}</span></div>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-white/65">{project.overview}</p>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-white/65">{project.setup}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-xs text-white/65">{project.metrics.slice(0, 3).map((metric) => <span key={metric.label}><span className="text-white/75">{metric.value}</span> {metric.label}</span>)}</div>
                <details className="mt-3"><summary className="cursor-pointer text-base text-white/65">Implementation details</summary><ul className="mt-2 max-w-3xl list-disc space-y-2 pl-5 text-base leading-relaxed text-white/65">{project.impact.map((point) => <li key={point}>{point}</li>)}</ul></details>
                <ul aria-label={`${project.name} technologies`} className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1">{project.tech.map((tech) => <li key={tech} className="font-mono text-xs text-white/65">{tech}</li>)}</ul>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end md:pt-1">{project.links.length ? project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1 font-mono text-xs uppercase tracking-[0.08em] text-[#c8ff62] hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#c8ff62]">{link.label}<ArrowUpRight size={11} aria-hidden="true" /></a>) : <span className="font-mono text-xs text-white/65">Source not linked</span>}</div>
              </article>)}
          </div>
          <p className="mt-4 text-sm text-white/65">More project detail, implementation notes, and the interactive F1 presentation are available in the <Link className="text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white" href="/f1/">F1 version</Link>.</p>
        </div>
      </section>

      <section id="research" className="border-t border-white/10 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionLabel n="03" title="Research & writing" aside="Evaluation · NLP · explainability" />
          <div className="mt-7 grid gap-x-12 md:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="divide-y divide-white/10 border-y border-white/10">{research.map((item) => <article key={item.title} className="py-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="font-mono text-xs uppercase tracking-[0.12em] text-[#c8ff62]">{item.status === "Submitted" ? "Submission" : item.kind} · {item.year}</span><span className="font-mono text-xs text-white/65">{item.venue}</span>{item.kind === "Paper" && !item.link && <span className="font-mono text-xs text-amber-200/70">Citation details incomplete</span>}</div>
              <h3 className="mt-2 text-base leading-snug tracking-[-0.02em]">{item.link ? <a href={item.link} target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-4 hover:text-[#c8ff62] hover:decoration-[#c8ff62]">{item.title}<ArrowUpRight size={12} className="ml-1 inline" aria-label="Open publication" /></a> : item.title}</h3>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/65">{item.note}</p>
            </article>)}</div>
            <aside className="mt-8 border-l border-white/10 pl-5 md:mt-0"><p className="font-mono text-xs uppercase tracking-[0.14em] text-white/65">Additional publication</p>{directives.filter((item) => item.kind === "Book" || item.kind === "Patent").map((item) => <article key={item.title} className="mt-4"><p className="font-mono text-xs text-white/65">{item.status === "Submitted" ? "Submission" : item.kind} · {item.year}</p><h3 className="mt-1 text-base leading-snug">{item.title}</h3><p className="mt-1 font-mono text-xs text-white/65">{item.venue}</p><p className="mt-1 text-sm text-white/65">{item.note}</p></article>)}</aside>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-12 sm:px-8 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-[11rem_1fr]">
          <div><p className="font-mono text-xs uppercase tracking-[0.14em] text-white/65">Technical areas</p><p className="mt-1 text-sm text-white/65">From project and course work</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{setup.map((group) => <p key={group.unit} className="text-base leading-relaxed text-white/65"><span className="text-white/65">{group.unit.replace(/^[^—]+— /, "")} · </span>{group.parts.join(" · ")}</p>)}</div>
        </div>
      </section>

      <section id="awards" className="border-t border-white/10 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl"><h2 className="text-xl">Awards & recognition</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{trophies.map((award) => <article key={award.title}><p className="text-sm text-white/65">{award.year} · {award.issuer}</p><h3 className="mt-1 text-base">{award.title}</h3><p className="mt-2 text-base leading-relaxed text-white/65">{award.note}</p></article>)}</div></div>
      </section>

      <footer id="contact" className="border-t border-white/10 px-5 py-9 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-base">Interested in systems engineering or applied ML research?</p><a href={`mailto:${driver.email}`} className="mt-1 inline-block text-base text-[#c8ff62] underline decoration-[#c8ff62]/30 underline-offset-4 hover:decoration-[#c8ff62]">{driver.email}</a></div><div className="flex flex-wrap items-center gap-4">{[{ href: driver.github, label: "GitHub", Icon: Github }, { href: driver.linkedin, label: "LinkedIn", Icon: Linkedin }, { href: `mailto:${driver.email}`, label: "Email", Icon: Mail }].map(({ href, label, Icon }) => <a key={label} href={href} aria-label={label} className="text-white/65 transition hover:text-[#c8ff62] focus-visible:outline-2 focus-visible:outline-[#c8ff62]"><Icon size={16} aria-hidden="true" /></a>)}<a href={driver.resumeUrl} target="_blank" rel="noreferrer" className="ml-1 font-mono text-xs uppercase tracking-[0.1em] text-white/65 underline decoration-white/20 underline-offset-4 hover:text-white">Résumé <ArrowUpRight size={10} className="inline" aria-hidden="true" /></a></div></div>
          <p className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-4 font-mono text-xs text-white/65">© {new Date().getFullYear()} Shubh Jain <span className="float-right">Computer Science · UIUC</span></p>
      </footer>
    </main>
  );
}

function SectionLabel({ n, title, aside }: { n: string; title: string; aside: string }) {
  return <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="flex items-baseline gap-3 text-lg tracking-[-0.03em] sm:text-xl"><span className="font-mono text-xs text-[#c8ff62]">{n}</span>{title}</h2><span className="font-mono text-xs uppercase tracking-[0.1em] text-white/65">{aside}</span></div>;
}
