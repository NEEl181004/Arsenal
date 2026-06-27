"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import AuthModal from "@/components/AuthModal";
import { ShieldAlert, BookOpen, Users, Terminal, ArrowRight, ShieldCheck, Database, Target } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openLogin = () => { setAuthTab("login"); setAuthOpen(true); };
  const openSignup = () => { setAuthTab("signup"); setAuthOpen(true); };
  const closeAuth = () => { setAuthOpen(false); history.replaceState(null, "", "/about"); };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#login") openLogin();
    if (hash === "#signup") openSignup();
  }, []);

  const pillars = [
    {
      title: "Comprehensive Knowledge",
      desc: "We aggregate and document advanced tradecraft across all phases of the attack lifecycle, from initial access to objective completion.",
      icon: BookOpen
    },
    {
      title: "Practical Scenarios",
      desc: "Theory is useless without execution. Arsenal focuses on real-world applicability, providing weaponized examples and execution chains.",
      icon: Terminal
    },
    {
      title: "Community Driven",
      desc: "Built by operators, for operators. The landscape evolves daily, and our community ensures our techniques stay sharp and relevant.",
      icon: Users
    },
    {
      title: "Operational Security",
      desc: "Emphasizing stealth, evasion, and OPSEC in every tool and technique documented. Because getting caught is not an option.",
      icon: ShieldAlert
    }
  ];

  return (
    <main className="min-h-screen bg-[#05070B] text-white overflow-x-hidden">
      <Navbar onLoginOpen={openLogin} onSignupOpen={openSignup} />
      <BackgroundEffects />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10 pt-20 pb-32">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="font-mono text-[#FF003C] uppercase mb-4"
              style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em" }}
            >
              /// OUR MISSION
            </p>
            <h1
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 8vw, 5rem)", letterSpacing: "-0.01em" }}
            >
              WEAPONIZING <br />
              <span style={{ color: "#FF003C", textShadow: "0 0 30px rgba(255,0,60,0.4)" }}>TRADECRAFT</span>
            </h1>
            <p
              className="max-w-2xl mx-auto leading-relaxed text-zinc-400"
              style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "1rem" }}
            >
              Arsenal is more than just documentation. It is the ultimate repository for modern red team operations, 
              designed to bridge the gap between theoretical knowledge and practical execution.
            </p>
          </motion.div>
        </div>

        {/* Pillars Section */}
        <div className="relative z-10 mb-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((pillar, i) => {
                    const Icon = pillar.icon;
                    return (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-8 rounded-2xl border border-zinc-800/60 bg-[#040507]/70 backdrop-blur-sm group hover:border-red-500/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                                <Icon className="w-6 h-6 text-[#FF003C]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-mono tracking-wide">{pillar.title}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed font-sans">{pillar.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        {/* Story Section */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
            >
                <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-barlow), sans-serif", letterSpacing: "0.02em" }}>
                    BUILT FOR THE MODERN OPERATOR
                </h2>
                <div className="space-y-4 text-zinc-400 text-sm leading-relaxed font-sans">
                    <p>
                        The cybersecurity landscape is asymmetric. Defenders have to secure everything; attackers only need to find one flaw. 
                        However, as defenses mature, the barrier to entry for successful red team operations has skyrocketed.
                    </p>
                    <p>
                        We created Arsenal because we were tired of fragmented documentation, outdated blogs, and disparate tools. 
                        We needed a single source of truth—a centralized hub where tradecraft is not just listed, but contextualized, explained, and ready for deployment.
                    </p>
                    <p>
                        Whether you are navigating complex active directory environments, bypassing EDR solutions, or establishing persistent footholds, 
                        Arsenal provides the actionable intelligence required to succeed.
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative h-[400px] rounded-2xl border border-zinc-800/60 bg-black/40 overflow-hidden flex items-center justify-center"
            >
                {/* Abstract graphic */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-red-600/10 blur-[80px]" />
                
                <div className="relative z-10 grid grid-cols-2 gap-4 p-8">
                    <div className="p-4 border border-zinc-800 rounded-lg bg-black/60 flex flex-col items-center justify-center gap-3">
                        <Target className="w-8 h-8 text-zinc-500" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Precision</span>
                    </div>
                    <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5 flex flex-col items-center justify-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-[#FF003C]" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF003C]">Evasion</span>
                    </div>
                    <div className="p-4 border border-zinc-800 rounded-lg bg-black/60 flex flex-col items-center justify-center gap-3">
                        <Database className="w-8 h-8 text-zinc-500" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Persistence</span>
                    </div>
                    <div className="p-4 border border-zinc-800 rounded-lg bg-black/60 flex flex-col items-center justify-center gap-3">
                        <Terminal className="w-8 h-8 text-zinc-500" />
                        <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Execution</span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* CTA */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center text-center p-12 rounded-2xl border border-red-500/20 bg-red-500/5"
        >
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-barlow), sans-serif", letterSpacing: "0.02em" }}>READY TO DIVE IN?</h2>
            <p className="text-sm text-zinc-400 mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
                Join the platform, explore the documentation, and start elevating your operational capabilities today.
            </p>
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        const hash = window.location.hash;
                        history.replaceState(null, "", "/#signup");
                        openSignup();
                    }}
                    className="flex items-center gap-2 bg-[#FF003C] hover:bg-red-600 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                    Create Account <ArrowRight className="w-4 h-4" />
                </button>
                <Link 
                    href="/dashboard"
                    className="flex items-center gap-2 bg-transparent border border-zinc-700 hover:border-zinc-500 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                    Explore Docs
                </Link>
            </div>
        </motion.div>

      </div>

      <Footer />
      <AuthModal open={authOpen} defaultTab={authTab} onClose={closeAuth} />
    </main>
  );
}
