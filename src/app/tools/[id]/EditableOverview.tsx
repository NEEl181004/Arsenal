"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SquarePen, Link2, Trash2, X, Save, Loader2 } from "lucide-react";
import DeleteToolButton from "./DeleteToolButton";
import AdminMobileLock from "./AdminMobileLock";

/* ─── Category label for the right panel ─────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
    reconnaissance:         "NETWORK\nRECONNAISSANCE\n& MAPPING",
    "initial access":       "INITIAL\nACCESS\nVECTORS",
    execution:              "PAYLOAD\nEXECUTION\n& DELIVERY",
    "lateral movement":     "LATERAL\nMOVEMENT\nTECHNIQUES",
    "privilege escalation": "PRIVILEGE\nESCALATION\nEXPLOITS",
    "defense evasion":      "DEFENSE\nEVASION\nTACTICS",
    impact:                 "IMPACT\nOPERATIONS\n& DAMAGE",
    exploitation:           "EXPLOIT\nDEVELOPMENT\n& DELIVERY",
    payloads:               "PAYLOAD\nCRAFTING\n& STAGING",
};
function getCategoryLabel(cat: string) {
    return CATEGORY_LABELS[cat?.toLowerCase()] ?? "OFFENSIVE\nSECURITY\nTOOLING";
}

/* ─── Category colour map ─────────────────────────────────── */
const CATEGORY_COLOR: Record<string, string> = {
    reconnaissance:         "#FF003C",
    "initial access":       "#FF6B00",
    execution:              "#FF003C",
    "lateral movement":     "#3B82F6",
    "privilege escalation": "#A855F7",
    "defense evasion":      "#10B981",
    impact:                 "#EF4444",
};
function getCategoryColor(cat: string) {
    return CATEGORY_COLOR[cat?.toLowerCase()] ?? "#FF003C";
}

/* ─── Tier badge colour ───────────────────────────────────── */
function tierStyle(tier: string) {
    const t = tier?.toLowerCase();
    if (t === "beginner")     return { border: "#22C55E", text: "#22C55E", bg: "rgba(34,197,94,0.08)" };
    if (t === "intermediate") return { border: "#F59E0B", text: "#F59E0B", bg: "rgba(245,158,11,0.08)" };
    return                           { border: "#FF003C", text: "#FF003C", bg: "rgba(255,0,60,0.08)" };
}

/* ═══════════════════════════════════════════════════════════ */
export default function EditableOverview({
    tool,
    isAdmin,
    toolId,
}: {
    tool: any;
    isAdmin: boolean;
    toolId: string;
}) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formName, setFormName]         = useState(tool.name || "");
    const [formCategory, setFormCategory] = useState(tool.category || "Exploitation");
    const [formDeveloper, setFormDeveloper] = useState(tool.developer || "");
    const [formTier, setFormTier]         = useState(tool.tier || "Expert");
    const [formBestFor, setFormBestFor]   = useState(tool.bestFor || "Red Teaming");
    const [formOverview, setFormOverview] = useState(tool.overview || "");

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formName, category: formCategory, developer: formDeveloper, tier: formTier, bestFor: formBestFor, overview: formOverview }),
            });
            if (res.ok) { setIsEditModalOpen(false); router.refresh(); }
            else { const err = await res.json(); alert(`Error: ${err.error || "Unknown"}`); }
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally { setSaving(false); }
    };

    const catColor = getCategoryColor(tool.category);
    const catLabel = getCategoryLabel(tool.category);
    const ts       = tierStyle(tool.tier);

    return (
        <div className="w-full">
            {/* ══ HERO HEADER ══════════════════════════════════════════ */}
            <header
                className="relative overflow-hidden border-b border-white/[0.04] pb-0"
                style={{ minHeight: 240 }}
            >
                {/* ─ TOP BAR: full width spanning all 12 cols ─────── */}
                <div className="relative z-10 flex flex-col">
                    <div className="flex items-center justify-between flex-wrap gap-3 py-5">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
                            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-mono), monospace" }}
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Index
                        </Link>

                        {isAdmin && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 cursor-pointer transition-all"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono), monospace" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#fff"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                                >
                                    <SquarePen className="w-3 h-3" />
                                    Edit Overview
                                </button>
                                <Link
                                    href={`/admin/tools/${toolId}/edit`}
                                    className="hidden md:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 transition-all"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono), monospace" }}
                                >
                                    <Link2 className="w-3 h-3" />
                                    Full Editor
                                </Link>
                                <DeleteToolButton id={toolId} />
                                <AdminMobileLock />
                            </div>
                        )}
                    </div>

                    {/* ─ CONTENT GRID below top bar ─────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-8 pb-8 space-y-5">

                        {/* TOOL NAME with subtle background glow */}
                        <div className="relative inline-block">
                            <div
                                className="absolute -inset-2 blur-2xl opacity-15 pointer-events-none"
                                style={{ background: `radial-gradient(ellipse 80% 80% at 30% 50%, ${catColor}, transparent)` }}
                            />
                            <h1
                                className="relative font-black tracking-tight text-white uppercase leading-none"
                                style={{
                                    fontFamily: "var(--font-barlow), 'Barlow Condensed', sans-serif",
                                    letterSpacing: "-0.02em",
                                    fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                    textShadow: `0 0 30px ${catColor}35`,
                                }}
                                dangerouslySetInnerHTML={{ __html: tool.name }}
                            />
                        </div>

                        {/* BADGE ROW */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className="text-[9px] font-black uppercase tracking-[0.25em]"
                                style={{ color: catColor, fontFamily: "var(--font-mono), monospace" }}
                            >
                                // CATEGORY: {tool.category?.toUpperCase()}
                            </span>

                            <span
                                className="text-[9px] font-mono border px-2 py-0.5"
                                style={{ color: "rgba(255,255,255,0.25)", borderColor: "rgba(255,255,255,0.07)" }}
                            >
                                ID: {toolId.slice(-8).toUpperCase()}
                            </span>

                            <span
                                className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1"
                                style={{ color: ts.text, border: `1px solid ${ts.border}55`, background: ts.bg, fontFamily: "var(--font-mono), monospace" }}
                            >
                                TIER: {tool.tier?.toUpperCase()}
                            </span>

                            <span
                                className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 text-white"
                                style={{ background: "#FF003C", boxShadow: "0 0 16px rgba(255,0,60,0.45)", fontFamily: "var(--font-mono), monospace" }}
                            >
                                BEST FOR: {tool.bestFor?.toUpperCase()}
                            </span>
                        </div>

                        {/* OVERVIEW TEXT */}
                        <div
                            className="prose prose-invert max-w-none prose-p:text-white/50 prose-p:text-sm prose-p:leading-relaxed prose-strong:text-white/80 prose-p:font-normal"
                            style={{ fontFamily: "var(--font-sans)" }}
                            dangerouslySetInnerHTML={{ __html: tool.overview || "" }}
                        />
                    </div>

                    {/* ─ RIGHT panel category label ─────────────── */}
                    <div className="lg:col-span-4 hidden lg:flex items-end justify-end pb-10 pr-2">
                        <p
                            className="text-right text-[11px] font-black uppercase leading-snug tracking-widest"
                            style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-mono), monospace", whiteSpace: "pre-line" }}
                        >
                            {catLabel}
                        </p>
                    </div>
                    </div>{/* end content grid */}
                </div>{/* end flex col */}

                {/* ─ RIGHT side particle wave image ─────────────────── */}
                <div
                    className="absolute right-0 bottom-0 w-[50%] pointer-events-none hidden lg:block"
                    style={{
                        top: "52px",
                        maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
                    }}
                >
                    <img
                        src="/images/tool-hero-bg.png"
                        alt=""
                        className="w-full h-full object-cover object-center opacity-85"
                    />
                    {/* left fade */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, black 0%, transparent 40%)" }} />
                    {/* top fade to cut cleanly from the button row */}
                    <div className="absolute top-0 inset-x-0 h-8" style={{ background: "linear-gradient(to bottom, black, transparent)" }} />
                    {/* bottom fade so it blends into the next section */}
                    <div className="absolute bottom-0 inset-x-0 h-16" style={{ background: "linear-gradient(to top, black, transparent)" }} />
                </div>
            </header>

            {/* anchor for sidebar */}
            <section id="overview" className="scroll-mt-24 mb-4" />

            {/* ══ EDIT MODAL ═══════════════════════════════════════════ */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-base font-black text-white uppercase tracking-widest" style={{ fontFamily: "var(--font-mono), monospace" }}>Edit Overview</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: "Tool Name", value: formName, setter: setFormName },
                                    { label: "Developer", value: formDeveloper, setter: setFormDeveloper },
                                ].map(({ label, value, setter }) => (
                                    <div key={label} className="space-y-2">
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono), monospace" }}>{label}</label>
                                        <input type="text" value={value} onChange={e => setter(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all" />
                                    </div>
                                ))}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono), monospace" }}>Category</label>
                                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white focus:border-red-500 outline-none text-sm">
                                        {["Exploitation","Discovery","Payloads","Reconnaissance","Lateral Movement","Privilege Escalation","Defense Evasion","Impact","Initial Access","Execution"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono), monospace" }}>Tier</label>
                                    <select value={formTier} onChange={e => setFormTier(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white focus:border-red-500 outline-none text-sm">
                                        {["Beginner","Intermediate","Expert"].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-mono), monospace" }}>Best For</label>
                                    <select value={formBestFor} onChange={e => setFormBestFor(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white focus:border-red-500 outline-none text-sm">
                                        {["Red Teaming","Penetration Testing","CTF","Research","OSINT"].map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest font-mono" style={{ fontFamily: "var(--font-mono), monospace" }}>Overview (HTML Supported)</label>
                                <textarea value={formOverview} onChange={e => setFormOverview(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-red-500/50 transition-all font-mono"
                                    rows={8} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <button onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2.5 bg-white/5 text-white/60 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="px-8 py-2.5 bg-red-600 text-white hover:bg-red-500 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50">
                                {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5" />Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
