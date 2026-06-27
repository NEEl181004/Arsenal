"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home,
    Layers,
    Wrench,
    Activity,
    ShieldAlert,
    BookOpen,
    FileText,
    Box,
    Terminal,
    ShieldCheck,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SideNav({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: any) {
    const pathname = usePathname();
    const isToolPage = pathname.startsWith("/tools/") && !pathname.endsWith("/edit");
    const [activeSection, setActiveSection] = useState("");

    const dashboardSections = [
        { id: "reconnaissance", label: "Reconnaissance", icon: Home, href: "/dashboard?category=Reconnaissance" },
        { id: "initial-access", label: "Initial Access", icon: Layers, href: "/dashboard?category=Initial Access" },
        { id: "execution", label: "Execution", icon: Terminal, href: "/dashboard?category=Execution" },
        { id: "lateral-movement", label: "Lateral Movement", icon: Activity, href: "/dashboard?category=Lateral Movement" },
        { id: "privilege-escalation", label: "Privilege Escalation", icon: ShieldAlert, href: "/dashboard?category=Privilege Escalation" },
        { id: "defense-evasion", label: "Defense Evasion", icon: ShieldCheck, href: "/dashboard?category=Defense Evasion" },
        { id: "impact", label: "Impact", icon: Box, href: "/dashboard?category=Impact" },
    ];

    const toolSections = [
        { id: "overview", label: "Overview", icon: BookOpen },
        { id: "core", label: "Core", icon: Box },
        { id: "installation", label: "Installation", icon: Terminal },
        { id: "scenarios", label: "Scenarios", icon: Activity },
        { id: "diagnostics", label: "Diagnostics", icon: ShieldAlert },
        { id: "references", label: "References", icon: FileText },
    ];

    const sections = isToolPage ? toolSections : dashboardSections;

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

    const NavItem = ({ href, icon: Icon, label, active, onClick }: any) => (
        <Link 
            href={href} 
            onClick={onClick}
            className={`flex items-center transition-all duration-300 group ${
                isCollapsed 
                ? "justify-center py-3 mx-2 rounded-lg" 
                : "gap-3 px-6 py-3 border-l-2"
            } ${
                active 
                ? isCollapsed 
                    ? "bg-[#FF003C]/10 text-[#FF003C]"
                    : "text-white bg-gradient-to-r from-[#FF003C]/[0.08] to-transparent border-[#FF003C]"
                : isCollapsed
                    ? "text-white/40 hover:text-white hover:bg-white/[0.04]"
                    : "text-white/40 hover:text-white hover:bg-white/[0.02] border-transparent"
            }`}
            title={isCollapsed ? label : undefined}
        >
            <Icon className={`w-4 h-4 transition-colors shrink-0 ${active ? "text-[#FF003C]" : "group-hover:text-white"}`} strokeWidth={active ? 2.5 : 2} />
            {!isCollapsed && <span className={`text-[12px] uppercase tracking-widest whitespace-nowrap ${active ? "font-black" : "font-bold"}`} style={{ fontFamily: "var(--font-barlow), sans-serif" }}>{label}</span>}
        </Link>
    );

    const ToolNavItem = ({ id, icon: Icon, label, active }: any) => (
        <button 
            onClick={() => scrollToSection(id)}
            className={`w-full flex items-center transition-all duration-300 group text-left ${
                isCollapsed 
                ? "justify-center py-3 mx-2 rounded-lg" 
                : "gap-3 px-6 py-3 border-l-2"
            } ${
                active 
                ? isCollapsed 
                    ? "bg-[#FF003C]/10 text-[#FF003C]"
                    : "text-white bg-gradient-to-r from-[#FF003C]/[0.08] to-transparent border-[#FF003C]"
                : isCollapsed
                    ? "text-white/40 hover:text-white hover:bg-white/[0.04]"
                    : "text-white/40 hover:text-white hover:bg-white/[0.02] border-transparent"
            }`}
            title={isCollapsed ? label : undefined}
        >
            <Icon className={`w-4 h-4 transition-colors shrink-0 ${active ? "text-[#FF003C]" : "group-hover:text-white"}`} strokeWidth={active ? 2.5 : 2} />
            {!isCollapsed && <span className={`text-[12px] uppercase tracking-widest whitespace-nowrap ${active ? "font-black" : "font-bold"}`} style={{ fontFamily: "var(--font-barlow), sans-serif" }}>{label}</span>}
        </button>
    );

    const isSectionActive = (section: any) => {
        if (isToolPage) {
            if (!activeSection && section.id === "overview") return true; // Default to overview
            return activeSection === section.id;
        }
        return false;
    };

    const SidebarContent = () => (
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col h-full pt-2 pb-6">
            <div className="space-y-6">
                <div>
                    {!isCollapsed && (
                        <div className="px-6 mb-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                            {isToolPage ? "NAVIGATION" : "CATEGORIES"}
                        </div>
                    )}
                    <div className="space-y-1">
                        {sections.map((section) => 
                            isToolPage ? (
                                <ToolNavItem 
                                    key={section.id} 
                                    id={section.id} 
                                    icon={section.icon} 
                                    label={section.label} 
                                    active={isSectionActive(section)} 
                                />
                            ) : (
                                <NavItem 
                                    key={section.id} 
                                    href={section.href} 
                                    icon={section.icon} 
                                    label={section.label} 
                                    active={pathname === "/dashboard" && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("category") === section.label} 
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
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

            {/* Sticky sidebar that pushes content */}
            <aside className={`
                relative shrink-0 border-r border-white/[0.03] bg-[#060608] flex flex-col pt-4
                transition-all duration-300
                ${
                    isCollapsed ? "hidden md:flex md:w-20" : "hidden md:flex md:w-56 lg:w-64"
                }
                md:sticky md:top-16 md:h-[calc(100vh-4rem)]
            `}>
                <SidebarContent />
            </aside>

            {/* Mobile Drawer — fixed overlay */}
            <aside className={`
                fixed left-0 top-0 h-full w-64 z-[70]
                border-r border-white/[0.03] bg-[#060608] flex flex-col pt-10
                transition-transform duration-300 md:hidden
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
                <SidebarContent />
            </aside>
        </>
    );
}
