"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirm: "" });
  const [agreed, setAgreed]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, username: form.username, password: form.password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "#05070B", fontFamily: "var(--font-inter), sans-serif" }}
    >
      {/* ── Background glows ── */}
      <div className="pointer-events-none fixed" style={{ top: "-100px", right: "-60px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(220,0,40,0.18) 0%, rgba(180,0,30,0.08) 40%, transparent 68%)", filter: "blur(60px)" }} />
      <div className="pointer-events-none fixed" style={{ bottom: "-60px", left: "-40px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(160,0,25,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="scanlines pointer-events-none fixed inset-0 opacity-[0.02]" />

      {/* ── Modal card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-[480px] z-10 my-6"
        style={{
          background: "rgba(8,10,16,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 60px rgba(255,0,60,0.04)",
          backdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >
        {/* Top red accent line */}
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent 0%, #FF003C 50%, transparent 100%)", opacity: 0.7 }} />

        <div className="p-8">
          {/* Close */}
          <Link
            href="/"
            className="absolute top-5 right-5 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Link>

          {/* Logo + heading */}
          <div className="flex flex-col items-center text-center mb-7">
            <div
              className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl"
              style={{ background: "rgba(255,0,60,0.1)", border: "1px solid rgba(255,0,60,0.25)" }}
            >
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path d="M15 80 L35 20 L50 20 L30 80 Z" fill="#FF003C" />
                <path d="M42 80 L58 45 L78 20 H93 L68 80 Z" fill="#FF003C" />
                <path d="M38 52 L58 52 L55 60 L35 60 Z" fill="#FF003C" opacity="0.9" />
              </svg>
            </div>
            <h1
              className="text-white mb-1"
              style={{ fontFamily: "var(--font-barlow), sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "0.01em" }}
            >
              Create Your Account
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.5 }}>
              Join the Arsenal community and access<br />elite red teaming documentation.
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 mb-5 px-4 py-3 rounded-lg"
                style={{ background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.2)" }}
              >
                <AlertCircle size={14} className="text-[#FF003C] shrink-0" />
                <span style={{ fontSize: "12px", color: "#FF003C" }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Field label="Full Name" icon={<User size={14} />}>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="Enter your full name"
                required
                disabled={loading}
                className="field-input"
                style={fieldStyle}
                onFocus={e => applyFocus(e)}
                onBlur={e => removeFocus(e)}
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" icon={<Mail size={14} />}>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="Enter your email address"
                required
                disabled={loading}
                style={fieldStyle}
                onFocus={e => applyFocus(e)}
                onBlur={e => removeFocus(e)}
              />
            </Field>

            {/* Username */}
            <Field label="Username" icon={<User size={14} />}>
              <input
                type="text"
                value={form.username}
                onChange={set("username")}
                placeholder="Choose a username"
                required
                disabled={loading}
                style={fieldStyle}
                onFocus={e => applyFocus(e)}
                onBlur={e => removeFocus(e)}
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={<Lock size={14} />} trailingEl={
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ color: "rgba(255,255,255,0.3)" }} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="Create a strong password"
                required
                disabled={loading}
                style={{ ...fieldStyle, paddingRight: 44, fontFamily: showPass ? "var(--font-inter), sans-serif" : "monospace" }}
                onFocus={e => applyFocus(e)}
                onBlur={e => removeFocus(e)}
              />
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" icon={<Lock size={14} />} trailingEl={
              <button type="button" onClick={() => setShowConf(p => !p)} style={{ color: "rgba(255,255,255,0.3)" }} className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }>
              <input
                type={showConf ? "text" : "password"}
                value={form.confirm}
                onChange={set("confirm")}
                placeholder="Confirm your password"
                required
                disabled={loading}
                style={{ ...fieldStyle, paddingRight: 44, fontFamily: showConf ? "var(--font-inter), sans-serif" : "monospace" }}
                onFocus={e => applyFocus(e)}
                onBlur={e => removeFocus(e)}
              />
            </Field>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-0.5">
              <div
                className="relative flex items-center justify-center mt-0.5 rounded cursor-pointer transition-all duration-200 shrink-0"
                style={{ width: 16, height: 16, background: agreed ? "#FF003C" : "rgba(255,255,255,0.05)", border: `1px solid ${agreed ? "#FF003C" : "rgba(255,255,255,0.15)"}` }}
                onClick={() => setAgreed(a => !a)}
              >
                {agreed && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                I agree to the{" "}
                <Link href="/terms" style={{ color: "#FF003C", fontWeight: 500 }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "#FF003C", fontWeight: 500 }}>Privacy Policy</Link>
              </p>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { boxShadow: "0 0 30px rgba(255,0,60,0.4)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: loading ? "rgba(255,0,60,0.5)" : "#FF003C",
                borderRadius: 10,
                padding: "13px",
                color: "white",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.04em",
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                marginTop: 4,
              }}
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Creating Account...</>
              ) : (
                <>Create Account <ArrowRight size={14} strokeWidth={2.5} /></>
              )}
            </motion.button>

            {/* OR divider */}
            <div className="flex items-center gap-3 py-0.5">
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Social icon-only row */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { icon: <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg> },
                { icon: <svg className="w-5 h-5 fill-current" style={{ color: "#5865F2" }} viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> },
              ].map(({ icon }, i) => (
                <motion.button
                  key={i}
                  type="button"
                  whileHover={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)" }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "12px", cursor: "pointer" }}
                >
                  {icon}
                </motion.button>
              ))}
            </div>

            {/* Log in link */}
            <p className="text-center pt-1" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#FF003C", fontWeight: 600 }} className="hover:opacity-80 transition-opacity">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* --- Helpers ------------------------------ */
const fieldStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "11px 14px 11px 40px",
  color: "white",
  fontSize: "13px",
  outline: "none",
  transition: "all 0.2s ease",
};

function applyFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "rgba(255,0,60,0.45)";
  e.target.style.background  = "rgba(255,255,255,0.05)";
}
function removeFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "rgba(255,255,255,0.09)";
  e.target.style.background  = "rgba(255,255,255,0.04)";
}

function Field({ label, icon, children, trailingEl }: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  trailingEl?: React.ReactNode;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.55)", marginBottom: 6, letterSpacing: "0.04em" }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.25)", pointerEvents: "none" }}>
          {icon}
        </span>
        {children}
        {trailingEl}
      </div>
    </div>
  );
}
