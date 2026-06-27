"use client";

import { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import SideNav from "@/components/SideNav";
import { NextAuthProvider } from "@/components/Providers";

// Landing / auth pages — no layout chrome
const BARE_PAGES = ["/", "/login", "/signup", "/about"];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed]   = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isBare = BARE_PAGES.includes(pathname);

  const onMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) setIsMobileOpen(!isMobileOpen);
    else setIsCollapsed(!isCollapsed);
  };

  if (isBare) {
    // Landing page renders its own Navbar inside page.tsx
    return (
      <NextAuthProvider>
        <div className="min-h-screen bg-[#05070B] w-full">{children}</div>
      </NextAuthProvider>
    );
  }

  // Dashboard / inner pages — use TopNav (sidebar layout)
  // We lazy-import TopNav here so it doesn't affect landing bundle
  return (
    <NextAuthProvider>
      <Suspense fallback={<div className="fixed top-0 left-0 w-full h-16 bg-[#050505]/60 border-b border-white/[0.05] z-[60]" />}>
        <InnerLayout
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          setIsCollapsed={setIsCollapsed}
          setIsMobileOpen={setIsMobileOpen}
          onMenuClick={onMenuClick}
        >
          {children}
        </InnerLayout>
      </Suspense>
    </NextAuthProvider>
  );
}

/* Inner layout with Navbar + SideNav — only for dashboard pages */
function InnerLayout({ children, isCollapsed, isMobileOpen, setIsCollapsed, setIsMobileOpen, onMenuClick }: any) {
  // Dynamic import avoids circular deps
  const Navbar = require("@/components/Navbar").default;
  return (
    <div className="min-h-screen bg-black">
      <Navbar onMenuClick={onMenuClick} />
      <div className="flex" style={{ minHeight: "calc(100vh - 60px)" }}>
        <SideNav
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <main className="flex-1 py-12 px-6 md:px-8 lg:px-16 w-full max-w-none">{children}</main>
          <footer className="py-6 border-t border-white/[0.03] text-center">
            <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-medium">
              © {new Date().getFullYear()} ARSENAL. ALL RIGHTS RESERVED.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
