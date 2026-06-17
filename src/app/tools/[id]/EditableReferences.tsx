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
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8 border-b border-white/5 pb-4">
                <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-0 flex items-center gap-4">
                    <span>References</span>
                    {isAdmin && (
                        <button 
                            onClick={handleOpenEdit}
                            className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer"
                        >
                            <Pencil className="w-3 h-3 text-primary" /> Edit References
                        </button>
                    )}
                </h2>
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/[0.03] border border-white/10 pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-white w-full focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10" 
                        placeholder="Search references..." 
                    />
                </div>
            </div>
            
            <div className="space-y-2">
                {/* Header - Desktop Only */}
                <div className="hidden md:grid grid-cols-12 gap-8 px-6 py-4 border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest items-center">
                    <div className="col-span-1 text-white/20 whitespace-nowrap">ID</div>
                    <div className="col-span-6 whitespace-nowrap">Resource Name</div>
                    <div className="col-span-2 whitespace-nowrap">Category</div>
                    <div className="col-span-3 text-right whitespace-nowrap">Modified</div>
                </div>

                {/* Content Rows */}
                {filteredReferences.length === 0 ? (
                    <div className="py-12 text-center text-white/10 uppercase font-black text-xs tracking-widest border border-dashed border-white/5">
                        NO REFERENCES FOUND
                    </div>
                ) : (
                    filteredReferences.map((ref, i) => (
                        <div key={i} className="group bg-white/[0.01] md:bg-transparent border border-white/5 md:border-0 md:border-b md:border-white/[0.03] p-4 md:p-0 hover:bg-white/[0.02] transition-all">
                            <Link href={ref.url || "#"} target="_blank" className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 md:px-6 md:py-4 items-center cursor-pointer">
                                {/* Mobile Header Info */}
                                <div className="flex items-center justify-between md:col-span-1">
                                    <span className="text-xs font-bold text-white/10 uppercase tracking-widest">{i < 9 ? `0${i+1}` : i+1}</span>
                                    <span className="md:hidden px-3 py-1 bg-white/5 border border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">{ref.type || "Docs"}</span>
                                </div>

                                {/* Resource Name */}
                                <div className="md:col-span-6">
                                    <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors break-words flex items-center gap-2">
                                        {ref.name}
                                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                    </div>
                                </div>

                                {/* Desktop Category */}
                                <div className="hidden md:block md:col-span-2">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-bold text-white/40 uppercase tracking-widest">{ref.type || "Docs"}</span>
                                </div>

                                {/* Desktop Modified Date */}
                                <div className="hidden md:block md:col-span-3 text-xs font-bold text-white/20 uppercase tracking-widest text-right">
                                    {ref.updatedAt || "2024.03.12"}
                                </div>
                            </Link>
                        </div>
                    ))
                )}
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
