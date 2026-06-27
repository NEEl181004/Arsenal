"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, SquarePen, X, Save, Loader2, Plus, Trash2, ArrowRight, BarChart2 } from "lucide-react";

/* ─── Value color logic ─────────────────────────────────────── */
function valueColor(val: string): string {
    const v = val?.toUpperCase() || "";
    if (/^(UP|ACTIVE|ONLINE|PASS|OK|SUCCESS|ENABLED)/.test(v)) return "#22C55E";
    return "#FF003C";
}

/* ─── Faint world-map bg ────────────────────────────── */
function WorldMapBg() {
    return (
        <div 
            className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen"
            style={{
                backgroundImage: "url('/world-map-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Fade overlay so the right side stays dark for text readability */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 0%, transparent 40%, #0a0b0e 85%)" }} />
            {/* Top/Bottom fade */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0a0b0e 0%, transparent 20%, transparent 80%, #0a0b0e 100%)" }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════ */
export default function CoreModuleViewer({
    modules,
    isAdmin = false,
    toolId,
}: {
    modules: any[];
    isAdmin?: boolean;
    toolId?: string;
}) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formModules, setFormModules] = useState<any[]>([]);

    const active = modules[activeIndex] || modules[0];

    const handleOpenEdit = () => {
        setFormModules(modules ? JSON.parse(JSON.stringify(modules)) : []);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!toolId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ core_modules: formModules }),
            });
            if (res.ok) { setIsEditModalOpen(false); router.refresh(); }
            else { const err = await res.json(); alert(`Error: ${err.error || "Unknown"}`); }
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally { setSaving(false); }
    };

    /* ── Empty state ─────────────────────────── */
    if (!modules || modules.length === 0) {
        return (
            <div className="p-16 border border-dashed border-white/5 text-center flex flex-col items-center gap-4"
                style={{ color: "rgba(255,255,255,0.1)", fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.5em" }}>
                <span>AWAITING CORE MODULES...</span>
                {isAdmin && (
                    <button onClick={handleOpenEdit}
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all"
                        style={{ background: "rgba(255,0,60,0.15)", border: "1px solid rgba(255,0,60,0.3)" }}>
                        Create First Module
                    </button>
                )}
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────── */
    return (
        <div className="relative">

            {/* ══ TABS ROW ══════════════════════════════════════════════ */}
            <div className="flex items-center justify-between mb-4">
                {/* Left: tab buttons */}
                <div className="flex items-center gap-3">
                    {/* Mobile dropdown */}
                    <div className="md:hidden relative w-full">
                        <select value={activeIndex} onChange={e => setActiveIndex(Number(e.target.value))}
                            className="bg-transparent border border-white/10 rounded-lg text-white uppercase appearance-none focus:outline-none pr-7 pl-4 py-3"
                            style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", fontWeight: 900, letterSpacing: "0.18em" }}
                        >
                            {modules.map((m, i) => (
                                <option key={i} value={i} className="bg-[#0a0a0a]">{m.name.toUpperCase()}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                    </div>

                    {/* Desktop tabs */}
                    <div className="hidden md:flex items-center gap-3">
                        {modules.map((m, i) => {
                            const isActive = i === activeIndex;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className="relative flex items-center cursor-pointer rounded-lg border transition-all duration-200"
                                    style={{
                                        fontFamily: "var(--font-mono), monospace",
                                        fontSize: "10px",
                                        fontWeight: 900,
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase",
                                        padding: "10px 24px",
                                        color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
                                        backgroundColor: isActive ? "rgba(255,0,60,0.06)" : "transparent",
                                        borderColor: isActive ? "rgba(255,0,60,0.4)" : "rgba(255,255,255,0.1)",
                                        boxShadow: isActive ? "0 0 12px rgba(255,0,60,0.15) inset, 0 0 12px rgba(255,0,60,0.15)" : "none",
                                    }}
                                    onMouseEnter={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "#ffffff";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                                        }
                                    }}
                                >
                                    {m.name.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: EDIT MODULES button */}
                {isAdmin && (
                    <button
                        onClick={handleOpenEdit}
                        className="hidden md:flex items-center gap-2 cursor-pointer rounded-lg border transition-all duration-200"
                        style={{
                            fontFamily: "var(--font-mono), monospace",
                            fontSize: "9px",
                            fontWeight: 900,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.4)",
                            padding: "9px 18px",
                            backgroundColor: "rgba(255,255,255,0.02)",
                            borderColor: "rgba(255,255,255,0.1)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = "#ffffff";
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        }}
                    >
                        <SquarePen style={{ width: "11px", height: "11px", color: "#FF003C" }} />
                        Edit Modules
                    </button>
                )}
            </div>

            {/* ══ MODULE CARD ═══════════════════════════════════════════ */}
            {active && (
                <div
                    className="relative overflow-hidden grid grid-cols-1 lg:grid-cols-5 rounded-xl"
                    style={{
                        background: "linear-gradient(135deg, #0b0d11 0%, #080a0d 50%, #0a0b0e 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        minHeight: "260px",
                    }}
                >
                    {/* World-map bg */}
                    <div className="absolute inset-0 pointer-events-none"><WorldMapBg /></div>
                    {/* Left vignette */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(90deg, rgba(9,11,15,0.75) 0%, transparent 65%)" }} />

                    {/* LEFT: title + description */}
                    <div className="relative z-10 lg:col-span-3 px-10 py-10 space-y-4">
                        <h3
                            className="text-xl md:text-2xl font-black uppercase leading-tight"
                            style={{
                                color: "#FF003C",
                                fontFamily: "var(--font-barlow), sans-serif",
                                letterSpacing: "0.02em",
                                textShadow: "0 0 20px rgba(255,0,60,0.25)",
                            }}
                            dangerouslySetInnerHTML={{ __html: active.title?.toUpperCase() || "" }}
                        />
                        <p
                            style={{
                                color: "rgba(255,255,255,0.45)",
                                fontFamily: "var(--font-sans)",
                                fontSize: "0.86rem",
                                lineHeight: "1.65",
                                maxWidth: "460px",
                            }}
                            dangerouslySetInnerHTML={{ __html: active.description || "" }}
                        />
                    </div>

                    {/* RIGHT: telemetry */}
                    <div
                        className="relative z-10 lg:col-span-2 flex flex-col justify-center border-t lg:border-t-0 lg:border-l"
                        style={{ borderColor: "rgba(255,255,255,0.06)" }}
                    >
                        {active.telemetry?.map((row: any, i: number) => {
                            const vColor = valueColor(row.value);
                            const isLast = i === (active.telemetry.length - 1);
                            const showIcon = /^(UP|ACTIVE|ONLINE)/.test(row.value?.toUpperCase() || "");
                            return (
                                <div key={i}
                                    className="flex items-center justify-between px-8 py-[18px]"
                                    style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    {/* Label */}
                                    <div className="flex items-center gap-3">
                                        <ArrowRight style={{ width: "13px", height: "13px", color: "#FF003C", flexShrink: 0 }} />
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono), monospace",
                                                fontSize: "10px",
                                                fontWeight: 900,
                                                letterSpacing: "0.15em",
                                                textTransform: "uppercase",
                                                color: "rgba(255,255,255,0.55)",
                                            }}
                                            dangerouslySetInnerHTML={{ __html: row.key?.toUpperCase() || "" }}
                                        />
                                    </div>
                                    {/* Value */}
                                    <div className="flex items-center gap-1.5">
                                        {showIcon && <BarChart2 style={{ width: "12px", height: "12px", color: vColor }} />}
                                        <span
                                            style={{
                                                fontFamily: "var(--font-mono), monospace",
                                                fontSize: "10px",
                                                fontWeight: 900,
                                                letterSpacing: "0.12em",
                                                textTransform: "uppercase",
                                                color: vColor,
                                            }}
                                            dangerouslySetInnerHTML={{ __html: row.value?.toUpperCase() || "" }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {(!active.telemetry || active.telemetry.length === 0) && (
                            <div className="flex items-center justify-center py-12"
                                style={{ color: "rgba(255,255,255,0.1)", fontFamily: "var(--font-mono), monospace", fontSize: "10px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.4em" }}>
                                NO TELEMETRY DATA
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══ EDIT MODAL ════════════════════════════════════════════ */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 style={{ fontFamily: "var(--font-mono), monospace", fontSize: "13px", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                Edit Core Modules
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: "10px", fontWeight: 900, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                    Modules List
                                </span>
                                <button onClick={() => setFormModules([...formModules, { name: "New Module", icon: "Layers", title: "", description: "", telemetry: [] }])}
                                    className="flex items-center gap-1 transition-colors"
                                    style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.15em" }}
                                    onMouseEnter={e => { e.currentTarget.style.color = "#FF003C"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                                >
                                    <Plus className="w-3 h-3" /> Add Module
                                </button>
                            </div>

                            <div className="space-y-6">
                                {formModules.map((m, mi) => (
                                    <div key={mi} className="bg-white/[0.02] border border-white/5 p-5 space-y-4 relative group">
                                        <button onClick={() => setFormModules(formModules.filter((_, i) => i !== mi))}
                                            className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Module Label</label>
                                                <input value={m.name} onChange={e => { const n = [...formModules]; n[mi].name = e.target.value; setFormModules(n); }}
                                                    className="w-full bg-black border border-white/10 p-3 font-black uppercase outline-none text-sm focus:border-red-500/40"
                                                    style={{ color: "#FF003C" }} placeholder="MODULE_LABEL" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Icon</label>
                                                <input value={m.icon} onChange={e => { const n = [...formModules]; n[mi].icon = e.target.value; setFormModules(n); }}
                                                    className="w-full bg-black border border-white/10 p-3 text-white/40 font-mono outline-none text-xs focus:border-red-500/40"
                                                    placeholder="LucideName or <svg>..." />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Module Title</label>
                                            <input value={m.title} onChange={e => { const n = [...formModules]; n[mi].title = e.target.value; setFormModules(n); }}
                                                className="w-full bg-black border border-white/10 p-3 text-white outline-none text-sm focus:border-red-500/40"
                                                placeholder="Module Title" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.2em" }}>Description</label>
                                            <textarea value={m.description} onChange={e => { const n = [...formModules]; n[mi].description = e.target.value; setFormModules(n); }}
                                                className="w-full bg-black border border-white/10 p-3 text-white/70 outline-none text-sm focus:border-red-500/40"
                                                rows={3} placeholder="Module description..." />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "#FF003C", textTransform: "uppercase", letterSpacing: "0.2em" }}>Telemetry Feed</label>
                                                <button onClick={() => { const n = [...formModules]; if (!n[mi].telemetry) n[mi].telemetry = []; n[mi].telemetry.push({ key: "", value: "", description: "" }); setFormModules(n); }}
                                                    className="flex items-center gap-1 transition-colors"
                                                    style={{ fontFamily: "var(--font-mono), monospace", fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em" }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = "#FF003C"; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
                                                >
                                                    <Plus className="w-3 h-3" /> Add Row
                                                </button>
                                            </div>
                                            {m.telemetry?.map((row: any, ri: number) => (
                                                <div key={ri} className="bg-black/50 border border-white/5 p-3 space-y-2 relative group/tel">
                                                    <button onClick={() => { const n = [...formModules]; n[mi].telemetry = n[mi].telemetry.filter((_: any, i: any) => i !== ri); setFormModules(n); }}
                                                        className="absolute top-2 right-2 text-white/10 hover:text-red-500 opacity-0 group-hover/tel:opacity-100 transition-all">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={row.key} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].key = e.target.value; setFormModules(n); }}
                                                            className="w-full bg-black p-2 text-xs border border-white/5 uppercase text-white/60 outline-none" placeholder="KEY" />
                                                        <input value={row.value} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].value = e.target.value; setFormModules(n); }}
                                                            className="w-full bg-black p-2 text-xs border border-white/5 outline-none" style={{ color: "#FF003C" }} placeholder="VALUE" />
                                                    </div>
                                                    <input value={row.description || ""} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].description = e.target.value; setFormModules(n); }}
                                                        className="w-full bg-black/20 p-2 text-[10px] border border-white/5 italic text-white/30 outline-none"
                                                        placeholder="Description (optional)..." />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <button onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2.5 transition-all"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="px-8 py-2.5 flex items-center gap-2 transition-all disabled:opacity-50"
                                style={{ background: "#FF003C", color: "#fff", fontFamily: "var(--font-mono), monospace", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                {saving
                                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving...</>
                                    : <><Save className="w-3.5 h-3.5" />Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
