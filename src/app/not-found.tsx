"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5">
      {/* Aurora */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora-blob left-1/4 top-1/3 h-[50vh] w-[50vh]" style={{ background: "var(--aurora-1)" }} />
        <div className="aurora-blob right-1/4 bottom-1/3 h-[40vh] w-[40vh]" style={{ background: "var(--aurora-3)" }} />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="font-display text-[10rem] font-bold leading-none text-aurora sm:text-[14rem]">
          404
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          This page wandered off the graph.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          The URL you hit does not exist. Let's get you back to something useful.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
          >
            <Home className="h-4 w-4" />
            Back home
          </Link>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
