"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  FileDown,
  Globe,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { SectionShell } from "../section-heading";
import { profile } from "@/lib/portfolio-data";
import { Magnetic } from "../magnetic";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: FormState = { name: "", email: "", subject: "", message: "" };

const SOCIALS = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    description: "Best for opportunities, collaborations, and research inquiries.",
    accent: "primary",
  },
  {
    label: "GitHub",
    value: "@infoshubhjain",
    href: profile.github,
    icon: Github,
    description: "Code, projects, and open-source contributions.",
    accent: "primary",
  },
  {
    label: "LinkedIn",
    value: "in/infoshubhjain",
    href: profile.linkedin,
    icon: Linkedin,
    description: "Professional updates, internships, and career history.",
    accent: "accent",
  },
  {
    label: "Adaptive Learning Platform",
    value: "aiceuiuc.vercel.app",
    href: profile.website,
    icon: Globe,
    description: "Live multi-agent learning platform I architected.",
    accent: "accent",
  },
];

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please complete the required fields.");
      return;
    }
    setSending(true);

    // Simulate sending — there is no backend email service configured,
    // so we open a mailto: link with the prefilled content.
    await new Promise((r) => setTimeout(r, 900));

    const subject = encodeURIComponent(form.subject || `Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setSending(false);
    setSent(true);
    toast.success("Opening your email client…");
    setTimeout(() => {
      setSent(false);
      setForm(EMPTY);
    }, 4000);
  };

  return (
    <SectionShell id="contact" className="relative overflow-hidden">
      {/* Ambient lighting */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-1/4 top-0 h-[50vh] w-[50vh]" style={{ background: "var(--aurora-1)" }} />
        <div className="aurora-blob right-1/4 bottom-0 h-[50vh] w-[50vh]" style={{ background: "var(--aurora-3)" }} />
      </div>

      {/* Premium CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl liquid-glass-strong p-8 sm:p-12 lg:p-16 conic-border"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3 w-3" />
              Let's build something
            </div>
            <h2 className="mt-5 font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect with me.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              I am open to AI/ML research collaborations, internship opportunities,
              ambitious side projects, and conversations about building intelligent
              systems. Recruiting for OpenAI, Anthropic, Google, NVIDIA, Meta, Microsoft,
              Stripe, Databricks, Jane Street, or research labs — let's talk.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
                data-cursor-label="Email"
              >
                <Mail className="h-4 w-4" />
                {profile.email}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-primary/50"
                data-cursor-label="PDF"
              >
                <FileDown className="h-4 w-4" />
                Download Résumé
              </a>
            </Magnetic>
          </div>
        </div>
      </motion.div>

      {/* Two-column: socials + form */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Socials grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md transition-colors hover:border-primary/30"
              data-cursor-label="Open"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `radial-gradient(400px circle at 50% 0%, color-mix(in oklch, var(--${s.accent}) 12%, transparent), transparent 60%)`,
                }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                    s.accent === "primary"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-accent/30 bg-accent/10 text-accent"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
              </div>
              <div className="relative mt-4">
                <div className="font-display text-sm font-semibold text-foreground">
                  {s.label}
                </div>
                <div className="mt-0.5 font-mono text-xs text-primary">{s.value}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md sm:p-7"
        >
          <h3 className="font-display text-lg font-semibold text-foreground">
            Send a message
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Opens your email client pre-filled. I usually reply within 24 hours.
          </p>

          <div className="mt-5 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your name"
                required
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@domain.com"
                required
              />
            </div>
            <Field
              label="Subject"
              value={form.subject}
              onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              placeholder="What's this about?"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell me about the opportunity, project, or collaboration…"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={sending || sent}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary disabled:opacity-70"
          >
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.span
                  key="sent"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Message ready — check your email client
                </motion.span>
              ) : sending ? (
                <motion.span
                  key="sending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                  Preparing…
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2"
                >
                  <Send className="h-4 w-4" /> Send Message
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.form>
      </div>
    </SectionShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <div className="relative">
      <label
        className={cn(
          "absolute left-3.5 transition-all duration-200 pointer-events-none z-10",
          isFloating
            ? "top-1.5 text-[10px] font-medium text-primary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        )}
      >
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={isFloating ? placeholder : ""}
        required={required}
        className={cn(
          "h-12 w-full rounded-xl border bg-background/40 px-3.5 pt-5 pb-1 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-md transition-all duration-200",
          focused
            ? "border-primary/60 ring-2 ring-primary/20 shadow-[0_0_20px_-4px_var(--primary)]"
            : "border-border hover:border-primary/30"
        )}
      />
      {/* Animated focus border glow */}
      {focused && (
        <motion.div
          layoutId="field-glow"
          className="pointer-events-none absolute inset-0 rounded-xl border border-primary/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
