"use client";

import Link from "next/link";
import { Search, LogOut, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TopNav({ onMenuClick, isCollapsed }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      router.push(`/?search=${encodeURIComponent(val.trim())}`);
    } else {
      router.push("/");
    }
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 w-full h-16 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.05] z-[60] flex justify-between items-center px-6 transition-all duration-300"
    >
      {/* Left Section: Branding & Control */}
      <div className="flex items-center gap-4 sm:gap-8 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
            <button 
                onClick={onMenuClick} 
                className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-primary hover:border-primary/40 transition-all rounded-sm cursor-pointer"
            >
                <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex flex-col group">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">
                    ARSENAL
                </span>
                <span className="text-[10px] font-black text-primary tracking-[0.4em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                    COMMAND CENTER
                </span>
            </Link>
        </div>

        <div className="hidden lg:flex items-center h-8 w-[1px] bg-white/[0.05]" />

        <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-xs font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group">
                DOCUMENTATION
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
        </div>
      </div>

      {/* Center Section: Tactical Search */}
      <div className="flex-1 max-w-2xl px-4 sm:px-12 hidden md:block">
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input
                className="w-full bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.1] focus:border-primary/40 focus:bg-white/[0.04] transition-all px-12 py-2.5 text-xs font-black tracking-[0.1em] text-white placeholder:text-white/10 uppercase focus:outline-none"
                placeholder="SEARCH DATABASE..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-primary">$</span>
            </div>
        </div>
      </div>

      {/* Right Section: Profile & Auth */}
      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          {session ? (
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-white/10 group/profile cursor-pointer"
                >
                    <div className="relative group/avatar">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/[0.03] border border-white/[0.1] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-primary/50 transition-all font-headline font-black text-white/40 text-sm sm:text-lg group-hover/avatar:text-primary">
                            {session.user?.name?.[0].toUpperCase() || "U"}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-1/2 w-full -translate-y-full group-hover/avatar:animate-[scan_2s_linear_infinite] pointer-events-none opacity-0 group-hover/avatar:opacity-100"></div>
                            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-primary/40"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-primary/40"></div>
                        </div>
                    </div>
                </button>

                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute top-full right-0 mt-4 w-56 bg-[#0c0c0c] border border-white/10 shadow-2xl z-20 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                    {session.user?.name?.[0].toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">{session.user?.name || "User"}</div>
                                    <div className="text-[10px] text-white/40 truncate">{session.user?.email || ""}</div>
                                </div>
                            </div>
                            <div className="p-1.5">
                                <button 
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.05] rounded transition-all text-left cursor-pointer group"
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
              href="/login"
              className="px-4 sm:px-8 py-2 sm:py-2.5 bg-primary text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)]"
            >
              LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
