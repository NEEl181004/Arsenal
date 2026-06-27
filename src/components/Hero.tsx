"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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

const Y_RATIOS = [0.18, 0.50, 0.82];

// All sizes in px — used for the full-size (xl) canvas only
const GLOBE = 520;
const TAG_W = 140;
const GAP   = 8;
const TOTAL_W = TAG_W + GAP + GLOBE + GAP + TAG_W;
const TOTAL_H = GLOBE;

// Globe center in canvas
const GCX = TAG_W + GAP + GLOBE / 2;
const GCY = GLOBE / 2;
const R   = GLOBE * 0.46;

interface HeroProps { onLoginOpen: () => void }

export default function Hero({ onLoginOpen }: HeroProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleExplore = () => {
    if (session) router.push("/dashboard");
    else onLoginOpen();
  };
  return (
    <section className="relative flex items-center min-h-[88vh] py-6">
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 items-center gap-0">

        {/* ── TEXT COLUMN ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="xl:col-span-5 flex flex-col z-10"
        >
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "#FF003C", textTransform: "uppercase", marginBottom: 18 }}>
            /// COMPREHENSIVE. PRACTICAL. OPERATIONAL.
          </p>

          <h1 style={{ fontFamily: "var(--font-barlow),sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem, 6vw, 6rem)", lineHeight: 0.93, letterSpacing: "-0.01em", color: "white" }}>
            RED TEAM<br />
            DOCUMENTED<br />
            <span style={{ color: "#FF003C", textShadow: "0 0 30px rgba(255,0,60,0.4),0 0 60px rgba(255,0,60,0.15)" }}>
              WEAPONIZED
            </span>
          </h1>

          <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgb(113,113,122)", marginTop: 20, maxWidth: 380 }}>
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

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <motion.button
              onClick={handleExplore}
              whileHover={{ scale: 1.03, boxShadow: "0 0 28px rgba(255,0,60,0.35)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#FF003C", border: "none", borderRadius: 10, padding: "11px 20px", color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontFamily: "var(--font-inter),sans-serif" }}
            >
              Explore Tools <ArrowRight size={12} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>

        {/* ── GLOBE COLUMN ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="xl:col-span-7 flex items-center justify-center mt-10 xl:mt-0"
        >
          {/* 
            Mobile / tablet (< xl): just the globe image, no tags, no overflow.
            xl+: full canvas with tags using a viewBox-style SVG approach.
          */}

          {/* ── MOBILE GLOBE (hidden on xl) ── */}
          <div className="xl:hidden w-full flex items-center justify-center">
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", width: "min(420px, 90vw)", height: "min(420px, 90vw)" }}
            >
              {/* Glow */}
              <div style={{
                position: "absolute", inset: "-20%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(210,0,30,0.22) 0%, rgba(255,0,60,0.07) 40%, transparent 65%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }} />
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
          </div>

          {/* ── DESKTOP GLOBE + TAGS (hidden below xl) ── */}
          <div className="hidden xl:block w-full">
            {/*
              Use an SVG viewBox to handle all scaling automatically.
              The SVG scales to fill its container while preserving aspect ratio.
              foreignObject lets us render the Tag chips inside SVG space.
            */}
            <svg
              viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
              style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
            >
              {/* Glow */}
              <defs>
                <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(210,0,30,0.26)" />
                  <stop offset="38%" stopColor="rgba(255,0,60,0.09)" />
                  <stop offset="65%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                <linearGradient id="gL" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={TAG_W} y2="0">
                  <stop offset="0%" stopColor="rgba(255,0,60,0.05)" />
                  <stop offset="100%" stopColor="rgba(255,0,60,0.65)" />
                </linearGradient>
                <linearGradient id="gR" gradientUnits="userSpaceOnUse" x1={TAG_W + GAP + GLOBE} y1="0" x2={TOTAL_W} y2="0">
                  <stop offset="0%" stopColor="rgba(255,0,60,0.65)" />
                  <stop offset="100%" stopColor="rgba(255,0,60,0.05)" />
                </linearGradient>
                <filter id="dg">
                  <feGaussianBlur stdDeviation="2" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Globe glow ellipse */}
              <ellipse
                cx={GCX} cy={GCY}
                rx={GLOBE * 0.58} ry={GLOBE * 0.58}
                fill="url(#globeGlow)"
                opacity="0.9"
              />

              {/* Globe image via foreignObject */}
              <foreignObject x={TAG_W + GAP} y={0} width={GLOBE} height={GLOBE}>
                <div style={{ width: "100%", height: "100%" }}>
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
                      display: "block",
                    }}
                  />
                </div>
              </foreignObject>

              {/* LEFT connector lines */}
              {leftNodes.map((_, i) => {
                const tagCY  = Y_RATIOS[i] * TOTAL_H;
                const tagRX  = TAG_W;
                const angle  = (Y_RATIOS[i] - 0.5) * Math.PI * 0.85;
                const hitX   = GCX - Math.cos(Math.abs(angle)) * R;
                const hitY   = GCY + Math.sin(angle) * R;
                const elbowX = hitX - 28;
                const d = Math.abs(tagCY - hitY) > 4
                  ? `M ${tagRX} ${tagCY} L ${elbowX} ${tagCY} L ${hitX} ${hitY}`
                  : `M ${tagRX} ${tagCY} L ${hitX} ${hitY}`;
                return (
                  <g key={i}>
                    <path d={d} stroke="url(#gL)" strokeWidth="1" fill="none" opacity="0.92" />
                    <circle cx={hitX} cy={hitY} r="2.2" fill="#FF003C" filter="url(#dg)" />
                    <polygon points={`${tagRX+1},${tagCY} ${tagRX-6},${tagCY-3} ${tagRX-6},${tagCY+3}`} fill="#FF003C" opacity="0.75" />
                  </g>
                );
              })}

              {/* RIGHT connector lines */}
              {rightNodes.map((_, i) => {
                const tagCY  = Y_RATIOS[i] * TOTAL_H;
                const tagLX  = TAG_W + GAP + GLOBE + GAP;
                const angle  = (Y_RATIOS[i] - 0.5) * Math.PI * 0.85;
                const hitX   = GCX + Math.cos(Math.abs(angle)) * R;
                const hitY   = GCY + Math.sin(angle) * R;
                const elbowX = hitX + 28;
                const d = Math.abs(tagCY - hitY) > 4
                  ? `M ${tagLX} ${tagCY} L ${elbowX} ${tagCY} L ${hitX} ${hitY}`
                  : `M ${tagLX} ${tagCY} L ${hitX} ${hitY}`;
                return (
                  <g key={i}>
                    <path d={d} stroke="url(#gR)" strokeWidth="1" fill="none" opacity="0.92" />
                    <circle cx={hitX} cy={hitY} r="2.2" fill="#FF003C" filter="url(#dg)" />
                    <polygon points={`${tagLX-1},${tagCY} ${tagLX+6},${tagCY-3} ${tagLX+6},${tagCY+3}`} fill="#FF003C" opacity="0.75" />
                  </g>
                );
              })}

              {/* LEFT TAGS via foreignObject */}
              {leftNodes.map((node, i) => {
                const topPx = Y_RATIOS[i] * TOTAL_H - 22;
                return (
                  <foreignObject key={node.title} x={0} y={topPx} width={TAG_W} height={44}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(4,5,11,0.93)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7,
                      padding: "5px 8px",
                      boxShadow: "0 2px 14px rgba(0,0,0,0.7)",
                      backdropFilter: "blur(10px)",
                      height: 44,
                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}>
                      <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 4, background: "rgba(255,0,60,0.09)", border: "1px solid rgba(255,0,60,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF003C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d={node.iconPath} />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.92)", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.title}</div>
                        <div style={{ fontSize: 8.5, color: "rgb(100,100,112)", marginTop: 2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.desc}</div>
                      </div>
                    </div>
                  </foreignObject>
                );
              })}

              {/* RIGHT TAGS via foreignObject */}
              {rightNodes.map((node, i) => {
                const topPx  = Y_RATIOS[i] * TOTAL_H - 22;
                const leftPx = TAG_W + GAP + GLOBE + GAP;
                return (
                  <foreignObject key={node.title} x={leftPx} y={topPx} width={TAG_W} height={44}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(4,5,11,0.93)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 7,
                      padding: "5px 8px",
                      boxShadow: "0 2px 14px rgba(0,0,0,0.7)",
                      backdropFilter: "blur(10px)",
                      height: 44,
                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}>
                      <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 4, background: "rgba(255,0,60,0.09)", border: "1px solid rgba(255,0,60,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF003C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d={node.iconPath} />
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.92)", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.title}</div>
                        <div style={{ fontSize: 8.5, color: "rgb(100,100,112)", marginTop: 2, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.desc}</div>
                      </div>
                    </div>
                  </foreignObject>
                );
              })}
            </svg>
          </div>

        </motion.div>
      </div>
    </section>
  );
}