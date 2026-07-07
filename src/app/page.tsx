"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { useSmoothScroll } from "@/lib/hooks/use-smooth-scroll";
import { CustomCursor } from "@/components/site/cursors";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { LoadingScreen } from "@/components/site/loading-screen";
import { Navbar } from "@/components/site/navbar";
import { CommandPalette } from "@/components/site/command-palette";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/sections/hero";
import { About } from "@/components/site/sections/about";
import { Projects } from "@/components/site/sections/projects";
import { Research } from "@/components/site/sections/research";
import { Experience } from "@/components/site/sections/experience";
import { Leadership } from "@/components/site/sections/leadership";
import { Skills } from "@/components/site/sections/skills";
import { Contact } from "@/components/site/sections/contact";
import { CursorPlayground } from "@/components/site/cursor-playground";
import { LiquidWipe } from "@/components/site/liquid-wipe";

export default function Home() {
  useSmoothScroll();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cursorPlaygroundOpen, setCursorPlaygroundOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <Navbar
        onOpenCommand={() => setPaletteOpen(true)}
        onOpenCursorPlayground={() => setCursorPlaygroundOpen(true)}
      />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <CursorPlayground open={cursorPlaygroundOpen} onClose={() => setCursorPlaygroundOpen(false)} />
      <LiquidWipe />

      <main className="relative min-h-screen">
        {/* Persistent background ambiance */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-50"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in oklch, var(--primary) 12%, transparent), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, color-mix(in oklch, var(--accent) 10%, transparent), transparent)",
          }}
        />

        <Hero />
        <About />
        <Projects />
        <Research />
        <Experience />
        <Leadership />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  );
}
