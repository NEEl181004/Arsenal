"use client";

import Link from "next/link";
import { Search, LogOut, Menu, Sun, Bell } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TopNav({ onMenuClick, isCollapsed }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(val.trim())}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full h-16 bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.04] z-[60] flex justify-between items-center px-6 transition-all duration-300"
    >
      {/* Left Section: Branding & Navigation Links */}
      <div className="flex items-center gap-6 sm:gap-10 shrink-0">
        <div className="flex items-center gap-3">
            <button 
                onClick={onMenuClick} 
                className="w-9 h-9 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-primary hover:border-primary/30 transition-all rounded-sm cursor-pointer md:hidden"
            >
                <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
                {/* Custom Red Slash logo */}
                <svg className="w-5 h-5 text-primary group-hover:scale-105 transition-transform" viewBox="0 0 100 100" fill="none">
                    <path d="M70 10L30 90H10L50 10H70Z" fill="currentColor" />
                    <path d="M90 10L70 50H50L70 10H90Z" fill="currentColor" opacity="0.8" />
                </svg>
                <span className="text-lg font-black tracking-[0.25em] text-white group-hover:text-primary transition-colors leading-none">
                    ARSENAL
                </span>
            </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-primary transition-colors relative group">
                DOCUMENTATION
                <span className="absolute -bottom-5 left-0 w-full h-[2px] bg-primary"></span>
            </Link>
            <Link href="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group">
                ABOUT
            </Link>
        </div>
      </div>

      {/* Center Section: Tactical Search with Command-K / Shortcut */}
      <div className="flex-1 max-w-xl px-6 hidden md:block">
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-3.5 h-3.5 text-white/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input
                className="w-full bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.08] focus:border-primary/40 focus:bg-white/[0.03] transition-all px-10 py-2.5 rounded-sm text-xs font-medium tracking-[0.05em] text-white placeholder:text-white/20 focus:outline-none"
                placeholder="Search tools, techniques, or documentation..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-white/40">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
            </div>
        </div>
      </div>

      {/* Right Section: Theme, Notification & User Auth */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {/* Theme Toggle (Sun icon) */}
        <button className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors hover:bg-white/[0.02] rounded-full cursor-pointer">
            <Sun className="w-4 h-4" />
        </button>

        {/* Notification Bell */}
        <button className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white relative transition-colors hover:bg-white/[0.02] rounded-full cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-full border border-[#060608]">
                3
            </span>
        </button>

        {session ? (
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 cursor-pointer group/profile"
                >
                    <div className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/10 hover:border-primary/50 transition-all font-black text-white/50 text-sm flex items-center justify-center relative overflow-hidden">
                        {session.user?.name?.[0].toUpperCase() || "A"}
                    </div>
                </button>

                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute top-full right-0 mt-3 w-56 bg-[#0c0c0e] border border-white/10 shadow-2xl z-20 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                    {session.user?.name?.[0].toUpperCase() || "A"}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">{session.user?.name || "Operator"}</div>
                                    <div className="text-[10px] text-white/40 truncate">{session.user?.email || ""}</div>
                                </div>
                            </div>
                            <div className="p-1">
                                <button 
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-black uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/[0.03] transition-all text-left cursor-pointer group"
                                >
                                    <LogOut className="w-3.5 h-3.5 text-primary group-hover:scale-105 transition-transform" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
          ) : (
            <Link
              href="/#login"
              className="px-5 py-2 border border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary text-white font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-sm"
            >
              Log in
            </Link>
          )}
      </div>
    </nav>
  );
}
