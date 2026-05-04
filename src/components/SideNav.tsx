"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Zap, 
    Settings, 
    Terminal as TerminalIcon,
    AlertTriangle,
    ShieldCheck,
    FileText,
    Activity,
    Box,
    Search,
    Shield,
    Target,
    Layers,
    Menu,
    ChevronLeft,
    ChevronRight,
    X,
    LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function SideNav({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: any) {
    const pathname = usePathname();
    const isToolPage = pathname.startsWith("/tools/") && !pathname.endsWith("/edit");
    const [activeSection, setActiveSection] = useState("");

    const sections = [
        { id: "overview", label: "OVERVIEW", icon: Target },
        { id: "core", label: "CORE MODULE", icon: Layers },
        { id: "environment", label: "ENV & INSTALL", icon: Zap },
        { id: "scenarios", label: "TEST SCENARIO", icon: Activity },
        { id: "diagnostics", label: "DIAGNOSTICS", icon: AlertTriangle },
        { id: "references", label: "REFERENCES", icon: FileText },
    ];

    useEffect(() => {
        if (!isToolPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "-10% 0% -80% 0%" }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isToolPage]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100,
                behavior: "smooth",
            });
        }
    };

    const NavItem = ({ href, icon: Icon, label, active }: any) => (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-6 py-2.5 transition-all duration-300 group ${
                active 
                ? "text-primary bg-primary/[0.03] border-r-2 border-primary" 
                : "text-white/20 hover:text-white"
            }`}
        >
            <Icon className={`w-4 h-4 transition-colors ${active ? "text-primary" : "group-hover:text-white"}`} />
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">{label}</span>
        </Link>
    );

    const ToolNavItem = ({ id, icon: Icon, label, active }: any) => (
        <button 
            onClick={() => scrollToSection(id)}
            className={`w-full flex items-center gap-3 px-6 py-2.5 transition-all duration-300 group text-left ${
                active 
                ? "text-primary bg-primary/[0.03] border-r-2 border-primary" 
                : "text-white/20 hover:text-white"
            }`}
        >
            <Icon className={`w-4 h-4 transition-colors ${active ? "text-primary" : "group-hover:text-white"}`} />
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">{label}</span>
        </button>
    );

    return (
        <>
            {/* Mobile Overlay Backdrop — only shown on small screens */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* 
              Mobile: fixed overlay drawer (slides in from left)
              Tablet/Desktop: sticky sidebar that PUSHES content (no overlay)
            */}
            <aside className={`
                shrink-0 border-r border-white/[0.03] bg-[#0a0a0a] flex-col pt-10
                transition-all duration-300
                ${
                    isCollapsed ? "hidden md:flex md:w-20" : "hidden md:flex md:w-56 lg:w-64"
                }
                md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:overflow-y-auto
            `}>
                
                {/* Collapse Toggle (Desktop) */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-primary rounded-full items-center justify-center text-white shadow-lg z-50"
                >
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                {/* Close Button (Mobile) */}
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute right-4 top-6 text-white/40"
                >
                    <X className="w-6 h-6" />
                </button>



                <nav className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
                    <div className="px-6 mb-6">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">
                            {isCollapsed ? "NAV" : (isToolPage ? "MISSION_NAV" : "VAULT_INDEX")}
                        </span>
                    </div>
                    {isToolPage ? (
                        sections.map((section) => (
                            <ToolNavItem 
                                key={section.id} 
                                id={section.id} 
                                icon={section.icon} 
                                label={isCollapsed ? "" : section.label} 
                                active={activeSection === section.id} 
                            />
                        ))
                    ) : (
                        <div className="space-y-1">
                            <NavItem href="/" icon={LayoutDashboard} label={isCollapsed ? "" : "Operations"} active={pathname === "/"} />
                            <NavItem href="/?category=Exploitation" icon={Zap} label={isCollapsed ? "" : "Exploitation"} active={pathname.includes("Exploitation")} />
                            <NavItem href="/?category=Discovery" icon={Search} label={isCollapsed ? "" : "Discovery"} active={pathname.includes("Discovery")} />
                            <NavItem href="/?category=Payloads" icon={Box} label={isCollapsed ? "" : "Payloads"} active={pathname.includes("Payloads")} />
                        </div>
                    )}
                </nav>

                {!isCollapsed && (
                    <div className="p-6 relative mt-auto border-t border-white/5">
                        <button 
                            onClick={() => signOut()}
                            className="w-full bg-primary/10 text-primary font-black text-[11px] py-4 tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all uppercase border border-primary/20 shadow-[0_0_20px_rgba(255,0,60,0.1)] group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            TERMINATE SESSION
                        </button>
                    </div>
                )}
            </aside>

            {/* Mobile Drawer — fixed overlay, shown only when isMobileOpen */}
            <aside className={`
                fixed left-0 top-0 h-full w-64 z-[70]
                border-r border-white/[0.03] bg-[#0a0a0a] flex flex-col pt-10
                transition-transform duration-300 md:hidden
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                {/* Close Button (Mobile) */}
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute right-4 top-6 text-white/40"
                >
                    <X className="w-6 h-6" />
                </button>



                <nav className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="px-6 mb-6">
                        <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">
                            {isToolPage ? "MISSION_NAV" : "VAULT_INDEX"}
                        </span>
                    </div>
                    {isToolPage ? (
                        sections.map((section) => (
                            <ToolNavItem key={section.id} id={section.id} icon={section.icon} label={section.label} active={activeSection === section.id} />
                        ))
                    ) : (
                        <div className="space-y-1">
                            <NavItem href="/" icon={LayoutDashboard} label="Operations" active={pathname === "/"} />
                            <NavItem href="/?category=Exploitation" icon={Zap} label="Exploitation" active={pathname.includes("Exploitation")} />
                            <NavItem href="/?category=Discovery" icon={Search} label="Discovery" active={pathname.includes("Discovery")} />
                            <NavItem href="/?category=Payloads" icon={Box} label="Payloads" active={pathname.includes("Payloads")} />
                        </div>
                    )}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5">
                    <button 
                        onClick={() => signOut()}
                        className="w-full bg-primary/10 text-primary font-black text-[10px] py-4 tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all uppercase border border-primary/20 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        TERMINATE SESSION
                    </button>
                </div>
            </aside>
        </>
    );
}
