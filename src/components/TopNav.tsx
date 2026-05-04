"use client";

import Link from "next/link";
import { Search, LogOut, Bell, Settings, Menu, ShieldCheck, Activity, User, ChevronUp } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopNav({ onMenuClick, isCollapsed }: any) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full h-16 bg-[#050505]/60 backdrop-blur-xl border-b border-white/[0.05] z-[60] flex justify-between items-center px-6 transition-all duration-300"
    >
      {/* Left Section: Branding & Control */}
      <div className="flex items-center gap-4 sm:gap-8 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
            <button 
                onClick={onMenuClick} 
                className="w-10 h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-primary hover:border-primary/40 transition-all rounded-sm"
            >
                <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex flex-col group">
                <span className="text-xl sm:text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors leading-none">
                    ARSENAL
                </span>
                <span className="text-[8px] sm:text-[9px] font-black text-primary tracking-[0.4em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                    COMMAND CENTER
                </span>
            </Link>
        </div>

        <div className="hidden lg:flex items-center h-8 w-[1px] bg-white/[0.05]" />

        <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-[12px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group">
                DOCUMENTATION
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
        </div>
      </div>

      {/* Center Section: Tactical Search */}
      <div className="flex-1 max-w-2xl px-4 sm:px-12 hidden md:block">
        <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            </div>
            <input
                className="w-full bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.1] focus:border-primary/40 focus:bg-white/[0.04] transition-all px-12 py-2.5 text-[12px] font-black tracking-[0.1em] text-white placeholder:text-white/10 uppercase focus:outline-none"
                placeholder="SEARCH_MISSION_DATABASE..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-primary">$</span>
            </div>
        </form>
      </div>

      {/* Right Section: Security Clearance & Status */}
      <div className="flex items-center gap-2 sm:gap-6 shrink-0">
        <div className="hidden xl:flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">SYSTEM STATUS</span>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-primary uppercase tracking-tighter">OPERATIONAL</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]"></span>
                </div>
            </div>
        </div>

        <div className="hidden sm:block h-8 w-[1px] bg-white/[0.05]" />

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-white transition-all">
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full"></span>
          </button>
          
          <div className="hidden sm:block h-10 w-[1px] bg-white/[0.05]" />

          {session ? (
            <div className="relative">
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4 border-l border-white/10 group/profile"
                >
                    <div className="relative group/avatar">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/[0.03] border border-white/[0.1] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-primary/50 transition-all font-headline font-black text-white/40 text-sm sm:text-lg group-hover/avatar:text-primary">
                            {session.user?.name?.[0].toUpperCase() || "A"}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-1/2 w-full -translate-y-full group-hover/avatar:animate-[scan_2s_linear_infinite] pointer-events-none opacity-0 group-hover/avatar:opacity-100"></div>
                            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-primary/40"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-primary/40"></div>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 w-2 bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center">
                            <div className="w-1 w-1 bg-primary rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </button>

                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute top-full right-0 mt-4 w-64 bg-[#0a0a0a] border border-white/10 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center font-headline font-black text-primary text-xl">
                                    {session.user?.name?.[0].toUpperCase() || "A"}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">OPERATOR LOGGED IN</div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">CLEARANCE L4</div>
                                </div>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black text-white/40 hover:text-white hover:bg-white/[0.03] transition-all uppercase tracking-widest group">
                                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                                    SYSTEM SETTINGS
                                </button>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-[10px] font-black text-white/40 hover:text-white hover:bg-white/[0.03] transition-all uppercase tracking-widest group">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    ACCESS LOGS
                                </button>
                                <div className="h-[1px] bg-white/5 my-2 mx-4" />
                                <button 
                                    onClick={() => signOut()}
                                    className="w-full flex items-center gap-4 px-4 py-4 text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest group"
                                >
                                    <LogOut className="w-4 h-4" />
                                    TERMINATE SESSION
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 sm:px-8 py-2 sm:py-2.5 bg-primary text-white font-black text-[10px] sm:text-[12px] uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)]"
            >
              AUTH
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
