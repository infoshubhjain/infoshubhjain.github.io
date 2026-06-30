"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive architecture diagram for the AI-Powered Adaptive Learning Platform.
 * Shows 7 AI agents in a ReAct loop, the BKT engine, and Supabase persistence
 * with animated data-flow connections.
 */
const AGENTS = [
  { id: "orchestrator", label: "Orchestrator", x: 50, y: 18, color: "#10d9a3", desc: "Routes requests across agents via ReAct loop" },
  { id: "roadmap", label: "Roadmap", x: 18, y: 38, color: "#10d9a3", desc: "Generates personalized learning roadmaps" },
  { id: "knowledge", label: "Knowledge", x: 50, y: 38, color: "#10d9a3", desc: "Delivers lesson content with DuckDuckGo enrichment" },
  { id: "quiz", label: "Quiz", x: 82, y: 38, color: "#10d9a3", desc: "Generates adaptive questions with deduplication" },
  { id: "conversation", label: "Conversation", x: 25, y: 60, color: "#06b6d4", desc: "Multi-turn tutoring with sliding-window memory" },
  { id: "tasker", label: "Tasker", x: 55, y: 60, color: "#06b6d4", desc: "Manages p5.js code playground tasks" },
  { id: "memory", label: "Memory Compactor", x: 80, y: 60, color: "#06b6d4", desc: "Compresses 200+ message transcripts" },
] as const;

const CONNECTIONS = [
  { from: "orchestrator", to: "roadmap", label: "plan" },
  { from: "orchestrator", to: "knowledge", label: "teach" },
  { from: "orchestrator", to: "quiz", label: "assess" },
  { from: "orchestrator", to: "conversation", label: "tutor" },
  { from: "orchestrator", to: "tasker", label: "practice" },
  { from: "orchestrator", to: "memory", label: "compress" },
  { from: "quiz", to: "bkt", label: "observation" },
  { from: "bkt", to: "quiz", label: "next_skill" },
  { from: "orchestrator", to: "supabase", label: "persist" },
  { from: "bkt", to: "supabase", label: "posteriors" },
] as const;

export function ArchitectureDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  const getNode = (id: string) => {
    if (id === "bkt") return { x: 50, y: 80, label: "BKT Engine", color: "#a855f7" };
    if (id === "supabase") return { x: 15, y: 82, label: "Supabase", color: "#a855f7" };
    return AGENTS.find((a) => a.id === id)!;
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-background/40 p-4">
      {/* Grid background */}
      <div aria-hidden className="absolute inset-0 bg-grid opacity-30" />

      <svg viewBox="0 0 100 100" className="relative h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* Connections */}
        {CONNECTIONS.map((conn, i) => {
          const from = getNode(conn.from);
          const to = getNode(conn.to);
          const isActive = hovered === conn.from || hovered === conn.to;
          return (
            <g key={i}>
              <motion.line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? from.color : "var(--border)"}
                strokeWidth={isActive ? 0.6 : 0.3}
                strokeDasharray="0.8 0.6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
              {/* Animated pulse along active connections */}
              {isActive && (
                <motion.circle
                  r="0.6"
                  fill={from.color}
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    offsetPath: `path("M ${from.x} ${from.y} L ${to.x} ${to.y}")`,
                  }}
                />
              )}
              {/* Label */}
              <text
                x={(from.x + to.x) / 2}
                y={(from.y + to.y) / 2 - 0.5}
                textAnchor="middle"
                fontSize="1.8"
                fill="var(--muted-foreground)"
                className="font-mono"
                opacity={isActive ? 1 : 0.5}
              >
                {conn.label}
              </text>
            </g>
          );
        })}

        {/* Agent nodes */}
        {AGENTS.map((agent, i) => {
          const isHovered = hovered === agent.id;
          return (
            <motion.g
              key={agent.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
              onMouseEnter={() => setHovered(agent.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <rect
                x={agent.x - 7}
                y={agent.y - 3.5}
                width="14"
                height="7"
                rx="1.5"
                fill={isHovered ? agent.color : "var(--background)"}
                stroke={agent.color}
                strokeWidth="0.3"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 4px ${agent.color})` : "none",
                  transition: "all 0.3s",
                }}
              />
              <text
                x={agent.x}
                y={agent.y + 0.5}
                textAnchor="middle"
                fontSize="2"
                fill={isHovered ? "var(--background)" : agent.color}
                className="font-mono font-semibold"
              >
                {agent.label}
              </text>
            </motion.g>
          );
        })}

        {/* BKT Engine — special node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.8 }}
          onMouseEnter={() => setHovered("bkt")}
          onMouseLeave={() => setHovered(null)}
          className="cursor-pointer"
        >
          <rect
            x="43"
            y="76.5"
            width="14"
            height="7"
            rx="1.5"
            fill={hovered === "bkt" ? "#a855f7" : "var(--background)"}
            stroke="#a855f7"
            strokeWidth="0.3"
            style={{
              filter: hovered === "bkt" ? "drop-shadow(0 0 4px #a855f7)" : "none",
              transition: "all 0.3s",
            }}
          />
          <text
            x="50"
            y="81"
            textAnchor="middle"
            fontSize="2"
            fill={hovered === "bkt" ? "var(--background)" : "#a855f7"}
            className="font-mono font-semibold"
          >
            BKT Engine
          </text>
        </motion.g>

        {/* Supabase — special node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.9 }}
          onMouseEnter={() => setHovered("supabase")}
          onMouseLeave={() => setHovered(null)}
          className="cursor-pointer"
        >
          <rect
            x="8"
            y="78.5"
            width="14"
            height="7"
            rx="1.5"
            fill={hovered === "supabase" ? "#a855f7" : "var(--background)"}
            stroke="#a855f7"
            strokeWidth="0.3"
            style={{
              filter: hovered === "supabase" ? "drop-shadow(0 0 4px #a855f7)" : "none",
              transition: "all 0.3s",
            }}
          />
          <text
            x="15"
            y="83"
            textAnchor="middle"
            fontSize="2"
            fill={hovered === "supabase" ? "var(--background)" : "#a855f7"}
            className="font-mono font-semibold"
          >
            Supabase
          </text>
        </motion.g>
      </svg>

      {/* Hover tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-popover/90 p-3 backdrop-blur-md"
        >
          {hovered === "bkt" ? (
            <p className="font-mono text-xs text-foreground/90">
              <span className="font-semibold text-[#a855f7]">Bayesian Knowledge Tracing Engine</span> —
              Models per-skill mastery probabilities using learning rate, guess rate, and slip rate.
              Selects the next question by maximizing expected information gain over the learner's skill frontier.
            </p>
          ) : hovered === "supabase" ? (
            <p className="font-mono text-xs text-foreground/90">
              <span className="font-semibold text-[#a855f7]">Supabase PostgreSQL</span> —
              11 migrations, pgvector for semantic roadmap retrieval, Row-Level Security for user isolation,
              dual-scope knowledge state (global per-user + local per-project).
            </p>
          ) : (
            <p className="font-mono text-xs text-foreground/90">
              <span className="font-semibold" style={{ color: AGENTS.find((a) => a.id === hovered)?.color }}>
                {AGENTS.find((a) => a.id === hovered)?.label} Agent
              </span>{" "}
              — {AGENTS.find((a) => a.id === hovered)?.desc}
            </p>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute right-4 top-4 flex flex-col gap-1.5 rounded-lg border border-border bg-popover/60 p-2.5 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "#10d9a3" }} />
          <span className="font-mono text-[10px] text-muted-foreground">Core Agents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "#06b6d4" }} />
          <span className="font-mono text-[10px] text-muted-foreground">Support Agents</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: "#a855f7" }} />
          <span className="font-mono text-[10px] text-muted-foreground">Infrastructure</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-muted-foreground">
        hover nodes to explore →
      </div>
    </div>
  );
}
