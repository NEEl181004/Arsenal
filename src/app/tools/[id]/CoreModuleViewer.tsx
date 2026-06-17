"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { ChevronDown, Pencil, X, Save, Loader2, Plus, Trash2 } from "lucide-react";

export default function CoreModuleViewer({ 
    modules, 
    isAdmin = false, 
    toolId 
}: { 
    modules: any[]; 
    isAdmin?: boolean; 
    toolId?: string; 
}) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
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
                body: JSON.stringify({
                    core_modules: formModules
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving modules: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    if (!modules || modules.length === 0) {
        return (
            <div className="p-20 border border-dashed border-white/5 text-center text-white/10 font-black text-[11px] tracking-[0.5em] uppercase flex flex-col items-center gap-4">
                <span>AWAITING CORE MODULES...</span>
                {isAdmin && (
                    <button onClick={handleOpenEdit} className="bg-primary/20 hover:bg-primary px-6 py-3 border border-primary/40 text-xs font-bold text-white uppercase tracking-widest transition-all">
                        Create First Module
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-1 relative">
            {/* Header Overlay Edit Button */}
            {isAdmin && (
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={handleOpenEdit}
                        className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer bg-white/[0.03] border border-white/10 px-4 py-2"
                    >
                        <Pencil className="w-3 h-3 text-primary" /> Edit Modules
                    </button>
                </div>
            )}

            {/* Mobile Dropdown View (Phone only) */}
            <div className="md:hidden mb-4">
                <div className="relative group">
                    <select 
                        value={activeIndex}
                        onChange={(e) => setActiveIndex(Number(e.target.value))}
                        className="w-full bg-white/[0.03] border border-white/10 p-5 pr-12 appearance-none text-[12px] font-black text-white uppercase tracking-[0.3em] focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        {modules.map((m, i) => (
                            <option key={i} value={i} className="bg-[#0a0a0a] text-white">
                                {m.name.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Tablet & Desktop Tabs View (768px+) */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-1">
                {modules.map((m, i) => {
                    const isSvg = m.icon?.trim().startsWith("<svg");
                    const Icon = (LucideIcons as any)[m.icon] || LucideIcons.Layers;
                    const isActive = i === activeIndex;
                    return (
                        <div 
                            key={i} 
                            onClick={() => setActiveIndex(i)}
                            className={`flex flex-col items-center gap-4 p-6 border border-white/5 group cursor-pointer transition-all ${isActive ? "bg-white/[0.03] border-primary/20 shadow-[0_0_30px_rgba(255,0,60,0.05)]" : "hover:bg-white/[0.01]"}`}
                        >
                            {isSvg ? (
                                <div 
                                    className={`w-6 h-6 ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"} transition-colors`}
                                    dangerouslySetInnerHTML={{ __html: m.icon }}
                                />
                            ) : (
                                <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"} transition-colors`} />
                            )}
                            <span className={`text-xs font-black tracking-[0.1em] lg:tracking-[0.2em] text-center ${isActive ? "text-primary" : "text-white/60 group-hover:text-white"} break-words w-full`}>{m.name.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>

            {active && (
                <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-10 md:p-12 xl:p-14 grid grid-cols-1 xl:grid-cols-5 gap-12 xl:gap-16 relative overflow-hidden animate-in fade-in duration-700">
                    <div className="xl:col-span-3 space-y-6 sm:space-y-8">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-tight break-words" dangerouslySetInnerHTML={{ __html: active.title.toUpperCase() }} />
                        <p className="text-white/40 text-sm leading-relaxed font-light break-words" dangerouslySetInnerHTML={{ __html: active.description }} />
                    </div>
                    
                    {/* Telemetry Section */}
                    <div className="xl:col-span-2 border-t xl:border-t-0 xl:border-l border-primary/20 pt-10 xl:pt-6 xl:pl-12">
                        <div className="text-xs font-bold text-white uppercase tracking-[0.2em] border-l-2 border-primary pl-3 mb-6 whitespace-nowrap">LIVE TELEMETRY</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-12 gap-y-6">
                            {active.telemetry?.map((row: any, i: number) => (
                                <div key={i} className="space-y-2 pb-4 border-b border-white/5 last:border-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,0,60,0.8)] shrink-0"></div>
                                            <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap overflow-hidden" dangerouslySetInnerHTML={{ __html: row.key.toUpperCase() }} />
                                        </div>
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider whitespace-nowrap text-right" dangerouslySetInnerHTML={{ __html: row.value.toUpperCase() }} />
                                    </div>
                                    {row.description && (
                                        <div className="text-xs text-white/30 font-light leading-relaxed pl-5 italic break-words">
                                            {row.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Glassmorphic Edit Modules Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT CORE MODULES</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Modules List</span>
                                <button 
                                    onClick={() => setFormModules([...formModules, { name: "New Module", icon: "Layers", title: "", description: "", telemetry: [] }])}
                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                >
                                    <Plus className="w-3 h-3" /> Add Module
                                </button>
                            </div>
                            <div className="space-y-6">
                                {formModules.map((m, mi) => (
                                    <div key={mi} className="bg-white/[0.01] border border-white/5 p-5 space-y-4 relative group">
                                        <button 
                                            onClick={() => setFormModules(formModules.filter((_, i) => i !== mi))}
                                            className="absolute top-4 right-4 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Module Label</label>
                                                <input value={m.name} onChange={e => { const n = [...formModules]; n[mi].name = e.target.value; setFormModules(n); }} className="w-full bg-black border border-white/10 p-3 text-primary font-black uppercase outline-none text-sm" placeholder="MODULE_LABEL" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Lucide Icon or SVG</label>
                                                <input value={m.icon} onChange={e => { const n = [...formModules]; n[mi].icon = e.target.value; setFormModules(n); }} className="w-full bg-black border border-white/10 p-3 text-white/40 font-mono outline-none text-xs" placeholder="LUCIDE_NAME or <svg>..." />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Module Title</label>
                                            <input value={m.title} onChange={e => { const n = [...formModules]; n[mi].title = e.target.value; setFormModules(n); }} className="w-full bg-black border border-white/10 p-3 text-white outline-none text-sm" placeholder="Module Title" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Description</label>
                                            <textarea value={m.description} onChange={e => { const n = [...formModules]; n[mi].description = e.target.value; setFormModules(n); }} className="w-full bg-black border border-white/10 p-3 text-white/80 outline-none text-sm" rows={3} placeholder="Module description..." />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black text-primary tracking-widest">Telemetry Data Feed</label>
                                                <button 
                                                    onClick={() => {
                                                        const n = [...formModules];
                                                        if (!n[mi].telemetry) n[mi].telemetry = [];
                                                        n[mi].telemetry.push({ key: "", value: "", description: "" });
                                                        setFormModules(n);
                                                    }} 
                                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                                >
                                                    <Plus className="w-3 h-3"/> Add Telemetry
                                                </button>
                                            </div>
                                            {m.telemetry?.map((row: any, ri: number) => (
                                                <div key={ri} className="bg-black/40 border border-white/5 p-3 space-y-2 relative group/tel">
                                                    <button 
                                                        onClick={() => {
                                                            const n = [...formModules];
                                                            n[mi].telemetry = n[mi].telemetry.filter((_: any, i: any) => i !== ri);
                                                            setFormModules(n);
                                                        }}
                                                        className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover/tel:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input value={row.key} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].key = e.target.value; setFormModules(n); }} className="w-full bg-black p-2 text-xs border border-white/5 uppercase" placeholder="Key" />
                                                        <input value={row.value} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].value = e.target.value; setFormModules(n); }} className="w-full bg-black p-2 text-xs border border-white/5 text-primary" placeholder="Value" />
                                                    </div>
                                                    <input value={row.description || ""} onChange={e => { const n = [...formModules]; n[mi].telemetry[ri].description = e.target.value; setFormModules(n); }} className="w-full bg-black/20 p-2 text-[10px] border border-white/5 italic text-white/30" placeholder="Telemetry description (optional)..." />
                                                </div>
                                            ))}
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
