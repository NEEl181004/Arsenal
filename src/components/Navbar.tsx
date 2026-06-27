"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, LogIn, LogOut, User, Menu } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onLoginOpen?: () => void;
  onSignupOpen?: () => void;
  onMenuClick?: () => void;
}

export default function Navbar({ onLoginOpen, onSignupOpen, onMenuClick }: NavbarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchVal, setSearchVal]     = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* close profile dropdown on outside click */
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    if (!session) {
      // Not logged in — open login modal if callback available, else go to #login
      if (onLoginOpen) onLoginOpen();
      else router.push("/#login");
      return;
    }
    router.push(`/dashboard?search=${encodeURIComponent(searchVal.trim())}`);
  };

  const handleSearchChange = (val: string) => {
    setSearchVal(val);
  };

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: "linear-gradient(to bottom, rgba(10, 16, 29, 0.95), rgba(2, 3, 6, 0.95))",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />

      <div className="flex h-[60px] w-full items-center justify-between px-4 md:px-6 gap-4">

        <div className="flex items-center gap-4 shrink-0">
          {onMenuClick && (
            <button 
                onClick={onMenuClick} 
                className="w-9 h-9 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-[#FF003C] hover:border-[#FF003C]/30 transition-all rounded-sm cursor-pointer"
            >
                <Menu className="w-4 h-4" />
            </button>
          )}
          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2.5">
            <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5 cursor-pointer">
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path d="M15 80 L35 20 L50 20 L30 80 Z" fill="#FF003C" />
                <path d="M42 80 L58 45 L78 20 H93 L68 80 Z" fill="#FF003C" />
                <path d="M38 52 L58 52 L55 60 L35 60 Z" fill="#FF003C" opacity="0.9" />
              </svg>
              <span style={{ fontFamily: "var(--font-barlow),sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.22em", color: "white" }}>
                ARSENAL
              </span>
            </motion.div>
          </Link>
        </div>

        {/* ── CENTER NAV LINKS ── */}
        <nav className="hidden md:flex items-center gap-7 shrink-0"
          style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "rgb(113,113,122)" }}>
          <button
            onClick={() => {
              if (session) router.push("/dashboard");
              else if (onLoginOpen) onLoginOpen();
              else router.push("/#login");
            }}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter),sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "rgb(113,113,122)" }}
            className="transition-colors duration-200 hover:text-white"
          >
            DOCUMENTATION
          </button>
          <Link href="/about" className="transition-colors duration-200 hover:text-white">ABOUT</Link>
        </nav>

        {/* ── SEARCH BAR ── */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden lg:flex">
          <div
            className="relative w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 group"
            style={{ background: "rgba(8,10,14,0.9)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "var(--font-inter),sans-serif" }}
          >
            <Search size={13} className="text-zinc-700 shrink-0 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              value={searchVal}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search tools, techniques..."
              className="bg-transparent text-xs text-white placeholder-zinc-700 focus:outline-none w-full"
              style={{ fontFamily: "var(--font-inter),sans-serif" }}
            />
            {searchVal ? (
              <button type="submit" className="shrink-0 text-[#FF003C] hover:opacity-80 transition-opacity">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            ) : (
              <span className="shrink-0 text-zinc-700 border border-zinc-800 bg-[#08090d] rounded px-1.5 py-0.5" style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}>⌘ K</span>
            )}
          </div>
        </form>

        {/* ── RIGHT: session-aware ── */}
        <div className="flex items-center gap-2 shrink-0">
          {!mounted || status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : session ? (
            /* ── Logged in: profile avatar ── */
            <div ref={profileRef} className="relative">
              <motion.button
                onClick={() => setProfileOpen(p => !p)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-200"
                  style={{ background: "rgba(255,0,60,0.15)", border: "1.5px solid rgba(255,0,60,0.3)" }}
                >
                  {session.user?.name?.[0]?.toUpperCase() ?? <User size={14} />}
                </div>
                <span className="hidden md:block text-xs text-white/70" style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600 }}>
                  {session.user?.name?.split(" ")[0] ?? "Operator"}
                </span>
              </motion.button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-3 w-56 overflow-hidden"
                    style={{ background: "rgba(10,11,18,0.98)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.8)", zIndex: 100 }}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: "rgba(255,0,60,0.15)", border: "1px solid rgba(255,0,60,0.25)", color: "#FF003C" }}>
                        {session.user?.name?.[0]?.toUpperCase() ?? "A"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate" style={{ fontFamily: "var(--font-inter),sans-serif" }}>{session.user?.name ?? "Operator"}</div>
                        <div className="text-[10px] text-white/40 truncate" style={{ fontFamily: "var(--font-inter),sans-serif" }}>{session.user?.email ?? ""}</div>
                      </div>
                    </div>
                    {/* Links */}
                    <div className="p-1.5">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all w-full"
                        style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        Dashboard
                      </Link>
                      <button onClick={() => { setProfileOpen(false); signOut(); }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-red-400 hover:bg-red-500/8 transition-all w-full text-left"
                        style={{ fontFamily: "var(--font-inter),sans-serif", fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}>
                        <LogOut size={13} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── Not logged in: Login button ── */
            <motion.button
              onClick={onLoginOpen}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200"
              style={{ fontFamily: "var(--font-inter),sans-serif", letterSpacing: "0.08em", background: "rgba(8,10,14,0.9)", border: "1px solid rgba(255,0,60,0.38)", color: "white", cursor: "pointer" }}
            >
              <LogIn size={13} strokeWidth={2.2} />
              Log in
            </motion.button>
          )}
        </div>

      </div>
    </motion.header>
  );
}