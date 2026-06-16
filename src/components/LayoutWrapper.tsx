"use client";

import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
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
    const pathname = usePathname();

    const isAuthPage = pathname === "/login" || pathname === "/signup";

    const onMenuClick = () => {
        if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    if (isAuthPage) {
        return (
            <NextAuthProvider>
                <div className="min-h-screen bg-[#0a0a0a]">
                    {children}
                </div>
            </NextAuthProvider>
        );
    }

    return (
        <NextAuthProvider>
            <Suspense fallback={<div className="fixed top-0 left-0 w-full h-16 bg-[#050505]/60 border-b border-white/[0.05] z-[60]" />}>
                <TopNav onMenuClick={onMenuClick} isCollapsed={isCollapsed} />
            </Suspense>
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
                    <footer className="py-6 border-t border-white/[0.03] text-center">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
                            &copy; {new Date().getFullYear()} ARSENAL. ALL RIGHTS RESERVED.
                        </span>
                    </footer>
                </div>
            </div>
        </NextAuthProvider>
    );
}
