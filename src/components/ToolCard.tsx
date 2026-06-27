"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, Monitor, Laptop, TerminalIcon, ArrowRight } from "lucide-react";

export const categoryIcons: Record<string, React.ReactNode> = {
  Reconnaissance: (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="gRecon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6E0019" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="none" />
      <polygon points="50,25 75,40 75,70 50,85 25,70 25,40" stroke="rgba(255,0,60,0.12)" strokeWidth="1" fill="none" />
      <circle cx="50" cy="38" r="11" fill="url(#gRecon)" />
      <path d="M29,78 C29,62 38,56 50,56 C62,56 71,62 71,78 Z" fill="url(#gRecon)" />
      <path d="M36,31 L64,31" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="38" cy="38" r="4" stroke="#FF003C" strokeWidth="1.5" fill="none" />
      <circle cx="62" cy="38" r="4" stroke="#FF003C" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  "Initial Access": (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="gAccess" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6E0019" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="28" y="15" width="44" height="72" rx="4" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
      <rect x="35" y="12" width="30" height="68" rx="3" stroke="#FF003C" strokeWidth="1.5" fill="#0A0608" />
      <path d="M35,12 L65,12 L65,80 L35,80 Z" fill="url(#gAccess)" opacity="0.15" />
      <line x1="50" y1="36" x2="50" y2="54" stroke="#FF3B62" strokeWidth="3" strokeLinecap="round" />
      <path d="M43,44 L50,54 L57,44" stroke="#FF3B62" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="46" r="2.5" fill="#FF003C" opacity="0.6" />
    </svg>
  ),
  "Lateral Movement": (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="20" width="70" height="52" rx="5" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
        <rect x="15" y="20" width="70" height="12" rx="5" fill="rgba(255,0,60,0.08)" />
        <circle cx="25" cy="26" r="2" fill="#FF003C" opacity="0.7" />
        <circle cx="33" cy="26" r="2" fill="rgba(255,60,60,0.4)" />
        <circle cx="41" cy="26" r="2" fill="rgba(255,60,60,0.25)" />
        <path d="M26,42 L36,49 L26,56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="40" y1="56" x2="64" y2="56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="42" x2="68" y2="42" stroke="rgba(255,0,60,0.3)" strokeWidth="1.5" />
        <line x1="40" y1="49" x2="58" y2="49" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
    </svg>
  ),
  Execution: (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
        <rect x="15" y="20" width="70" height="52" rx="5" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
        <rect x="15" y="20" width="70" height="12" rx="5" fill="rgba(255,0,60,0.08)" />
        <circle cx="25" cy="26" r="2" fill="#FF003C" opacity="0.7" />
        <circle cx="33" cy="26" r="2" fill="rgba(255,60,60,0.4)" />
        <circle cx="41" cy="26" r="2" fill="rgba(255,60,60,0.25)" />
        <path d="M26,42 L36,49 L26,56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="40" y1="56" x2="64" y2="56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="40" y1="42" x2="68" y2="42" stroke="rgba(255,0,60,0.3)" strokeWidth="1.5" />
        <line x1="40" y1="49" x2="58" y2="49" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
    </svg>
  ),
  "Privilege Escalation": (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="22" r="8" stroke="#FF003C" strokeWidth="2" fill="#1A0207" />
      <circle cx="28" cy="52" r="7" stroke="rgba(255,0,60,0.45)" strokeWidth="1.5" fill="#100105" />
      <circle cx="72" cy="52" r="7" stroke="rgba(255,0,60,0.45)" strokeWidth="1.5" fill="#100105" />
      <circle cx="50" cy="78" r="7" stroke="rgba(255,0,60,0.3)" strokeWidth="1.5" fill="#0A0103" />
      <line x1="50" y1="86" x2="50" y2="30" stroke="#FF003C" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M44,33 L50,22 L56,33" stroke="#FF003C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="50" y1="30" x2="28" y2="45" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="72" y2="45" stroke="rgba(255,0,60,0.2)" strokeWidth="1.5" />
      <line x1="28" y1="59" x2="50" y2="71" stroke="rgba(255,0,60,0.15)" strokeWidth="1.5" />
      <line x1="72" y1="59" x2="50" y2="71" stroke="rgba(255,0,60,0.15)" strokeWidth="1.5" />
    </svg>
  ),
  "Defense Evasion": (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="gShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3B62" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6E0019" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M50,12 C65,12 80,18 80,32 C80,62 50,88 50,88 C50,88 20,62 20,32 C20,18 35,12 50,12 Z" stroke="#FF003C" strokeWidth="1.5" fill="url(#gShield)" />
      <line x1="35" y1="35" x2="65" y2="65" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <rect x="42" y="48" width="16" height="13" rx="2" fill="rgba(255,0,60,0.7)" />
      <path d="M46,48 L46,43 C46,39 54,39 54,43" stroke="#FF003C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M54,43 L56,40" stroke="rgba(255,0,60,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Impact: (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="gImpact" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF5070" />
          <stop offset="70%" stopColor="#CC0028" />
          <stop offset="100%" stopColor="#6E0019" />
        </radialGradient>
      </defs>
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
  // Default/Fallback icon if category matches none of the above
  Default: (
    <svg className="w-full h-full p-2" viewBox="0 0 100 100" fill="none">
      <rect x="15" y="20" width="70" height="52" rx="5" stroke="rgba(255,0,60,0.25)" strokeWidth="1.5" fill="#050608" />
      <rect x="15" y="20" width="70" height="12" rx="5" fill="rgba(255,0,60,0.08)" />
      <circle cx="25" cy="26" r="2" fill="#FF003C" opacity="0.7" />
      <circle cx="33" cy="26" r="2" fill="rgba(255,60,60,0.4)" />
      <circle cx="41" cy="26" r="2" fill="rgba(255,60,60,0.25)" />
      <path d="M26,42 L36,49 L26,56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="40" y1="56" x2="64" y2="56" stroke="#FF003C" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
};

function getCategorySVG(category: string) {
    if (!category) return categoryIcons.Default;
    for (const key of Object.keys(categoryIcons)) {
        if (category.toLowerCase().includes(key.toLowerCase())) {
            return categoryIcons[key];
        }
    }
    return categoryIcons.Default;
}

export default function ToolCard({ tool }: { tool: any }) {
    const tierRaw = (tool.tier || "Expert").toLowerCase();
    const tierColor = 
        tierRaw === "beginner" ? "text-green-500" :
        tierRaw === "intermediate" ? "text-orange-500" :
        "text-[#FF003C]";

    const getCategoryColor = (cat: string) => {
        const c = (cat || "").toLowerCase();
        if (c.includes("recon")) return "text-red-600 border-red-900/40 bg-red-900/10";
        if (c.includes("exploit") && !c.includes("post")) return "text-purple-500 border-purple-900/40 bg-purple-900/10";
        if (c.includes("privilege")) return "text-[#0088ff] border-blue-900/40 bg-blue-900/10";
        if (c.includes("post")) return "text-green-500 border-green-900/40 bg-green-900/10";
        if (c.includes("implant")) return "text-orange-500 border-orange-900/40 bg-orange-900/10";
        if (c.includes("defense")) return "text-red-600 border-red-900/40 bg-red-900/10";
        return "text-white/60 border-white/10 bg-white/5";
    };

    return (
        <motion.a
            href={`/tools/${tool._id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="block border border-white/[0.04] bg-[#020204] hover:border-white/10 transition-all duration-500 p-6 relative rounded-xl group flex flex-col justify-between h-[300px] cursor-pointer overflow-hidden shadow-lg"
        >
            {/* Top-left Red Radial Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_150px_150px_at_0%_0%,rgba(255,0,60,0.15)_0%,transparent_100%)] pointer-events-none" />
            {/* Top-left border highlight effect */}
            <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-[#FF003C]/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 h-1/3 w-[1px] bg-gradient-to-b from-[#FF003C]/40 to-transparent pointer-events-none" />

            {/* Bookmark top-right */}
            <button className="absolute top-5 right-5 text-white/20 hover:text-white transition-colors cursor-pointer z-10">
                <Bookmark className="w-4 h-4" />
            </button>

            {/* Logo Icon + Tool Name */}
            <div className="space-y-4 relative z-10 flex-1">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                        {getCategorySVG(tool.category)}
                    </div>
                    <h3 className="text-[17px] font-bold text-white group-hover:text-[#FF003C] transition-colors duration-300">
                        {tool.name}
                    </h3>
                </div>
                <p className="text-[13px] text-[#8b92a5] font-normal leading-relaxed line-clamp-3 pr-2">
                    {tool.bestFor || "Advanced utility engineered for offensive security replication, testing, and host exploration."}
                </p>
                <div className="pt-2">
                    <span className={`inline-block px-2.5 py-1.5 border text-[10px] font-semibold uppercase tracking-widest rounded-md ${getCategoryColor(tool.category)}`}>
                        {tool.category || "GENERAL"}
                    </span>
                </div>
            </div>

            {/* Specs Row & Navigation */}
            <div className="flex items-center justify-between pt-5 mt-auto relative z-10">
                <div className="flex items-center gap-3 text-[#5e6577]">
                    <Monitor className="w-[15px] h-[15px]" />
                    <Laptop className="w-[15px] h-[15px]" />
                    <TerminalIcon className="w-[15px] h-[15px]" />
                </div>

                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${tierColor}`}>
                        {tool.tier || "EXPERT"}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-transparent border border-white/10 group-hover:border-white/30 flex items-center justify-center text-white/50 group-hover:text-white transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </motion.a>
    );
}
