"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowUpRight, Pencil, X, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { IReference } from "@/models/Tool";

export default function EditableReferences({ 
    references, 
    isAdmin, 
    toolId 
}: { 
    references: IReference[]; 
    isAdmin: boolean; 
    toolId: string; 
}) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formReferences, setFormReferences] = useState<IReference[]>([]);

    const handleOpenEdit = () => {
        setFormReferences(references ? JSON.parse(JSON.stringify(references)) : []);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    references_list: formReferences
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving references: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    const filteredReferences = (references || []).filter(ref => 
        ref.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section id="references" className="scroll-mt-24 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 border-b border-white/[0.04] pb-6">
                <div className="flex items-center justify-between w-full sm:w-auto flex-1 gap-6">
                    <h2 className="text-[14px] md:text-[15px] font-black text-white uppercase tracking-widest flex items-center gap-4 flex-1" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                        REFERENCES
                    </h2>
                    {isAdmin && (
                        <button 
                            onClick={handleOpenEdit}
                            className="text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase flex items-center gap-1.5 shrink-0" style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                        >
                            <Pencil className="w-3.5 h-3.5 text-white/40" strokeWidth={2.5} /> EDIT REFERENCES
                        </button>
                    )}
                </div>
                <div className="relative w-full sm:w-[300px] shrink-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" strokeWidth={2} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border border-white/10 rounded-xl pl-11 pr-4 py-3 text-[12px] font-medium text-white w-full focus:outline-none focus:border-white/30 transition-all placeholder:text-white/20" 
                        placeholder="Search references..." 
                    />
                </div>
            </div>
            
            <div className="bg-[#0b0d11] border border-white/[0.08] rounded-xl overflow-hidden shadow-inner">
                {/* Header - Desktop Only */}
                <div className="hidden md:grid grid-cols-12 gap-8 px-6 py-4 bg-white/[0.02] border-b border-white/[0.08] text-[10px] font-black text-white/30 uppercase tracking-widest items-center" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                    <div className="col-span-1 whitespace-nowrap">ID</div>
                    <div className="col-span-6 whitespace-nowrap">RESOURCE NAME</div>
                    <div className="col-span-2 whitespace-nowrap text-center">CATEGORY</div>
                    <div className="col-span-3 text-right whitespace-nowrap">MODIFIED</div>
                </div>

                {/* Content Rows */}
                <div className="divide-y divide-white/[0.04]">
                    {filteredReferences.length === 0 ? (
                        <div className="py-12 text-center text-white/10 uppercase font-black text-xs tracking-widest">
                            NO REFERENCES FOUND
                        </div>
                    ) : (
                        filteredReferences.map((ref, i) => (
                            <div key={i} className="group bg-transparent hover:bg-white/[0.02] transition-colors">
                                <Link href={ref.url || "#"} target="_blank" className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 px-6 py-5 items-center cursor-pointer">
                                    {/* Mobile Header Info */}
                                    <div className="flex items-center justify-between md:col-span-1">
                                        <span className="text-[12px] font-black text-white/20 uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>{i < 9 ? `0${i+1}` : i+1}</span>
                                        <span className="md:hidden px-3 py-1 bg-white/[0.03] border border-white/[0.08] text-[10px] font-black text-white/40 uppercase tracking-widest rounded" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>{ref.type || "DOCS"}</span>
                                    </div>

                                    {/* Resource Name */}
                                    <div className="md:col-span-6">
                                        <div className="text-[12px] md:text-[13px] font-black text-white uppercase tracking-wider group-hover:text-white transition-colors break-words flex items-center gap-2" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                                            {ref.name}
                                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-white/40" strokeWidth={2} />
                                        </div>
                                    </div>

                                    {/* Desktop Category */}
                                    <div className="hidden md:block md:col-span-2 text-center">
                                        <span className="px-3 py-1 bg-white/[0.03] border border-white/[0.08] text-[10px] font-black text-white/40 uppercase tracking-widest rounded" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>{ref.type || "DOCS"}</span>
                                    </div>

                                    {/* Desktop Modified Date */}
                                    <div className="hidden md:block md:col-span-3 text-[11px] font-black text-white/20 uppercase tracking-widest text-right" style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                                        {ref.updatedAt || "2024.01.15"}
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Glassmorphic Edit References Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT REFERENCES</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Resource List</span>
                                <button 
                                    onClick={() => setFormReferences([...formReferences, { name: "", type: "Docs", url: "", updatedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.') }])}
                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                >
                                    <Plus className="w-3 h-3" /> Add Reference
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formReferences.map((ref, idx) => (
                                    <div key={idx} className="bg-white/[0.01] border border-white/5 p-4 flex flex-col md:flex-row gap-4 items-end relative group">
                                        <button 
                                            onClick={() => setFormReferences(formReferences.filter((_, i) => i !== idx))}
                                            className="absolute top-4 right-4 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="flex-1 w-full space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Resource Name</label>
                                            <input 
                                                type="text" 
                                                value={ref.name} 
                                                onChange={(e) => {
                                                    const n = [...formReferences];
                                                    n[idx].name = e.target.value;
                                                    setFormReferences(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-3 text-white font-black text-xs outline-none" 
                                                placeholder="Resource name..." 
                                            />
                                        </div>
                                        <div className="w-full md:w-48 space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Type</label>
                                            <select 
                                                value={ref.type} 
                                                onChange={(e) => {
                                                    const n = [...formReferences];
                                                    n[idx].type = e.target.value;
                                                    setFormReferences(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-3 text-white font-black text-xs outline-none uppercase"
                                            >
                                                <option value="Docs">DOCS</option>
                                                <option value="Video">VIDEO</option>
                                                <option value="GitHub">GITHUB</option>
                                                <option value="Exploit">EXPLOIT</option>
                                                <option value="Writeup">WRITEUP</option>
                                            </select>
                                        </div>
                                        <div className="flex-[2] w-full space-y-1">
                                            <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Secure URL</label>
                                            <input 
                                                type="text" 
                                                value={ref.url} 
                                                onChange={(e) => {
                                                    const n = [...formReferences];
                                                    n[idx].url = e.target.value;
                                                    setFormReferences(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-3 text-white/40 font-mono text-xs outline-none" 
                                                placeholder="https://..." 
                                            />
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
        </section>
    );
}
