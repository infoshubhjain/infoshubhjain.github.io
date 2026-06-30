"use client";

import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail, Heart } from "lucide-react";
import { profile, navItems } from "@/lib/portfolio-data";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-background/60 backdrop-blur-xl">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <button
              onClick={() => scrollToSection("home")}
              className="group inline-flex items-center gap-3"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 font-display text-base font-bold text-primary transition-all group-hover:glow-primary">
                SJ
              </span>
              <span className="font-display text-lg font-semibold text-foreground">
                Shubh Jain
              </span>
            </button>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Computer Science @ UIUC. Building ambitious AI systems, conducting
              research, and shipping products that reach tens of thousands of people.
              Open to internships, research collaborations, and ambitious projects.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <SocialIcon href={profile.github} label="GitHub">
                <Github className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href={profile.linkedin} label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </SocialIcon>
              <SocialIcon href={`mailto:${profile.email}`} label="Email">
                <Mail className="h-4 w-4" />
              </SocialIcon>
            </div>
          </div>

          {/* Quick nav */}
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              navigate
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {navItems.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => scrollToSection(n.id)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              contact
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  github.com/infoshubhjain
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  linkedin.com/in/infoshubhjain
                </a>
              </li>
              <li className="pt-1 text-xs text-muted-foreground/70">
                {profile.location}
              </li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center"
        >
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            © {year} Shubh Jain. Built with
            <Heart className="h-3 w-3 fill-primary text-primary" />
            using Next.js, Three.js, Framer Motion & Tailwind.
          </p>
          <button
            onClick={() => scrollToSection("home")}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
    >
      {children}
    </a>
  );
}
