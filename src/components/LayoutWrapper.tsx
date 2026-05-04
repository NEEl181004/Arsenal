"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";
import { NextAuthProvider } from "@/components/Providers";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const onMenuClick = () => {
        if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    return (
        <NextAuthProvider>
            <TopNav onMenuClick={onMenuClick} isCollapsed={isCollapsed} />
            {/* Flex row: sidebar + content side-by-side on lg (push, not overlay) */}
            <div className="flex pt-14 min-h-screen">
                <SideNav
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                    <main className="flex-1 py-12 px-6 md:px-8 lg:px-16 w-full max-w-none">
                        {children}
                    </main>
                    <footer className="bg-white/[0.01] py-8 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center border-t border-white/[0.03]">
                        <div className="text-[10px] font-black text-white/20 tracking-widest mb-4 md:mb-0 uppercase">
                            SYSTEM_STATUS: <span className="text-primary">OPERATIONAL</span> | UPTIME: 365D 04H 12M
                        </div>
                        <div className="flex gap-8 text-[10px] font-black text-white/20 tracking-widest uppercase">
                            <a className="hover:text-primary transition-colors" href="#">Documentation</a>
                            <a className="hover:text-primary transition-colors" href="#">Security</a>
                            <a className="hover:text-primary transition-colors" href="#">© 2026_ARSENAL</a>
                        </div>
                    </footer>
                </div>
            </div>
        </NextAuthProvider>
    );
}
