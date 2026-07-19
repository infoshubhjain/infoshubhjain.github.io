/**
 * Two team liveries for the /prototype F1 site. Same concept, swappable palette.
 * DOM elements read the CSS vars (applied on the root wrapper); the 3D scene
 * reads the `three` colors directly (WebGL can't use CSS vars).
 */

export type TeamId = "ferrari" | "redbull";

export type Palette = {
  id: TeamId;
  label: string;
  /** CSS custom properties applied to the prototype root. */
  vars: Record<string, string>;
  /** Real color values for the three.js scene. */
  three: {
    canvas: string;
    body: string;
    bodyDk: string;
    rim: string;
    edge: string;
    accent: string;
    tyre: string;
    /** Path to this team's real car model (each keeps its own livery). */
    model: string;
  };
};

export const PALETTES: Record<TeamId, Palette> = {
  ferrari: {
    id: "ferrari",
    label: "Ferrari",
    vars: {
      "--pt-canvas": "#0a0a0b",
      "--pt-panel": "rgba(9,9,11,0.55)",
      "--pt-glass": "rgba(22,18,18,0.42)",
      "--pt-primary": "#e10600",
      "--pt-primary-dk": "#a30400",
      "--pt-on-primary": "#f5f3ee",
      "--pt-accent": "#ffd000",
      "--pt-white": "#f5f3ee",
      "--pt-muted": "#adadb4",
      "--pt-line": "rgba(245,243,238,0.14)",
    },
    three: {
      canvas: "#0a0a0b",
      body: "#e10600",
      bodyDk: "#a30400",
      rim: "#ffd000",
      edge: "#e10600",
      accent: "#ffd000",
      tyre: "#0d0d0f",
      model: "/models/f1-car.glb", // real Ferrari F1-75 livery
    },
  },
  redbull: {
    id: "redbull",
    label: "Red Bull",
    vars: {
      "--pt-canvas": "#080d24",
      "--pt-panel": "rgba(8,13,36,0.58)",
      "--pt-glass": "rgba(12,20,54,0.44)",
      "--pt-primary": "#ffc500",
      "--pt-primary-dk": "#c99a00",
      "--pt-on-primary": "#0a1030",
      "--pt-accent": "#e4002b",
      "--pt-white": "#f3f4f8",
      "--pt-muted": "#aab3ca",
      "--pt-line": "rgba(243,244,248,0.14)",
    },
    three: {
      canvas: "#080d24",
      body: "#13245e",
      bodyDk: "#0a1436",
      rim: "#ffc500",
      edge: "#e4002b",
      accent: "#ffc500",
      tyre: "#0d0d12",
      model: "/models/rb-car.glb", // real Red Bull RB18 livery
    },
  },
};
