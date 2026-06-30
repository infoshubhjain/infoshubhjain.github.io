"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  User,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Users,
  Sparkles,
  Trophy,
  Mail,
  Github,
  Linkedin,
  FileText,
  Search,
} from "lucide-react";
import { navItems, profile, projects, research } from "@/lib/portfolio-data";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";

type Item = {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
};

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  const navActions: Item[] = navItems.map((n) => ({
    label: n.label,
    hint: `Jump to section · ${n.shortcut}`,
    icon: iconForNav(n.id),
    action: () => {
      scrollToSection(n.id);
      setOpen(false);
    },
    group: "Navigation",
  }));

  const projectActions: Item[] = projects.map((p) => ({
    label: p.title,
    hint: `Project · ${p.timeline}`,
    icon: <FolderGit2 className="h-4 w-4" />,
    action: () => {
      scrollToSection("projects");
      setOpen(false);
    },
    group: "Projects",
  }));

  const researchActions: Item[] = [
    ...research.map((r) => ({
      label: r.title,
      hint: `Research · ${r.date}`,
      icon: <GraduationCap className="h-4 w-4" />,
      action: () => {
        scrollToSection("research");
        setOpen(false);
      },
      group: "Research",
    })),
  ];

  const linkActions: Item[] = [
    {
      label: "Open GitHub",
      hint: profile.github,
      icon: <Github className="h-4 w-4" />,
      action: () => window.open(profile.github, "_blank"),
      group: "Links",
    },
    {
      label: "Open LinkedIn",
      hint: profile.linkedin,
      icon: <Linkedin className="h-4 w-4" />,
      action: () => window.open(profile.linkedin, "_blank"),
      group: "Links",
    },
    {
      label: "Send Email",
      hint: profile.email,
      icon: <Mail className="h-4 w-4" />,
      action: () => (window.location.href = `mailto:${profile.email}`),
      group: "Links",
    },
    {
      label: "Download Résumé",
      hint: "PDF",
      icon: <FileText className="h-4 w-4" />,
      action: () => window.open(profile.resumeUrl, "_blank"),
      group: "Links",
    },
  ];

  const all = [...navActions, ...projectActions, ...researchActions, ...linkActions];
  const groups = Array.from(new Set(all.map((i) => i.group)));

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search sections, projects, research, links…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty className="py-10 text-sm text-muted-foreground">
          <Search className="mx-auto mb-2 h-5 w-5 opacity-50" />
          No matches.
        </CommandEmpty>
        {groups.map((g) => (
          <CommandGroup key={g} heading={g}>
            {all
              .filter((i) => i.group === g)
              .map((item, idx) => (
                <CommandItem
                  key={`${g}-${idx}`}
                  value={`${item.label} ${item.hint ?? ""}`}
                  onSelect={() => item.action()}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card/60 text-primary">
                    {item.icon}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="text-[11px] text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Tips">
          <div className="px-3 py-3 text-[11px] text-muted-foreground">
            Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-sans">1–9</kbd>{" "}
            to jump straight to any section.{" "}
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-sans">Esc</kbd> to close.
          </div>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function iconForNav(id: string) {
  switch (id) {
    case "home":
      return <Home className="h-4 w-4" />;
    case "about":
      return <User className="h-4 w-4" />;
    case "projects":
      return <FolderGit2 className="h-4 w-4" />;
    case "research":
      return <GraduationCap className="h-4 w-4" />;
    case "experience":
      return <Briefcase className="h-4 w-4" />;
    case "leadership":
      return <Users className="h-4 w-4" />;
    case "skills":
      return <Sparkles className="h-4 w-4" />;
    case "achievements":
      return <Trophy className="h-4 w-4" />;
    case "contact":
      return <Mail className="h-4 w-4" />;
    default:
      return <Home className="h-4 w-4" />;
  }
}
