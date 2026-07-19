"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { SectionShell, SectionHeading } from "../section-heading";
import { skills } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/use-media-query";
import { SkillsConstellation3D, type ConstellationNode } from "../skills-constellation";

const CATEGORY_META: Record<string, { color: string; angle: number }> = {
  Languages: { color: "#10d9a3", angle: 0 },
  Frameworks: { color: "#10d9a3", angle: 30 },
  "AI & ML": { color: "#10d9a3", angle: 60 },
  "Computer Vision": { color: "#06b6d4", angle: 75 },
  "Backend & APIs": { color: "#a855f7", angle: 90 },
  "Cloud & DevOps": { color: "#a855f7", angle: 120 },
  Frontend: { color: "#06b6d4", angle: 150 },
  "AI/NLP Pipeline": { color: "#10d9a3", angle: 165 },
  Research: { color: "#10d9a3", angle: 180 },
  "Data & Visualization": { color: "#06b6d4", angle: 210 },
  Cybersecurity: { color: "#a855f7", angle: 240 },
  Tools: { color: "#06b6d4", angle: 270 },
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reducedMotion = usePrefersReducedMotion();

  const categories = Object.keys(skills);

  const constellationNodes: ConstellationNode[] = useMemo(
    () =>
      categories.map((cat) => ({
        id: cat,
        color: (CATEGORY_META[cat] ?? { color: "#10d9a3" }).color,
        count: skills[cat].length,
      })),
    [categories]
  );

  // Build constellation node positions.
  const { nodes, links } = useMemo(() => {
    const cx = 50;
    const cy = 50;
    const radius = 36;
    const nodes: { id: string; x: number; y: number; color: string; count: number }[] = [];
    const links: { from: { x: number; y: number }; to: { x: number; y: number }; key: string }[] = [];

    categories.forEach((cat, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.round((cx + Math.cos(angle) * radius) * 1000) / 1000;
      const y = Math.round((cy + Math.sin(angle) * radius) * 1000) / 1000;
      const meta = CATEGORY_META[cat] ?? { color: "#10d9a3", angle: 0 };
      nodes.push({ id: cat, x, y, color: meta.color, count: skills[cat].length });
      links.push({ from: { x: cx, y: cy }, to: { x, y }, key: `${cat}-center` });
    });

    return { nodes, links };
  }, []);

  return (
    <SectionShell id="skills" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <SectionHeading
        eyebrow="Skills"
        fileLabel="07 · constellation · clusters"
        title={
          <>
            An interconnected toolkit for{" "}
            <span className="text-aurora">building intelligent systems.</span>
          </>
        }
        description={
          <>
            Skills grouped into 10 categories — languages, AI/ML, full-stack, research
            methods, cloud, and more. Hover the constellation to highlight a cluster.
          </>
        }
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Constellation */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square w-full rounded-2xl border border-border bg-card/30 p-4 backdrop-blur-md"
        >
          {!reducedMotion ? (
            <SkillsConstellation3D
              nodes={constellationNodes}
              active={activeCategory}
              onHover={setActiveCategory}
            />
          ) : (
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            aria-hidden
          >
            {/* Outer guide circle */}
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="color-mix(in oklch, var(--foreground) 8%, transparent)"
              strokeWidth="0.2"
              strokeDasharray="0.5 0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="color-mix(in oklch, var(--foreground) 5%, transparent)"
              strokeWidth="0.2"
            />

            {/* Links with data-flow dots */}
            {links.map((l) => {
              const isActive = activeCategory && l.key === `${activeCategory}-center`;
              return (
                <g key={l.key}>
                  <line
                    x1={l.from.x}
                    y1={l.from.y}
                    x2={l.to.x}
                    y2={l.to.y}
                    stroke={
                      isActive
                        ? "var(--primary)"
                        : "color-mix(in oklch, var(--foreground) 12%, transparent)"
                    }
                    strokeWidth={isActive ? 0.5 : 0.25}
                    strokeOpacity={activeCategory && !isActive ? 0.2 : 1}
                    className="transition-all duration-300"
                  />
                  {/* Data-flow dot along active links */}
                  {isActive && (
                    <circle r="0.6" fill="var(--primary)" opacity="0.8">
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M${l.from.x},${l.from.y} L${l.to.x},${l.to.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Center node with slow orbit */}
            <g>
              <circle
                cx="50"
                cy="50"
                r="6"
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth="0.5"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="50" cy="50" r="3" fill="var(--primary)" className="animate-pulse" />
              <text
                x="50"
                y="51"
                textAnchor="middle"
                fontSize="2.4"
                fill="var(--foreground)"
                className="font-display"
                fontWeight="600"
              >
                SJ
              </text>
            </g>

            {/* Category nodes */}
            {nodes.map((n) => {
              const active = activeCategory === n.id;
              const dim = activeCategory && !active;
              return (
                <g
                  key={n.id}
                  onMouseEnter={() => setActiveCategory(n.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  onClick={() =>
                    setActiveCategory((prev) => (prev === n.id ? null : n.id))
                  }
                  className="cursor-pointer"
                  style={{ opacity: dim ? 0.35 : 1, transition: "opacity 0.3s" }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={active ? 4 : 3}
                    fill={active ? n.color : "var(--background)"}
                    stroke={n.color}
                    strokeWidth="0.4"
                    className="transition-all duration-300"
                  />
                  {active && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="6"
                      fill="none"
                      stroke={n.color}
                      strokeWidth="0.2"
                      opacity="0.4"
                    />
                  )}
                  <text
                    x={n.x}
                    y={n.y < 50 ? n.y - 5 : n.y + 6}
                    textAnchor="middle"
                    fontSize="2.4"
                    fill={active ? n.color : "var(--foreground)"}
                    className="font-display"
                    fontWeight={active ? 600 : 400}
                  >
                    {n.id}
                  </text>
                  <text
                    x={n.x}
                    y={n.y < 50 ? n.y - 8 : n.y + 9}
                    textAnchor="middle"
                    fontSize="1.6"
                    fill="var(--muted-foreground)"
                  >
                    {n.count} skills
                  </text>
                </g>
              );
            })}
          </svg>
          )}

          {/* Hint */}
          <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {reducedMotion ? "hover_to_focus" : "drag_to_orbit · hover_to_focus"}
          </div>
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((cat, i) => {
            const meta = CATEGORY_META[cat] ?? { color: "#10d9a3", angle: 0 };
            const isActive = activeCategory === cat;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                onMouseEnter={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
                className={cn(
                  "rounded-xl border bg-card/40 p-4 backdrop-blur-md transition-all cursor-default",
                  isActive
                    ? "border-primary/40 bg-card/60"
                    : "border-border hover:border-primary/20"
                )}
                style={
                  isActive
                    ? { boxShadow: `0 0 24px -8px ${meta.color}80` }
                    : undefined
                }
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: meta.color }}
                  />
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {cat}
                  </h3>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {skills[cat].length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {/* ponytail: drag + spring-back stands in for full physics; swap in matter-js if gravity is ever wanted */}
                  {skills[cat].map((s) => (
                    <motion.span
                      key={s}
                      drag
                      dragSnapToOrigin
                      dragTransition={{ bounceStiffness: 500, bounceDamping: 18 }}
                      whileDrag={{ scale: 1.2, zIndex: 10 }}
                      whileHover={{ scale: 1.08 }}
                      className="relative cursor-grab rounded-md border border-border bg-card/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:cursor-grabbing"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
