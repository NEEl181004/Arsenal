"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Eye, EyeOff, Loader2, Lock, Terminal, Shield } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsAuthenticating(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Access denied.");
                setIsAuthenticating(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError("System authentication failure.");
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row font-sans text-white overflow-hidden">

            {/* ── LEFT PANEL (desktop only) ── */}
            <div className="hidden lg:flex w-[52%] xl:w-[55%] flex-col justify-between p-16 xl:p-20 relative overflow-hidden bg-[#080808] border-r border-white/[0.04]">

                {/* Animated background rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-[700px] h-[700px] border border-white/[0.025] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <div className="w-[500px] h-[500px] border border-white/[0.04] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed animate-[spin_80s_linear_infinite]" />
                    <div className="w-[320px] h-[320px] border border-primary/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                {/* Red glow blob */}
                <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] bg-primary/[0.06] blur-[140px] rounded-full pointer-events-none" />
                <div className="absolute top-[-10%] right-[-5%]  w-[40%] h-[40%] bg-primary/[0.04] blur-[120px] rounded-full pointer-events-none" />

                {/* Top branding */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-20">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-widest text-white">ARSENAL</span>
                    </div>

                    {/* Status badge */}
                    <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-1.5 mb-10">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">System Operational</span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-bold leading-[1.1] tracking-tight text-white">
                        <span className="block text-4xl xl:text-5xl">Red Team</span>
                        <span className="block text-4xl xl:text-5xl text-primary">Tools</span>
                        <span className="block text-3xl xl:text-4xl text-white/80">Database</span>
                    </h1>

                    <p className="mt-8 text-sm text-white/30 font-light leading-relaxed max-w-sm">
                        A centralized tactical intelligence platform for offensive security operations and red team documentation workflows.
                    </p>
                </div>

                {/* Bottom */}
                <div className="relative z-10">
                    <div className="text-[9px] font-medium text-white/10 uppercase tracking-widest">
                        © 2026 ARSENAL SECURITY · ALL RIGHTS RESERVED
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (form) ── */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 xl:p-20 relative min-h-screen lg:min-h-0">

                {/* Mobile-only top glow */}
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none lg:hidden" />

                <div className="w-full max-w-[400px] space-y-10 relative z-10">

                    {/* Mobile branding */}
                    <div className="lg:hidden flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 bg-primary flex items-center justify-center">
                            <Shield className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-[0.25em] text-white">ARSENAL</span>
                    </div>

                    {/* Header */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-primary mb-4">
                            <Lock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Authentication</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
                            Sign In
                        </h2>
                        <p className="text-white/40 text-sm font-medium">
                            Enter your credentials to access the Arsenal platform.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-primary/5 border-l-2 border-primary p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-[12px] text-primary leading-tight font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-5 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                                    placeholder="admin@arsenal.security"
                                    disabled={isAuthenticating}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Password</label>
                                    <button
                                        type="button"
                                        className="text-[9px] font-bold text-primary/70 hover:text-primary transition-colors tracking-widest uppercase"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-5 py-3.5 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all font-mono placeholder:text-white/10"
                                        placeholder="••••••••"
                                        disabled={isAuthenticating}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="w-4 h-4 border border-white/10 bg-white/[0.03] flex items-center justify-center transition-colors group-hover:border-primary/40 shrink-0">
                                    <div className="w-2 h-2 bg-primary scale-0 group-hover:scale-100 transition-transform" />
                                </div>
                                <span className="text-[11px] font-medium text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {/* Submit */}
                        <div className="space-y-5 pt-2">
                            <button
                                type="submit"
                                disabled={isAuthenticating}
                                className="w-full bg-primary text-white font-bold text-xs py-4 tracking-widest hover:bg-primary/90 active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary/10"
                            >
                                {isAuthenticating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : "Login"}
                            </button>

                            <p className="text-center text-[11px] font-medium text-white/30 uppercase tracking-widest">
                                New to ARSENAL?{" "}
                                <Link
                                    href="/signup"
                                    className="text-primary hover:text-primary/80 transition-colors font-bold underline underline-offset-4 decoration-primary/30"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer links */}
                    <div className="pt-6 border-t border-white/[0.04] flex justify-center gap-8">
                        {["Privacy", "Terms", "Security"].map((l) => (
                            <button key={l} className="text-[9px] font-bold text-white/10 hover:text-white/30 uppercase tracking-widest transition-colors">
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/[0.03] blur-[100px] pointer-events-none" />
            </div>
        </div>
    );
}
