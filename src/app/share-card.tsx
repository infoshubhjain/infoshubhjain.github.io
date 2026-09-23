import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const alt = "Shubh Jain — Computer Science at UIUC, software engineering and applied ML research.";

export function renderShareCard() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "#0b0c0d", color: "#e8e9e5", padding: "76px 84px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 8, height: "100%", background: "#c8ff62" }} />
      <div style={{ position: "absolute", right: -150, top: -210, width: 610, height: 610, border: "1px solid rgba(255,255,255,.08)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", right: -50, top: -110, width: 410, height: 410, border: "1px solid rgba(255,255,255,.08)", borderRadius: "50%" }} />
      <div style={{ display: "flex", position: "relative", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15, color: "#a8aa9e", fontSize: 17, letterSpacing: 3, textTransform: "uppercase" }}>
          <span style={{ width: 34, height: 2, background: "#c8ff62" }} /> Computer Science · UIUC
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 94, lineHeight: 0.95, letterSpacing: -7, fontWeight: 600 }}>Shubh Jain</div>
          <div style={{ maxWidth: 790, color: "#b5b7b2", fontSize: 27, lineHeight: 1.35 }}>Software systems and applied machine learning, from LLM infrastructure to model evaluation.</div>
        </div>
        <div style={{ display: "flex", gap: 38, borderTop: "1px solid rgba(255,255,255,.14)", paddingTop: 23, color: "#969991", fontSize: 16, letterSpacing: 1.3 }}>
          <span>SOFTWARE ENGINEERING</span><span style={{ color: "#c8ff62" }}>·</span><span>ML RESEARCH</span><span style={{ color: "#c8ff62" }}>·</span><span>URBANA-CHAMPAIGN</span>
        </div>
      </div>
    </div>,
    size,
  );
}
