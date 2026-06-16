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
        { id: "overview", label: "Overview", icon: Target },
        { id: "core", label: "Core", icon: Layers },
        { id: "environment", label: "Installation", icon: Zap },
        { id: "scenarios", label: "Scenarios", icon: Activity },
        { id: "diagnostics", label: "Diagnostics", icon: AlertTriangle },
        { id: "references", label: "References", icon: FileText },
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
            className={`flex items-center transition-all duration-300 group ${
                isCollapsed 
                ? "justify-center py-3 px-0" 
                : "gap-3 px-6 py-2.5"
            } ${
                active 
                ? "text-primary bg-primary/[0.03] border-r-2 border-primary" 
                : "text-white/20 hover:text-white border-r-2 border-transparent"
            }`}
            title={isCollapsed ? label : undefined}
        >
            <Icon className={`w-4 h-4 transition-colors shrink-0 ${active ? "text-primary" : "group-hover:text-white"}`} />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        </Link>
    );

    const ToolNavItem = ({ id, icon: Icon, label, active }: any) => (
        <button 
            onClick={() => scrollToSection(id)}
            className={`w-full flex items-center transition-all duration-300 group text-left ${
                isCollapsed 
                ? "justify-center py-3 px-0" 
                : "gap-3 px-6 py-2.5"
            } ${
                active 
                ? "text-primary bg-primary/[0.03] border-r-2 border-primary" 
                : "text-white/20 hover:text-white border-r-2 border-transparent"
            }`}
            title={isCollapsed ? label : undefined}
        >
            <Icon className={`w-4 h-4 transition-colors shrink-0 ${active ? "text-primary" : "group-hover:text-white"}`} />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
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
                relative shrink-0 border-r border-white/[0.03] bg-[#0a0a0a] flex flex-col pt-10
                transition-all duration-300
                ${
                    isCollapsed ? "hidden md:flex md:w-20" : "hidden md:flex md:w-56 lg:w-64"
                }
                md:sticky md:top-14 md:h-[calc(100vh-3.5rem)]
            `}>
                
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-between overflow-x-hidden">
                    <nav className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden">
                        {!isCollapsed && (
                            <div className="px-6 mb-6">
                                <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
                                    {isToolPage ? "Navigation" : "Menu"}
                                </span>
                            </div>
                        )}
                        {isToolPage ? (
                            sections.map((section) => (
                                <ToolNavItem 
                                    key={section.id} 
                                    id={section.id} 
                                    icon={section.icon} 
                                    label={section.label} 
                                    active={activeSection === section.id} 
                                 />
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
                </div>
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
                    className="absolute right-4 top-6 text-white/40 cursor-pointer"
                >
                    <X className="w-6 h-6" />
                </button>

                <nav className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="px-6 mb-6">
                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
                            {isToolPage ? "Navigation" : "Menu"}
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
            </aside>
        </>
    );
}
