import { Anton, Instrument_Serif, Space_Grotesk } from "next/font/google";

/** Poster-condensed impact for headlines. */
export const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });

/** Elegant serif italic for premium accent words. */
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/** Clean technical grotesque for body + UI. */
export const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
