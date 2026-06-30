"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Minus, Square } from "lucide-react";
import { profile, projects, navItems, about } from "@/lib/portfolio-data";
import { scrollToSection } from "@/lib/hooks/use-smooth-scroll";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type Line = {
  type: "input" | "output" | "error" | "success" | "system";
  content: string;
};

type Command = {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[], history: Line[]) => Line[];
};

const BANNER = `
 ___  _   _    _    _   _ _   _ _   _
/ __|| | | |  / \\  | | | | | | | | | |
\\__ \\| |_| | / _ \\ | |_| | | | | |_| |
|___/ \\___/ /_/ \\_\\ \\___/  |_|  \\___/

> shubh@uiuc:~$ welcome
> Type 'help' to see available commands.
`;

export function InteractiveTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "system", content: BANNER },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  const commands: Record<string, Command> = {
    help: {
      name: "help",
      description: "List all available commands",
      execute: () => {
        const cmds = Object.values(commands);
        return [
          {
            type: "output" as const,
            content:
              "Available commands:\n\n" +
              cmds
                .map(
                  (c) =>
                    `  ${c.name.padEnd(16)} ${c.description}`
                )
                .join("\n"),
          },
        ];
      },
    },
    whoami: {
      name: "whoami",
      description: "Display user identity",
      execute: () => [
        {
          type: "output",
          content: `${profile.name}\n${profile.role}\n${profile.location}\nCGPA: 3.83/4.0 · Dean's List · James Scholar`,
        },
      ],
    },
    ls: {
      name: "ls",
      description: "List sections or projects",
      usage: "ls [projects|sections]",
      execute: (args) => {
        if (args[0] === "projects") {
          return [
            {
              type: "output",
              content: projects
                .map((p) => `  ${p.id}.md`.padEnd(30) + p.title)
                .join("\n"),
            },
          ];
        }
        if (args[0] === "sections") {
          return [
            {
              type: "output",
              content: navItems
                .map((n) => `  ${n.id}/`)
                .join("\n"),
            },
          ];
        }
        return [
          {
            type: "output",
            content: navItems.map((n) => `  ${n.id}/`).join("\n"),
          },
        ];
      },
    },
    cat: {
      name: "cat",
      description: "Read a section or project",
      usage: "cat <section|project>",
      execute: (args) => {
        if (!args[0]) {
          return [{ type: "error", content: "Usage: cat <section|project>" }];
        }
        const target = args[0];
        const section = navItems.find(
          (n) => n.id === target || n.label.toLowerCase() === target
        );
        if (section) {
          const summaries: Record<string, string> = {
            home: "Hero section — name, headline, and CTAs.",
            about: `${about.mission.slice(0, 200)}...`,
            projects: `${projects.length} projects spanning AI, full-stack, and systems.`,
            research: "2 published papers, 2 authored books, 1 patent.",
            experience: "7 professional roles across ML, research, and engineering.",
            leadership: "12 leadership roles — founder, events, mentoring, editorial.",
            skills: "10 skill categories with ~60 skills total.",
            achievements: "12 awards spanning research, academics, and leadership.",
            contact: `Email: ${profile.email}\nGitHub: ${profile.github}\nLinkedIn: ${profile.linkedin}`,
          };
          return [
            { type: "output", content: summaries[section.id] ?? "Section found." },
          ];
        }
        const project = projects.find(
          (p) => p.id === target || p.title.toLowerCase().includes(target)
        );
        if (project) {
          return [
            {
              type: "output",
              content: `Project: ${project.title}\n\n${project.description}\n\nTags: ${project.tags.join(", ")}\nTimeline: ${project.timeline}`,
            },
          ];
        }
        return [{ type: "error", content: `cat: ${target}: No such file or directory` }];
      },
    },
    cd: {
      name: "cd",
      description: "Navigate to a section",
      usage: "cd <section>",
      execute: (args) => {
        if (!args[0] || args[0] === "~" || args[0] === "/") {
          scrollToSection("home");
          return [{ type: "success", content: "→ Navigated to home" }];
        }
        const section = navItems.find(
          (n) => n.id === args[0] || n.label.toLowerCase() === args[0]
        );
        if (section) {
          scrollToSection(section.id);
          return [{ type: "success", content: `→ Navigated to ${section.label}` }];
        }
        return [{ type: "error", content: `cd: ${args[0]}: No such section` }];
      },
    },
    open: {
      name: "open",
      description: "Open a project case study or link",
      usage: "open <project|github|linkedin|resume>",
      execute: (args) => {
        const target = args[0];
        if (target === "github") {
          window.open(profile.github, "_blank");
          return [{ type: "success", content: "→ Opening GitHub..." }];
        }
        if (target === "linkedin") {
          window.open(profile.linkedin, "_blank");
          return [{ type: "success", content: "→ Opening LinkedIn..." }];
        }
        if (target === "resume") {
          window.open(profile.resumeUrl, "_blank");
          return [{ type: "success", content: "→ Opening resume..." }];
        }
        if (target === "email" || target === "contact") {
          window.location.href = `mailto:${profile.email}`;
          return [{ type: "success", content: "→ Opening email client..." }];
        }
        const project = projects.find(
          (p) => p.id === target || p.title.toLowerCase().includes(target)
        );
        if (project) {
          scrollToSection("projects");
          return [{ type: "success", content: `→ Opening ${project.title}...` }];
        }
        return [{ type: "error", content: `open: ${target}: Not found` }];
      },
    },
    sudo: {
      name: "sudo",
      description: "Try 'sudo hire-me'",
      usage: "sudo hire-me",
      execute: (args) => {
        if (args[0] === "hire-me" || args.join(" ") === "hire-me") {
          setTimeout(() => scrollToSection("contact"), 800);
          return [
            { type: "success", content: "[sudo] password for visitor: ********" },
            { type: "output", content: "Permission granted. Redirecting to contact..." },
          ];
        }
        if (args[0] === "rm" && args[1] === "-rf") {
          return [{ type: "error", content: "Nice try. 😏" }];
        }
        return [{ type: "error", content: "Usage: sudo hire-me" }];
      },
    },
    clear: {
      name: "clear",
      description: "Clear the terminal",
      execute: () => {
        setLines([]);
        return [];
      },
    },
    date: {
      name: "date",
      description: "Show current date and time",
      execute: () => [
        { type: "output", content: new Date().toString() },
      ],
    },
    echo: {
      name: "echo",
      description: "Print text",
      usage: "echo <text>",
      execute: (args) => [{ type: "output", content: args.join(" ") }],
    },
    neofetch: {
      name: "neofetch",
      description: "System information",
      execute: () => [
        {
          type: "output",
          content: `       _____         shubh@uiuc
      /     \\        -----------
     | () () |       OS: UIUC CS
     |  ___  |       Host: Siebel Center
    /|       |\\      Kernel: 3.83/4.0
   / |       | \\     Uptime: 6+ years
  |  |       |  |    Shell: zsh 5.9
  |  |       |  |    DE: Liquid Glass
  |  |_______|  |    Theme: Emerald Dark
  |             |    CPU: Bayesian Knowledge Tracer
  |             |    GPU: 7x AI Agents
   \\___________/     Memory: 2300+ lives impacted`,
        },
      ],
    },
    history: {
      name: "history",
      description: "Show command history",
      execute: () => [
        {
          type: "output",
          content:
            history.length > 0
              ? history.map((h, i) => `  ${i + 1}  ${h}`).join("\n")
              : "No commands in history yet.",
        },
      ],
    },
    theme: {
      name: "theme",
      description: "Switch theme (dark|light)",
      usage: "theme <dark|light>",
      execute: (args) => {
        const t = args[0];
        if (t === "dark" || t === "light") {
          setTheme(t);
          return [{ type: "success", content: `→ Theme set to ${t}` }];
        }
        return [{ type: "error", content: "Usage: theme <dark|light>" }];
      },
    },
    exit: {
      name: "exit",
      description: "Close the terminal",
      execute: () => {
        setTimeout(() => setOpen(false), 200);
        return [{ type: "success", content: "Closing terminal..." }];
      },
    },
  };

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const [cmd, ...args] = trimmed.split(/\s+/);
      const command = commands[cmd.toLowerCase()];

      const inputLine: Line = { type: "input", content: trimmed };
      setLines((prev) => [...prev, inputLine]);
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      if (!command) {
        setLines((prev) => [
          ...prev,
          {
            type: "error",
            content: `zsh: command not found: ${cmd}. Type 'help' for available commands.`,
          },
        ]);
        return;
      }

      const result = command.execute(args, lines);
      if (result.length > 0) {
        setLines((prev) => [...prev, ...result]);
      }
    },
    [commands, lines, history]
  );

  // Auto-scroll to bottom.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input when opened.
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Global keyboard shortcut: Ctrl+` to toggle.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx =
          historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIdx = historyIndex + 1;
      if (newIdx >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            aria-label="Open terminal"
            data-cursor-label="Terminal"
            className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl liquid-glass-strong border border-primary/30 text-primary transition-all hover:glow-primary"
          >
            <TerminalIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block">
              Open Terminal <kbd className="ml-1 font-mono text-[10px] text-muted-foreground">Ctrl+`</kbd>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl md:inset-x-8"
          >
            <div className="flex flex-col overflow-hidden rounded-2xl liquid-glass-strong border border-border shadow-2xl">
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="ml-3 font-mono text-xs text-muted-foreground">
                    shubh@uiuc: ~/portfolio — zsh
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Minimize terminal"
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close terminal"
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal body */}
              <div
                ref={scrollRef}
                className="h-[400px] overflow-y-auto scroll-area p-4 font-mono text-sm leading-relaxed"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((line, i) => (
                  <LineRenderer key={i} line={line} />
                ))}

                {/* Active input line */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-primary">shubh@uiuc</span>
                  <span className="shrink-0 text-muted-foreground">:~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-foreground caret-primary outline-none"
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal input"
                  />
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between border-t border-border bg-background/40 px-4 py-1.5 font-mono text-[10px] text-muted-foreground">
                <span>
                  {history.length} command{history.length !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-3">
                  <span>
                    <kbd className="rounded bg-muted px-1">↑↓</kbd> history
                  </span>
                  <span>
                    <kbd className="rounded bg-muted px-1">Ctrl+L</kbd> clear
                  </span>
                  <span>
                    <kbd className="rounded bg-muted px-1">Esc</kbd> close
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LineRenderer({ line }: { line: Line }) {
  const colorClass = {
    input: "text-foreground",
    output: "text-foreground/85",
    error: "text-red-400",
    success: "text-primary",
    system: "text-primary/70",
  }[line.type];

  if (line.type === "input") {
    return (
      <div className="flex items-center gap-2 whitespace-pre-wrap break-words">
        <span className="shrink-0 text-primary">shubh@uiuc</span>
        <span className="shrink-0 text-muted-foreground">:~$</span>
        <span className={colorClass}>{line.content}</span>
      </div>
    );
  }

  return (
    <div className={cn("whitespace-pre-wrap break-words", colorClass)}>
      {line.content}
    </div>
  );
}
