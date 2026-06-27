"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const categories = [
  {
    title: "Reconnaissance",
    desc: "Map targets, identify attack vectors, and gather intelligence.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="gRecon" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6E0019" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="none" />
        <polygon points="50,25 75,40 75,70 50,85 25,70 25,40" stroke="rgba(255,0,60,0.12)" strokeWidth="1" fill="none" />
        {/* spy silhouette */}
        <circle cx="50" cy="38" r="11" fill="url(#gRecon)" />
        <path d="M29,78 C29,62 38,56 50,56 C62,56 71,62 71,78 Z" fill="url(#gRecon)" />
        <path d="M36,31 L64,31" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="38" r="4" stroke="#FF003C" strokeWidth="1.5" fill="none" />
        <circle cx="62" cy="38" r="4" stroke="#FF003C" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    title: "Initial Access",
    desc: "Gain a foothold in the environment through various vectors.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="gAccess" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6E0019" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* door frame */}
        <rect x="28" y="15" width="44" height="72" rx="4" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
        {/* open door */}
        <rect x="35" y="12" width="30" height="68" rx="3" stroke="#FF003C" strokeWidth="1.5" fill="#0A0608" />
        <path d="M35,12 L65,12 L65,80 L35,80 Z" fill="url(#gAccess)" opacity="0.15" />
        {/* arrow going in */}
        <line x1="50" y1="36" x2="50" y2="54" stroke="#FF3B62" strokeWidth="3" strokeLinecap="round" />
        <path d="M43,44 L50,54 L57,44" stroke="#FF3B62" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* handle */}
        <circle cx="60" cy="46" r="2.5" fill="#FF003C" opacity="0.6" />
      </svg>
    ),
  },
  {
    title: "Execution",
    desc: "Execute code, run payloads, and achieve initial execution.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        {/* terminal */}
        <rect x="15" y="20" width="70" height="52" rx="5" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
        <rect x="15" y="20" width="70" height="12" rx="5" fill="rgba(255,0,60,0.08)" />
        {/* window dots */}
        <circle cx="25" cy="26" r="2" fill="#FF003C" opacity="0.7" />
        <circle cx="33" cy="26" r="2" fill="rgba(255,60,60,0.4)" />
        <circle cx="41" cy="26" r="2" fill="rgba(255,60,60,0.25)" />
        {/* prompt */}
        <path d="M26,42 L36,49 L26,56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="40" y1="56" x2="64" y2="56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
        {/* code lines */}
        <line x1="40" y1="42" x2="68" y2="42" stroke="rgba(255,0,60,0.3)" strokeWidth="1.5" />
        <line x1="40" y1="49" x2="58" y2="49" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Privilege Escalation",
    desc: "Elevate privileges and expand access within the environment.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        {/* hierarchy tree going up */}
        <circle cx="50" cy="22" r="8" stroke="#FF003C" strokeWidth="2" fill="#1A0207" />
        <circle cx="28" cy="52" r="7" stroke="rgba(255,0,60,0.45)" strokeWidth="1.5" fill="#100105" />
        <circle cx="72" cy="52" r="7" stroke="rgba(255,0,60,0.45)" strokeWidth="1.5" fill="#100105" />
        <circle cx="50" cy="78" r="7" stroke="rgba(255,0,60,0.3)" strokeWidth="1.5" fill="#0A0103" />
        {/* up arrow */}
        <line x1="50" y1="86" x2="50" y2="30" stroke="#FF003C" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M44,33 L50,22 L56,33" stroke="#FF003C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* connections */}
        <line x1="50" y1="30" x2="28" y2="45" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
        <line x1="50" y1="30" x2="72" y2="45" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
        <line x1="28" y1="59" x2="50" y2="71" stroke="rgba(255,0,60,0.15)" strokeWidth="1.5" />
        <line x1="72" y1="59" x2="50" y2="71" stroke="rgba(255,0,60,0.15)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Defense Evasion",
    desc: "Bypass defenses and avoid detection mechanisms.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="gShield" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6E0019" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* shield */}
        <path d="M50,12 C65,12 80,18 80,32 C80,62 50,88 50,88 C50,88 20,62 20,32 C20,18 35,12 50,12 Z" stroke="#FF003C" strokeWidth="1.5" fill="url(#gShield)" />
        {/* diagonal slash */}
        <line x1="35" y1="35" x2="65" y2="65" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        {/* lock broken */}
        <rect x="42" y="48" width="16" height="13" rx="2" fill="rgba(255,0,60,0.7)" />
        <path d="M46,48 L46,43 C46,39 54,39 54,43" stroke="#FF003C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M54,43 L56,40" stroke="rgba(255,0,60,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Impact",
    desc: "Achieve objectives and impact target systems.",
    svg: (
      <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none">
        <defs>
          <radialGradient id="gImpact" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5070" />
            <stop offset="70%" stopColor="#CC0028" />
            <stop offset="100%" stopColor="#6E0019" />
          </radialGradient>
        </defs>
        {/* explosion / starburst */}
        <polygon
          points="50,12 55,38 80,28 62,48 88,60 60,62 50,88 40,62 12,60 38,48 20,28 45,38"
          fill="url(#gImpact)"
          stroke="#FF003C"
          strokeWidth="1"
          opacity="0.85"
        />
        <circle cx="50" cy="50" r="6" fill="#FF3B62" />
        <circle cx="50" cy="50" r="3" fill="white" opacity="0.6" />
      </svg>
    ),
  },
];

export default function Categories({ onLoginOpen }: { onLoginOpen?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleCategoryClick = (categoryTitle: string) => {
    if (session) {
      router.push(`/dashboard?category=${encodeURIComponent(categoryTitle)}`);
    } else {
      if (onLoginOpen) {
        onLoginOpen();
      } else {
        router.push("/#login");
      }
    }
  };

  return (
    <section className="relative py-20">
      {/* Background glow */}
      <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-10"
      >
        <p
          className="font-mono text-[#FF003C] uppercase mb-3"
          style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}
        >
          BROWSE BY CATEGORY
        </p>
        <h2
          className="text-white leading-tight"
          style={{ fontFamily: "var(--font-barlow), var(--font-display), sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem, 3vw, 2.7rem)", letterSpacing: "0.01em" }}
        >
          Explore Red Team Tradecraft
        </h2>
      </motion.div>

      {/* 6-column card grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            onClick={() => handleCategoryClick(cat.title)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col rounded-xl border border-zinc-900 bg-[#030407]/80 overflow-hidden transition-all duration-300 hover:border-red-500/25 hover:shadow-[0_0_20px_rgba(255,0,60,0.08)] cursor-pointer"
          >
            {/* Image / illustration area */}
            <div className="relative flex items-center justify-center h-32 bg-black/50 border-b border-zinc-900 overflow-hidden">
              {/* Micro grid */}
              <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-500/20 rounded-tl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-red-500/10 rounded-br-none" />

              <div className="relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,0,60,0.3)]">
                {cat.svg}
              </div>
            </div>

            {/* Text area */}
            <div className="flex flex-col flex-grow p-5">
              <h3
                className="mb-1.5 text-white uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em" }}
              >
                {cat.title}
              </h3>
              <p
                className="leading-relaxed text-zinc-500 flex-grow"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px" }}
              >
                {cat.desc}
              </p>

              {/* Arrow */}
              <div className="flex justify-end mt-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-[#080a0f] text-zinc-600 transition-all duration-300 group-hover:border-red-500/30 group-hover:text-[#FF003C] group-hover:bg-red-500/8">
                  <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}