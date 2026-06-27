"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl border border-zinc-800/60 bg-[#040507]/70 backdrop-blur-sm"
        style={{ minHeight: 320 }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-red-600/12 blur-[120px]" />
          <div className="absolute -bottom-10 left-10 h-[200px] w-[200px] rounded-full bg-red-800/8 blur-[80px]" />
        </div>

        {/* Cyber grid texture */}
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 items-center lg:grid-cols-2 gap-0">

          {/* ── LEFT TEXT ── */}
          <div className="px-10 py-14 md:px-14">
            <p
              className="text-[#FF003C] uppercase mb-3"
              style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em" }}
            >
              JOIN THE COMMUNITY
            </p>

            <h2
              className="text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-barlow), var(--font-display), sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", letterSpacing: "0.01em" }}
            >
              Stronger Together
            </h2>

            <p
              className="max-w-sm leading-relaxed text-zinc-400 mb-8"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.875rem" }}
            >
              Contribute, share knowledge, and help make Arsenal the ultimate
              resource for red teamers worldwide.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Discord */}
              <motion.a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(255,0,60,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 rounded-lg bg-[#FF003C] hover:bg-red-600 px-5 py-2.5 text-[11px] font-bold text-white transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                </svg>
                Join Discord
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, borderColor: "rgba(255,0,60,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-[#050608]/90 px-5 py-2.5 text-[11px] font-bold text-zinc-300 transition-all duration-200 cursor-pointer hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Contribute on GitHub
              </motion.a>
            </div>
          </div>

          {/* ── RIGHT WORLD MAP GRAPHIC ── */}
          <div className="relative h-[320px] lg:h-full min-h-[280px] overflow-hidden border-t lg:border-t-0 lg:border-l border-zinc-800/40">
            {/* Red glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600/20 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-64 rounded-full bg-red-600/30 blur-[60px] pointer-events-none z-10" />

            <svg viewBox="0 0 520 320" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="ctaMapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF003C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FF003C" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Globe rings */}
              <ellipse cx="260" cy="130" rx="180" ry="90" stroke="rgba(255,0,60,0.06)" strokeWidth="1" fill="none" />
              <ellipse cx="260" cy="130" rx="130" ry="65" stroke="rgba(255,0,60,0.08)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
              <ellipse cx="260" cy="130" rx="80" ry="40" stroke="rgba(255,0,60,0.06)" strokeWidth="1" strokeDasharray="2 6" fill="none" />
              <circle cx="260" cy="130" r="230" fill="url(#ctaMapGlow)" />

              {/* World map dots - continents */}
              <g fill="#FF003C">
                {/* N America */}
                {[[75,55],[90,62],[105,70],[88,80],[78,88],[65,72]].map(([x,y],i)=>(
                  <circle key={`na${i}`} cx={x} cy={y} r={2+((i*7)%10)/10*1.5} opacity={0.3+((i*3)%10)/10*0.3} />
                ))}
                {/* S America */}
                {[[130,150],[140,168],[145,188],[128,172],[122,160]].map(([x,y],i)=>(
                  <circle key={`sa${i}`} cx={x} cy={y} r={1.5+((i*5)%10)/10*2} opacity={0.25+((i*7)%10)/10*0.25} />
                ))}
                {/* Europe */}
                {[[230,52],[245,60],[255,68],[240,74],[225,62],[252,56]].map(([x,y],i)=>(
                  <circle key={`eu${i}`} cx={x} cy={y} r={2+((i*11)%10)/10*1.5} opacity={0.3+((i*13)%10)/10*0.3} />
                ))}
                {/* Africa */}
                {[[245,100],[255,120],[265,140],[250,155],[240,130],[262,108]].map(([x,y],i)=>(
                  <circle key={`af${i}`} cx={x} cy={y} r={2+((i*17)%10)/10*2} opacity={0.25+((i*19)%10)/10*0.3} />
                ))}
                {/* Asia */}
                {[[310,48],[340,55],[368,62],[355,78],[320,75],[390,68],[375,85],[285,64]].map(([x,y],i)=>(
                  <circle key={`as${i}`} cx={x} cy={y} r={2+((i*23)%10)/10*2} opacity={0.3+((i*29)%10)/10*0.3} />
                ))}
                {/* Aus */}
                {[[400,185],[420,192],[410,200]].map(([x,y],i)=>(
                  <circle key={`au${i}`} cx={x} cy={y} r={2+((i*31)%10)/10*2} opacity={0.25+((i*37)%10)/10*0.25} />
                ))}
              </g>

              {/* Connection lines */}
              <g stroke="rgba(255,0,60,0.3)" strokeWidth="0.8" fill="none">
                <line x1="105" y1="70" x2="245" y2="60" />
                <line x1="245" y1="60" x2="340" y2="55" />
                <line x1="340" y1="55" x2="255" y2="120" />
                <line x1="255" y1="120" x2="130" y2="150" />
              </g>

              {/* Crosshair at center */}
              <g stroke="rgba(255,0,60,0.5)" strokeWidth="1.2">
                <line x1="248" y1="130" x2="272" y2="130" />
                <line x1="260" y1="118" x2="260" y2="142" />
                <circle cx="260" cy="130" r="9" strokeWidth="1" />
              </g>

              {/* Operator silhouettes */}
              <g fill="#020305">
                {/* Silhouette 1 */}
                <circle cx="172" cy="218" r="9" />
                <path d="M155,320 L155,238 C155,232 162,227 172,227 C182,227 189,232 189,238 L189,320 Z" />
                <path d="M158,238 L186,238" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                {/* Silhouette 2 (taller, center) */}
                <circle cx="218" cy="205" r="11" />
                <path d="M198,320 L198,225 C198,218 206,212 218,212 C230,212 238,218 238,225 L238,320 Z" />

                {/* Silhouette 3 (tallest, center) */}
                <circle cx="262" cy="200" r="11" />
                <path d="M242,320 L242,220 C242,213 250,207 262,207 C274,207 282,213 282,220 L282,320 Z" />

                {/* Silhouette 4 */}
                <circle cx="318" cy="215" r="9" />
                <path d="M300,320 L300,236 C300,230 307,224 318,224 C329,224 336,230 336,236 L336,320 Z" />
              </g>

              {/* Bottom ground cover */}
              <rect x="0" y="300" width="520" height="25" fill="#040507" />
            </svg>
          </div>

        </div>
      </motion.div>
    </section>
  );
}