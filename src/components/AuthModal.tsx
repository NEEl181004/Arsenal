"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

/* ── helpers ──────────────────────────────────────── */
const fS: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 9,
  padding: "10px 14px 10px 40px",
  color: "white",
  fontSize: 13,
  outline: "none",
  transition: "border-color .2s,background .2s",
  fontFamily: "var(--font-inter),sans-serif",
};
const focus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "rgba(255,0,60,0.5)";
  e.target.style.background  = "rgba(255,255,255,0.055)";
};
const blur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "rgba(255,255,255,0.09)";
  e.target.style.background  = "rgba(255,255,255,0.04)";
};

function Field({ label, icon, trailing, children }: { label: string; icon: React.ReactNode; trailing?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 5, letterSpacing: ".04em", fontFamily: "var(--font-inter),sans-serif" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)", pointerEvents: "none", display: "flex" }}>{icon}</span>
        {children}
        {trailing}
      </div>
    </div>
  );
}

/* ── LOGO ─────────────────────────────────────────── */
const Logo = () => (
  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,0,60,0.1)", border: "1px solid rgba(255,0,60,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
      <path d="M15 80 L35 20 L50 20 L30 80 Z" fill="#FF003C" />
      <path d="M42 80 L58 45 L78 20 H93 L68 80 Z" fill="#FF003C" />
      <path d="M38 52 L58 52 L55 60 L35 60 Z" fill="#FF003C" opacity=".9" />
    </svg>
  </div>
);

/* ── SOCIAL BUTTONS ───────────────────────────────── */
const socials = [
  { label: "Google", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
  { label: "GitHub",  icon: <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg> },
  { label: "Discord", icon: <svg className="w-4 h-4 fill-current" style={{ color: "#5865F2" }} viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg> },
];

/* ══════════════════════════════════════════
   LOGIN PANEL
══════════════════════════════════════════ */
function LoginPanel({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) { setError("Invalid credentials. Access denied."); setLoading(false); return; }
      onClose(); router.push("/dashboard"); router.refresh();
    } catch { setError("Authentication failure."); setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Logo />
      <h2 style={{ fontFamily: "var(--font-barlow),sans-serif", fontWeight: 800, fontSize: "1.55rem", color: "white", letterSpacing: ".01em", marginBottom: 4 }}>Welcome Back</h2>
      <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.55, marginBottom: 22 }}>
        Log in to your Arsenal account<br />to continue your mission.
      </p>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.22)", borderRadius: 9, padding: "10px 14px", marginBottom: 14, width: "100%" }}>
            <AlertCircle size={13} color="#FF003C" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#FF003C", fontFamily: "var(--font-inter),sans-serif" }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 13 }}>
        <Field label="Email Address" icon={<Mail size={14} />}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" required disabled={loading} style={fS} onFocus={focus} onBlur={blur} />
        </Field>

        <Field label="Password" icon={<Lock size={14} />} trailing={
          <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.28)", display: "flex" }}>
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        }>
          <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required disabled={loading} style={{ ...fS, paddingRight: 42, fontFamily: showPass ? "var(--font-inter),sans-serif" : "monospace" }} onFocus={focus} onBlur={blur} />
        </Field>

        {/* Remember + Forgot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div onClick={() => setRemember(r => !r)} style={{ width: 15, height: 15, borderRadius: 4, background: remember ? "#FF003C" : "rgba(255,255,255,0.05)", border: `1px solid ${remember ? "#FF003C" : "rgba(255,255,255,0.14)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .2s", flexShrink: 0 }}>
              {remember && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-inter),sans-serif" }}>Remember me</span>
          </label>
          <button type="button" style={{ fontSize: 12, color: "#FF003C", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter),sans-serif" }}>Forgot password?</button>
        </div>

        {/* Submit */}
        <motion.button type="submit" disabled={loading} whileHover={!loading ? { boxShadow: "0 0 30px rgba(255,0,60,0.38)" } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "rgba(255,0,60,0.5)" : "#FF003C", border: "none", borderRadius: 9, padding: "12px", color: "white", fontWeight: 700, fontSize: 13, letterSpacing: ".04em", cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-inter),sans-serif", transition: "all .2s", marginTop: 2 }}>
          {loading ? <><Loader2 size={14} className="animate-spin" /> Authenticating...</> : <>Log In <ArrowRight size={13} strokeWidth={2.5} /></>}
        </motion.button>

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: ".12em", fontFamily: "var(--font-inter),sans-serif" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Socials */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {socials.map(s => (
            <motion.button key={s.label} type="button" whileHover={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.18)" }} whileTap={{ scale: 0.96 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, padding: "9px 8px", cursor: "pointer", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-inter),sans-serif", transition: "all .2s" }}>
              {s.icon} {s.label}
            </motion.button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", fontFamily: "var(--font-inter),sans-serif", marginTop: 2 }}>
          Don't have an account?{" "}
          <button type="button" onClick={onSwitch} style={{ color: "#FF003C", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-inter),sans-serif", fontSize: 13 }}>Sign up</button>
        </p>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════
   SIGNUP PANEL
══════════════════════════════════════════ */
function SignupPanel({ onSwitch, onClose }: { onSwitch: () => void; onClose: () => void }) {
  const [form, setForm]   = useState({ name:"", email:"", username:"", password:"", confirm:"" });
  const [agreed, setAgreed] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("You must agree to the Terms of Service."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, username: form.username, password: form.password }) });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Registration failed."); setLoading(false); return; }
      onSwitch(); // go back to login after signup
    } catch { setError("Network error. Please try again."); setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Logo />
      <h2 style={{ fontFamily: "var(--font-barlow),sans-serif", fontWeight: 800, fontSize: "1.55rem", color: "white", letterSpacing: ".01em", marginBottom: 4 }}>Create Your Account</h2>
      <p style={{ fontFamily: "var(--font-inter),sans-serif", fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.55, marginBottom: 22 }}>
        Join the Arsenal community and access<br />elite red teaming documentation.
      </p>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,0,60,0.08)", border: "1px solid rgba(255,0,60,0.22)", borderRadius: 9, padding: "10px 14px", marginBottom: 14, width: "100%" }}>
            <AlertCircle size={13} color="#FF003C" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#FF003C", fontFamily: "var(--font-inter),sans-serif" }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 11 }}>
        <Field label="Full Name" icon={<User size={14} />}>
          <input type="text" value={form.name} onChange={set("name")} placeholder="Enter your full name" required disabled={loading} style={fS} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Email Address" icon={<Mail size={14} />}>
          <input type="email" value={form.email} onChange={set("email")} placeholder="Enter your email address" required disabled={loading} style={fS} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Username" icon={<User size={14} />}>
          <input type="text" value={form.username} onChange={set("username")} placeholder="Choose a username" required disabled={loading} style={fS} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Password" icon={<Lock size={14} />} trailing={
          <button type="button" onClick={() => setShowP(p=>!p)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.28)", display:"flex" }}>
            {showP ? <EyeOff size={14}/> : <Eye size={14}/>}
          </button>
        }>
          <input type={showP?"text":"password"} value={form.password} onChange={set("password")} placeholder="Create a strong password" required disabled={loading} style={{ ...fS, paddingRight:42, fontFamily: showP?"var(--font-inter),sans-serif":"monospace" }} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Confirm Password" icon={<Lock size={14} />} trailing={
          <button type="button" onClick={() => setShowC(p=>!p)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.28)", display:"flex" }}>
            {showC ? <EyeOff size={14}/> : <Eye size={14}/>}
          </button>
        }>
          <input type={showC?"text":"password"} value={form.confirm} onChange={set("confirm")} placeholder="Confirm your password" required disabled={loading} style={{ ...fS, paddingRight:42, fontFamily: showC?"var(--font-inter),sans-serif":"monospace" }} onFocus={focus} onBlur={blur} />
        </Field>

        {/* Terms */}
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, textAlign:"left" }}>
          <div onClick={() => setAgreed(a=>!a)} style={{ width:15, height:15, borderRadius:4, background: agreed?"#FF003C":"rgba(255,255,255,0.05)", border:`1px solid ${agreed?"#FF003C":"rgba(255,255,255,0.14)"}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:1, transition:"all .2s" }}>
            {agreed && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.38)", fontFamily:"var(--font-inter),sans-serif", lineHeight:1.5 }}>
            I agree to the{" "}
            <Link href="/terms" style={{ color:"#FF003C" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" style={{ color:"#FF003C" }}>Privacy Policy</Link>
          </p>
        </div>

        <motion.button type="submit" disabled={loading} whileHover={!loading?{boxShadow:"0 0 30px rgba(255,0,60,0.38)"}:{}} whileTap={!loading?{scale:0.98}:{}}
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, background: loading?"rgba(255,0,60,0.5)":"#FF003C", border:"none", borderRadius:9, padding:"12px", color:"white", fontWeight:700, fontSize:13, letterSpacing:".04em", cursor: loading?"not-allowed":"pointer", fontFamily:"var(--font-inter),sans-serif", transition:"all .2s", marginTop:2 }}>
          {loading ? <><Loader2 size={14} className="animate-spin"/>Creating...</> : <>Create Account <ArrowRight size={13} strokeWidth={2.5}/></>}
        </motion.button>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
          <span style={{ fontSize:10, color:"rgba(255,255,255,0.22)", letterSpacing:".12em", fontFamily:"var(--font-inter),sans-serif" }}>OR</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {socials.map(s => (
            <motion.button key={s.label} type="button" whileHover={{ background:"rgba(255,255,255,0.07)", borderColor:"rgba(255,255,255,0.18)" }} whileTap={{ scale:0.96 }}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:9, padding:"11px", cursor:"pointer", transition:"all .2s" }}>
              {s.icon}
            </motion.button>
          ))}
        </div>

        <p style={{ fontSize:13, color:"rgba(255,255,255,0.32)", fontFamily:"var(--font-inter),sans-serif" }}>
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} style={{ color:"#FF003C", fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-inter),sans-serif", fontSize:13 }}>Log in</button>
        </p>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN MODAL WRAPPER
══════════════════════════════════════════ */
interface AuthModalProps {
  open: boolean;
  defaultTab?: "login" | "signup";
  onClose: () => void;
}

export default function AuthModal({ open, defaultTab = "login", onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  // Reset tab when modal opens
  const handleOpen = () => { setTab(defaultTab); };

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 999,
              background: "rgba(3,4,8,0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          />

          {/* ── Modal card ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px", pointerEvents: "none",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: "auto",
                width: "100%",
                maxWidth: tab === "signup" ? 460 : 420,
                maxHeight: "92dvh",
                overflowY: "auto",
                background: "rgba(7,9,15,0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 60px rgba(255,0,60,0.05)",
                backdropFilter: "blur(30px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Red top accent */}
              <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #FF003C 50%, transparent)", opacity: .75, flexShrink: 0 }} />

              {/* Close button */}
              <button
                onClick={onClose}
                style={{ position:"absolute", top:14, right:14, width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,0.4)", transition:"all .2s", zIndex:10 }}
                className="hover:bg-white/10 hover:text-white"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>

              {/* Content */}
              <div style={{ padding: "28px 32px 32px" }}>
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
                      <LoginPanel onSwitch={() => setTab("signup")} onClose={onClose} />
                    </motion.div>
                  ) : (
                    <motion.div key="signup" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                      <SignupPanel onSwitch={() => setTab("login")} onClose={onClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
