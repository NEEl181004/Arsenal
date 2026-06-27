"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Categories from "@/components/Categories";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import BackgroundEffects from "@/components/landing/BackgroundEffects";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab,  setAuthTab]  = useState<"login" | "signup">("login");

  const openLogin  = () => { setAuthTab("login");  setAuthOpen(true); };
  const openSignup = () => { setAuthTab("signup"); setAuthOpen(true); };
  const closeAuth  = () => { setAuthOpen(false); history.replaceState(null,"","/"); };

  // Auto-open if navigated to /#login or /#signup
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#login")  openLogin();
    if (hash === "#signup") openSignup();
  }, []);

  return (
    <main className="min-h-screen bg-[#05070B] text-white overflow-x-hidden">
      <Navbar onLoginOpen={openLogin} onSignupOpen={openSignup} />
      <BackgroundEffects />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Hero onLoginOpen={openLogin} />
        <Features />
        <Categories onLoginOpen={openLogin} />
        <CTA />
      </div>

      <Footer />

      <AuthModal open={authOpen} defaultTab={authTab} onClose={closeAuth} />
    </main>
  );
}
