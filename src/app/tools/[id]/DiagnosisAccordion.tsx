"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, AlertCircle, ShieldCheck, Zap, Copy, Pencil, X, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface TroubleshootingItem {
    problem: string;
    cause: string;
    resolution: string;
    command?: string;
}

export default function DiagnosisAccordion({ 
    items, 
    isAdmin = false, 
    toolId 
}: { 
    items: TroubleshootingItem[]; 
    isAdmin?: boolean; 
    toolId?: string; 
}) {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formItems, setFormItems] = useState<TroubleshootingItem[]>([]);

    const handleOpenEdit = () => {
        setFormItems(items ? JSON.parse(JSON.stringify(items)) : []);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!toolId) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    troubleshooting: formItems
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving diagnostics: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end gap-8">
                <h2 className="text-[15px] font-black uppercase tracking-widest flex items-center gap-4 flex-1" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                    <span className="text-white">SYSTEM</span> <span className="text-[#FF003C]">DIAGNOSTICS</span>
                    <span className="h-[1px] flex-1 bg-white/[0.04]"></span>
                </h2>
                
                {isAdmin && (
                    <button 
                        onClick={handleOpenEdit}
                        className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase flex items-center gap-1.5 shrink-0 pb-0.5" style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                    >
                        <Pencil className="w-3.5 h-3.5 text-white/40" strokeWidth={2.5} /> EDIT DIAGNOSTICS
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="p-12 text-center text-white/10 uppercase font-black text-xs tracking-widest border border-dashed border-white/5">
                        NO DIAGNOSTICS DEPLOYED
                    </div>
                ) : (
                    items.map((item, i) => (
                        <div key={i} className={`bg-[#0b0d11] border border-white/[0.08] rounded-xl overflow-hidden shadow-inner transition-all duration-500 ${openIndex === i ? "border-[#FF003C]/30 bg-[#0f1116]" : "hover:border-white/[0.15]"}`}>
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 md:p-8 group text-left"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                    <div className="text-[13px] font-black text-[#FF003C] uppercase tracking-widest group-hover:text-[#FF003C]/80 transition-colors" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                                        {String.fromCharCode(75 + i)}-{400 + i * 12}:
                                    </div>
                                    <h3 className={`text-[14px] md:text-[15px] font-black uppercase tracking-wider transition-all ${openIndex === i ? "text-white" : "text-white/80 group-hover:text-white"}`} style={{ fontFamily: "var(--font-barlow), sans-serif" }} dangerouslySetInnerHTML={{ __html: item.problem }} />
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-500 shrink-0 text-[#FF003C] ${openIndex === i ? "rotate-180" : ""}`} strokeWidth={3} />
                            </button>
                            
                            <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                                <div className="p-6 md:p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <p className="text-sm text-white/40 font-light leading-relaxed max-w-4xl">
                                        Detailed diagnostic analysis identifies an anomaly within the execution environment. Automated mitigation protocol is recommended for node synchronization.
                                    </p>
                                    
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 bg-[#FF003C] rounded-full shadow-[0_0_8px_rgba(255,0,60,0.5)]"></div>
                                                <div className="text-[12px] font-black text-white/50 uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>ROOT CAUSE</div>
                                            </div>
                                            <div className="bg-black/40 border border-white/[0.04] rounded-xl p-6 md:p-8 min-h-[140px] flex items-center text-[13px] text-white/60 font-light leading-[1.8]" dangerouslySetInnerHTML={{ __html: item.cause }} />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-2 bg-[#27C93F] rounded-full shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
                                                <div className="text-[12px] font-black text-white/50 uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>SOLUTION PROTOCOL</div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-black/40 border border-white/[0.04] rounded-xl p-6 md:p-8 flex items-center text-[13px] text-white/80 leading-[1.8]">
                                                    <span dangerouslySetInnerHTML={{ __html: item.resolution }} />
                                                </div>
                                                 {item.command && (
                                                      <div className="relative group/cmd">
                                                        <div className="bg-[#050608] border border-white/[0.06] rounded-xl p-6 flex items-start text-[13px] font-mono leading-[1.8] shadow-inner transition-all hover:bg-black">
                                                            <span className="mr-4 font-black text-[#FF003C] select-none mt-0.5">$</span>
                                                            <span className="break-words whitespace-pre-wrap flex-1 font-bold text-white/70" dangerouslySetInnerHTML={{ __html: item.command }} />
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                const el = document.createElement('div');
                                                                el.innerHTML = item.command || "";
                                                                navigator.clipboard.writeText(el.textContent || el.innerText || "");
                                                                alert("COMMAND COPIED TO CLIPBOARD");
                                                            }}
                                                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white hover:bg-white/[0.08] hover:border-[#FF003C]/40 transition-all opacity-0 group-hover/cmd:opacity-100"
                                                            title="Copy Protocol"
                                                        >
                                                            <Copy className="w-4 h-4" strokeWidth={2} />
                                                        </button>
                                                      </div>
                                                 )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Glassmorphic Edit Diagnostics Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT DIAGNOSTICS</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Diagnostic Entries</span>
                                <button 
                                    onClick={() => setFormItems([...formItems, { problem: "", cause: "", resolution: "", command: "" }])}
                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                >
                                    <Plus className="w-3 h-3" /> Add Entry
                                </button>
                            </div>
                            <div className="space-y-6">
                                {formItems.map((item, idx) => (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 p-6 space-y-4 relative group">
                                        <button 
                                            onClick={() => setFormItems(formItems.filter((_, i) => i !== idx))}
                                            className="absolute top-4 right-4 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Problem (HTML Supported)</label>
                                            <input 
                                                type="text" 
                                                value={item.problem} 
                                                onChange={(e) => {
                                                    const n = [...formItems];
                                                    n[idx].problem = e.target.value;
                                                    setFormItems(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-3 text-white font-black text-xs outline-none" 
                                                placeholder="Problem title..." 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Cause (HTML Supported)</label>
                                            <textarea 
                                                value={item.cause} 
                                                onChange={(e) => {
                                                    const n = [...formItems];
                                                    n[idx].cause = e.target.value;
                                                    setFormItems(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-3 text-white/60 font-light text-xs outline-none" 
                                                rows={2}
                                                placeholder="Root cause..." 
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Resolution (HTML Supported)</label>
                                                <textarea 
                                                    value={item.resolution} 
                                                    onChange={(e) => {
                                                        const n = [...formItems];
                                                        n[idx].resolution = e.target.value;
                                                        setFormItems(n);
                                                    }}
                                                    className="w-full bg-black border border-white/10 p-3 text-white/80 font-light text-xs outline-none" 
                                                    rows={3}
                                                    placeholder="Solution protocol..." 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Command Override (Optional)</label>
                                                <textarea 
                                                    value={item.command || ""} 
                                                    onChange={(e) => {
                                                        const n = [...formItems];
                                                        n[idx].command = e.target.value;
                                                        setFormItems(n);
                                                    }}
                                                    className="w-full bg-black border border-white/10 p-3 text-primary font-mono text-xs outline-none" 
                                                    rows={3}
                                                    placeholder="mitigation command..." 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Save Actions */}
                        <div className="flex justify-end gap-4 border-t border-white/5 pt-4">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2.5 bg-white/5 text-white/60 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
