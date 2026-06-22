"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Save, Loader2, Plus, Trash2, Terminal } from "lucide-react";
import * as LucideIcons from "lucide-react";

export default function EditableSpecs({
    systemSupport,
    minimumSpec,
    optimizedSpec,
    isAdmin = false,
    toolId
}: {
    systemSupport: any[];
    minimumSpec: any[];
    optimizedSpec: any[];
    isAdmin?: boolean;
    toolId?: string;
}) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form States
    const [formSystemSupport, setFormSystemSupport] = useState<any[]>([]);
    const [formMinimumSpec, setFormMinimumSpec] = useState<any[]>([]);
    const [formOptimizedSpec, setFormOptimizedSpec] = useState<any[]>([]);

    const handleOpenEdit = () => {
        setFormSystemSupport(JSON.parse(JSON.stringify(systemSupport)));
        setFormMinimumSpec(JSON.parse(JSON.stringify(minimumSpec)));
        setFormOptimizedSpec(JSON.parse(JSON.stringify(optimizedSpec)));
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
                    system_support: formSystemSupport,
                    minimum_spec: formMinimumSpec,
                    optimized_spec: formOptimizedSpec
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving specs: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    const getIconComponent = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName] || Terminal;
        return Icon;
    };

    return (
        <div className="space-y-6 mb-16">
            {isAdmin && (
                <div className="flex justify-end mb-1">
                    <button 
                        onClick={handleOpenEdit}
                        className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer bg-white/[0.03] border border-white/10 px-4 py-2"
                    >
                        <Pencil className="w-3 h-3 text-primary" /> Edit Specs
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* System Support */}
                <div className="bg-[#0e0e0e]/80 border border-white/[0.04] p-6 space-y-6 relative rounded-sm">
                    <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">System Support</div>
                    <div className="space-y-6">
                        {systemSupport.map((o, i) => {
                            const IconComp = getIconComponent(o.icon);
                            return (
                                <div key={i} className="flex items-center gap-4 group">
                                    <IconComp className="w-8 h-8 text-primary transition-transform group-hover:scale-105 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">{o.os}</div>
                                        <div className="text-[10px] text-white/40 mt-0.5 uppercase font-bold tracking-widest">{o.sub}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Minimum Spec */}
                <div className="bg-[#0e0e0e]/80 border border-white/[0.04] p-6 space-y-6 relative rounded-sm">
                    <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">Minimum Spec</div>
                    <div className="space-y-3">
                        {minimumSpec.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all">
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-1.5 h-1.5 bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                </div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider text-right">{s.v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optimized Spec */}
                <div className="bg-[#0e0e0e]/80 border border-primary/10 p-6 relative overflow-hidden rounded-sm">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full blur-3xl"></div>
                    <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">Optimized Spec</div>
                    <div className="space-y-3">
                        {optimizedSpec.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all gap-3">
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_rgba(255,0,60,0.6)]"></div>
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                </div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider text-right">{s.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT ENVIRONMENT SPECS</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            {/* System Support OS list */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">System Support OS</span>
                                    <button 
                                        onClick={() => setFormSystemSupport([...formSystemSupport, { os: "New OS", icon: "Terminal", sub: "Requirements..." }])}
                                        className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" /> Add OS Support
                                    </button>
                                </div>
                                {formSystemSupport.map((sys, idx) => (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 space-y-4 relative group">
                                        <button onClick={() => setFormSystemSupport(formSystemSupport.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-white/10 hover:text-primary cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">OS Name</label>
                                                <input value={sys.os} onChange={e => { const n = [...formSystemSupport]; n[idx].os = e.target.value; setFormSystemSupport(n); }} className="w-full bg-black border border-white/10 p-2.5 text-white outline-none text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lucide Icon (e.g. Terminal, Monitor)</label>
                                                <input value={sys.icon} onChange={e => { const n = [...formSystemSupport]; n[idx].icon = e.target.value; setFormSystemSupport(n); }} className="w-full bg-black border border-white/10 p-2.5 text-white outline-none font-mono text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Requirements Subtitle</label>
                                                <input value={sys.sub} onChange={e => { const n = [...formSystemSupport]; n[idx].sub = e.target.value; setFormSystemSupport(n); }} className="w-full bg-black border border-white/10 p-2.5 text-white outline-none text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Minimum Spec list */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Minimum Specifications</span>
                                    <button 
                                        onClick={() => setFormMinimumSpec([...formMinimumSpec, { k: "CPU", v: "4 CORES" }])}
                                        className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" /> Add Min Spec
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formMinimumSpec.map((spec, idx) => (
                                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 flex gap-4 items-end relative group">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Key (e.g. CPU, RAM)</label>
                                                <input value={spec.k} onChange={e => { const n = [...formMinimumSpec]; n[idx].k = e.target.value; setFormMinimumSpec(n); }} className="w-full bg-black border border-white/10 p-2 text-white outline-none text-xs" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Value</label>
                                                <input value={spec.v} onChange={e => { const n = [...formMinimumSpec]; n[idx].v = e.target.value; setFormMinimumSpec(n); }} className="w-full bg-black border border-white/10 p-2 text-white outline-none text-xs" />
                                            </div>
                                            <button onClick={() => setFormMinimumSpec(formMinimumSpec.filter((_, i) => i !== idx))} className="text-white/10 hover:text-primary mb-1.5 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Optimized Spec list */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Optimized Specifications</span>
                                    <button 
                                        onClick={() => setFormOptimizedSpec([...formOptimizedSpec, { k: "CPU", v: "16 CORES" }])}
                                        className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" /> Add Optimized Spec
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formOptimizedSpec.map((spec, idx) => (
                                        <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 flex gap-4 items-end relative group">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Key (e.g. CPU, RAM)</label>
                                                <input value={spec.k} onChange={e => { const n = [...formOptimizedSpec]; n[idx].k = e.target.value; setFormOptimizedSpec(n); }} className="w-full bg-black border border-white/10 p-2 text-white outline-none text-xs" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Value</label>
                                                <input value={spec.v} onChange={e => { const n = [...formOptimizedSpec]; n[idx].v = e.target.value; setFormOptimizedSpec(n); }} className="w-full bg-black border border-white/10 p-2 text-white outline-none text-xs" />
                                            </div>
                                            <button onClick={() => setFormOptimizedSpec(formOptimizedSpec.filter((_, i) => i !== idx))} className="text-white/10 hover:text-primary mb-1.5 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Save Actions */}
                        <div className="flex justify-end gap-4 border-t border-white/5 pt-4">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2.5 bg-white/5 text-white/60 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-2.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
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
