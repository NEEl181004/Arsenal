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
        <div className="relative">
            {/* Header Overlay Edit Button (rendered absolute if admin is true, since the image header container is the parent in page.tsx) */}
            {isAdmin && (
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleOpenEdit}
                        className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer bg-white/[0.03] border border-white/10 px-4 py-2"
                    >
                        <Pencil className="w-3 h-3 text-primary" /> Edit Diagnostics
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="p-12 text-center text-white/10 uppercase font-black text-xs tracking-widest border border-dashed border-white/5">
                        NO DIAGNOSTICS DEPLOYED
                    </div>
                ) : (
                    items.map((item, i) => (
                        <div key={i} className={`bg-white/[0.01] border border-white/5 overflow-hidden transition-all duration-500 ${openIndex === i ? "bg-white/[0.02] border-primary/20" : "hover:bg-white/[0.02]"}`}>
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 md:p-8 group text-left"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                    <div className="text-xs font-bold text-white/20 uppercase tracking-widest group-hover:text-primary transition-colors">
                                        {String.fromCharCode(75 + i)}-{400 + i * 12}:
                                    </div>
                                    <h3 className={`text-base md:text-lg font-bold text-white uppercase tracking-widest transition-all ${openIndex === i ? "text-primary" : "group-hover:text-white"}`} dangerouslySetInnerHTML={{ __html: item.problem }} />
                                </div>
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${openIndex === i ? "rotate-180 text-primary" : "text-white/10"}`} />
                            </button>
                            
                            <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                                <div className="p-6 md:p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <p className="text-sm text-white/40 font-light leading-relaxed max-w-4xl">
                                        Detailed diagnostic analysis identifies an anomaly within the execution environment. Automated mitigation protocol is recommended for node synchronization.
                                    </p>
                                    
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="text-xs font-bold text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary"></div>
                                                ROOT CAUSE
                                            </div>
                                            <div className="bg-[#0e0e0e] border border-white/5 p-6 md:p-10 min-h-[140px] flex items-center text-sm text-white/60 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: item.cause }} />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="text-xs font-bold text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary"></div>
                                                SOLUTION PROTOCOL
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-[#0e0e0e] border border-white/5 p-6 md:p-10 flex items-center text-sm text-white/80 leading-relaxed">
                                                    <span dangerouslySetInnerHTML={{ __html: item.resolution }} />
                                                </div>
                                                 {item.command && (
                                                      <div className="relative group/cmd">
                                                        <div className="bg-black/80 border border-primary/20 p-6 flex items-start text-xs md:text-sm text-primary font-mono leading-relaxed transition-all hover:bg-black">
                                                            <span className="mr-4 font-black opacity-40 select-none">$</span>
                                                            <span className="break-words whitespace-pre-wrap flex-1" dangerouslySetInnerHTML={{ __html: item.command }} />
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                const el = document.createElement('div');
                                                                el.innerHTML = item.command || "";
                                                                navigator.clipboard.writeText(el.textContent || el.innerText || "");
                                                                alert("COMMAND COPIED TO CLIPBOARD");
                                                            }}
                                                            className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all opacity-0 group-hover/cmd:opacity-100"
                                                            title="Copy Protocol"
                                                        >
                                                            <Copy className="w-4 h-4" />
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
