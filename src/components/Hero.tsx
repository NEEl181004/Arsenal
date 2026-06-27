"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight, ArrowRight } from "lucide-react";

const leftNodes = [
  { title: "RECONNAISSANCE",   desc: "Discover attack surface", iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { title: "INITIAL ACCESS",   desc: "Gain foothold",           iconPath: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { title: "LATERAL MOVEMENT", desc: "Move through network",    iconPath: "M5 12h14M12 5l7 7-7 7" },
];
const rightNodes = [
  { title: "PRIVILEGE ESCALATION", desc: "Elevate permissions",     iconPath: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { title: "DEFENSE EVASION",      desc: "Bypass security controls", iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" },
  { title: "IMPACT",               desc: "Achieve objectives",       iconPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
];

// Vertical ratios for the 3 tag rows (0 = top, 1 = bottom of GLOBE height)
const Y_RATIOS = [0.18, 0.50, 0.82];

const GLOBE   = 580;   // globe image size in px
const TAG_W   = 148;   // tag chip width in px
const GAP     = 4;     // gap between tag col and globe edge

interface HeroProps { onLoginOpen: () => void }

export default function Hero({ onLoginOpen }: HeroProps) {
  const TOTAL_W = TAG_W + GAP + GLOBE + GAP + TAG_W;
  const TOTAL_H = GLOBE;

  // Globe's center in the full canvas
  const GCX = TAG_W + GAP + GLOBE / 2;
  const GCY = GLOBE / 2;
  const R   = GLOBE * 0.46;  // approximate globe radius for arc calculations

  return (
    <section className="relative flex items-center min-h-[88vh] py-6">
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 items-center gap-0">

        {/* ── TEXT LEFT ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="xl:col-span-4 flex flex-col z-10"
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "#FF003C", textTransform: "uppercase", marginBottom: 18 }}>
            /// COMPREHENSIVE. PRACTICAL. OPERATIONAL.
          </p>

          <h1 style={{ fontFamily: "var(--font-barlow),sans-serif", fontWeight: 900, fontSize: "clamp(3.4rem, 5.6vw, 6.4rem)", lineHeight: 0.93, letterSpacing: "-0.01em", color: "white" }}>
            RED TEAM<br />
            DOCUMENTED<br />
            <span style={{ color: "#FF003C", textShadow: "0 0 30px rgba(255,0,60,0.4),0 0 60px rgba(255,0,60,0.15)" }}>
              WEAPONIZED
            </span>
          </h1>

          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgb(113,113,122)", marginTop: 20, maxWidth: 360 }}>
            Arsenal is your comprehensive documentation hub for red teaming tools, techniques, and tradecraft.
          </p>

          {/* Search */}
          <div style={{ marginTop: 28, maxWidth: 390, display: "flex", alignItems: "center", background: "rgba(6,8,12,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "6px 6px 6px 14px", boxShadow: "0 4px 24px rgba(0,0,0,0.55)" }}>
            <Search size={13} color="rgb(82,82,91)" style={{ flexShrink: 0 }} />
            <input type="text" placeholder="Search tools, techniques, or documentation..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "white", fontSize: 13, padding: "6px 10px", fontFamily: "var(--font-inter),sans-serif" }} className="placeholder-zinc-600" />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: "#FF003C", border: "none", borderRadius: 8, padding: "9px 12px", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <ChevronRight size={15} color="white" strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <motion.button whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(255,0,60,0.35)" }} whileTap={{ scale: 0.97 }} style={{ display: "flex", alignItems: "center", gap: 7, background: "#FF003C", border: "none", borderRadius: 10, padding: "11px 20px", color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-inter),sans-serif" }}>
              Explore Tools <ArrowRight size={12} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── GLOBE + TAGS RIGHT ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="xl:col-span-8 flex items-center justify-start lg:justify-center"
          style={{ minHeight: TOTAL_H + 40 }}
        >
          {/* Outer wrapper — position:relative so we can overlap globe + svg + tags */}
          <div style={{ position: "relative", width: TOTAL_W, height: TOTAL_H }}>

            {/* ── CSS glow behind globe (not SVG so it respects blend modes) ── */}
            <div style={{
              position: "absolute",
              left: TAG_W + GAP + GLOBE / 2 - GLOBE * 0.58,
              top:  GLOBE / 2 - GLOBE * 0.58,
              width: GLOBE * 1.16, height: GLOBE * 1.16,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(210,0,30,0.26) 0%, rgba(255,0,60,0.09) 38%, transparent 65%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            {/* ── Globe IMAGE (HTML img for proper mixBlendMode) ── */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: TAG_W + GAP,
                top:  0,
                width: GLOBE,
                height: GLOBE,
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              <img
                src="/images/globe_hud.png"
                alt="Globe HUD"
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  mixBlendMode: "screen",
                  filter: "brightness(1.3) contrast(1.15) saturate(1.1)",
                  maskImage: "radial-gradient(circle at center, black 38%, rgba(0,0,0,0.55) 56%, transparent 72%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 38%, rgba(0,0,0,0.55) 56%, transparent 72%)",
                }}
              />
            </motion.div>

            {/* ── SVG OVERLAY for connector lines + arrows ONLY (no fill shapes) ── */}
            <svg
              width={TOTAL_W} height={TOTAL_H}
              style={{ position: "absolute", inset: 0, zIndex: 3, overflow: "visible", pointerEvents: "none" }}
            >
              <defs>
                {/* Left gradient: faint at tag edge → bright at globe surface */}
                <linearGradient id="gL" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={TAG_W} y2="0">
                  <stop offset="0%" stopColor="rgba(255,0,60,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,0,60,0.65)" />
                </linearGradient>
                {/* Right gradient: bright at globe surface → faint at tag edge */}
                <linearGradient id="gR" gradientUnits="userSpaceOnUse" x1={TAG_W + GAP + GLOBE} y1="0" x2={TOTAL_W} y2="0">
                  <stop offset="0%" stopColor="rgba(255,0,60,0.65)" />
                  <stop offset="100%" stopColor="rgba(255,0,60,0.05)" />
                </linearGradient>
                <filter id="dg">
                  <feGaussianBlur stdDeviation="2" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* LEFT lines */}
              {leftNodes.map((_, i) => {
                const tagCY  = Y_RATIOS[i] * TOTAL_H;
                const tagRX  = TAG_W;                 // right edge of left tag col
                const angle  = (Y_RATIOS[i] - 0.5) * Math.PI * 0.85;
                const hitX   = GCX - Math.cos(Math.abs(angle)) * R;
                const hitY   = GCY + Math.sin(angle) * R;
                const elbowX = hitX - 32;
                const d = Math.abs(tagCY - hitY) > 4
                  ? `M ${tagRX} ${tagCY} L ${elbowX} ${tagCY} L ${hitX} ${hitY}`
                  : `M ${tagRX} ${tagCY} L ${hitX} ${hitY}`;
                return (
                  <g key={i}>
                    <path d={d} stroke="url(#gL)" strokeWidth="1.1" fill="none" opacity="0.92" />
                    <circle cx={hitX} cy={hitY} r="2.5" fill="#FF003C" filter="url(#dg)" />
                    {/* ► right-pointing arrow at tag's right edge (connector exits toward globe) */}
                    <polygon points={`${tagRX+1},${tagCY} ${tagRX-7},${tagCY-3.5} ${tagRX-7},${tagCY+3.5}`} fill="#FF003C" opacity="0.75" />
                  </g>
                );
              })}

              {/* RIGHT lines — mirror of left */}
              {rightNodes.map((_, i) => {
                const tagCY  = Y_RATIOS[i] * TOTAL_H;
                const tagLX  = TAG_W + GAP + GLOBE + GAP; // left edge of right tag col
                const angle  = (Y_RATIOS[i] - 0.5) * Math.PI * 0.85;
                const hitX   = GCX + Math.cos(Math.abs(angle)) * R;
                const hitY   = GCY + Math.sin(angle) * R;
                const elbowX = hitX + 32;
                const d = Math.abs(tagCY - hitY) > 4
                  ? `M ${tagLX} ${tagCY} L ${elbowX} ${tagCY} L ${hitX} ${hitY}`
                  : `M ${tagLX} ${tagCY} L ${hitX} ${hitY}`;
                return (
                  <g key={i}>
                    <path d={d} stroke="url(#gR)" strokeWidth="1.1" fill="none" opacity="0.92" />
                    <circle cx={hitX} cy={hitY} r="2.5" fill="#FF003C" filter="url(#dg)" />
                    {/* ◄ left-pointing arrow at tag's left edge (connector exits toward globe) */}
                    <polygon points={`${tagLX-1},${tagCY} ${tagLX+7},${tagCY-3.5} ${tagLX+7},${tagCY+3.5}`} fill="#FF003C" opacity="0.75" />
                  </g>
                );
              })}
            </svg>

            {/* ── LEFT TAGS — absolute at exact Y_RATIOS positions ── */}
            {leftNodes.map((node, i) => {
              const topPx = Y_RATIOS[i] * TOTAL_H - 22;
              return (
                <motion.div
                  key={node.title}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.55 }}
                  style={{ position: "absolute", top: topPx, left: 0, width: TAG_W, zIndex: 4 }}
                >
                  <Tag title={node.title} desc={node.desc} iconPath={node.iconPath} />
                </motion.div>
              );
            })}

            {/* ── RIGHT TAGS — explicit left= mirroring left column ── */}
            {rightNodes.map((node, i) => {
              const topPx  = Y_RATIOS[i] * TOTAL_H - 22;  // identical formula as left
              const leftPx = TAG_W + GAP + GLOBE + GAP;    // same x as tagLX in SVG
              return (
                <motion.div
                  key={node.title}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.55 }}
                  style={{ position: "absolute", top: topPx, left: leftPx, width: TAG_W, zIndex: 4 }}
                >
                  <Tag title={node.title} desc={node.desc} iconPath={node.iconPath} />
                </motion.div>
              );
            })}

          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ── Tag chip — HTML div, proper font rendering ── */
function Tag({ title, desc, iconPath }: { title: string; desc: string; iconPath: string }) {
  return (
    <motion.div
      whileHover={{ borderColor: "rgba(255,0,60,0.42)", scale: 1.04 }}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        background: "rgba(4,5,11,0.93)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8,
        padding: "6px 10px",
        boxShadow: "0 2px 14px rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "border-color .22s, transform .22s",
        cursor: "default",
        height: 44,
        boxSizing: "border-box",
      }}
    >
      <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 5, background: "rgba(255,0,60,0.09)", border: "1px solid rgba(255,0,60,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF003C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d={iconPath} />
        </svg>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: 7.5, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.92)", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: 9, color: "rgb(100,100,112)", marginTop: 2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {desc}
        </div>
      </div>
    </motion.div>
  );
}