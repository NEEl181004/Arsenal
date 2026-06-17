"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, X, Save, Loader2, Shield } from "lucide-react";
import DeleteToolButton from "./DeleteToolButton";
import AdminMobileLock from "./AdminMobileLock";

export default function EditableOverview({ 
    tool, 
    isAdmin, 
    toolId 
}: { 
    tool: any; 
    isAdmin: boolean; 
    toolId: string; 
}) {
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form States
    const [formName, setFormName] = useState(tool.name || "");
    const [formCategory, setFormCategory] = useState(tool.category || "Exploitation");
    const [formDeveloper, setFormDeveloper] = useState(tool.developer || "");
    const [formTier, setFormTier] = useState(tool.tier || "Expert");
    const [formBestFor, setFormBestFor] = useState(tool.bestFor || "Red Teaming");
    const [formOverview, setFormOverview] = useState(tool.overview || "");

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formName,
                    category: formCategory,
                    developer: formDeveloper,
                    tier: formTier,
                    bestFor: formBestFor,
                    overview: formOverview
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving overview: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header / Hero Section */}
            <header className="mb-8 sm:mb-12 pt-0">
                <div className="flex items-center justify-between mb-6 sm:mb-12">
                    <Link href="/" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Index
                    </Link>
                    {isAdmin && (
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/[0.03] px-6 py-2.5 hover:bg-primary transition-all border border-white/10 whitespace-nowrap cursor-pointer text-white"
                            >
                                <Pencil className="w-3.5 h-3.5 text-primary" /> Edit Overview
                            </button>
                            <Link href={`/admin/tools/${toolId}/edit`} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/[0.03] px-6 py-2.5 hover:bg-white/10 transition-all border border-white/10 whitespace-nowrap">
                                Full Editor
                            </Link>
                            <DeleteToolButton id={toolId} />
                            <AdminMobileLock />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-tight" dangerouslySetInnerHTML={{ __html: tool.name }} />
                    <div className="flex flex-wrap items-center gap-4 sm:gap-12 pt-0">
                        <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 sm:gap-4">
                            <span className="text-primary">//</span>
                            <span dangerouslySetInnerHTML={{ __html: `Category: ${tool.category}` }} />
                            <span className="h-[1px] w-8 sm:w-12 bg-white/10"></span>
                            <span className="text-white/40">ID: {toolId.slice(-8)}</span>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                            <div className="bg-primary text-white text-xs font-bold px-4 sm:px-6 py-1.5 flex items-center gap-2 uppercase shadow-lg shadow-primary/20 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Tier: {tool.tier}
                            </div>
                            <div className="bg-primary text-white text-xs font-bold px-4 sm:px-6 py-1.5 uppercase shadow-lg shadow-primary/20 whitespace-nowrap">
                                Best For: {tool.bestFor}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 01. Overview */}
            <section id="overview" className="scroll-mt-24 mb-16">
                <div className="max-w-5xl">
                    <div className="prose prose-invert prose-p:text-white/50 prose-p:text-sm md:prose-p:text-base prose-p:font-normal prose-strong:text-primary leading-relaxed animate-in fade-in duration-500" 
                        dangerouslySetInnerHTML={{ __html: tool.overview || "" }} 
                    />
                </div>
            </section>

            {/* Glassmorphic Edit Overview Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-3xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT OVERVIEW</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Tool Name</label>
                                    <input 
                                        type="text" 
                                        value={formName} 
                                        onChange={(e) => setFormName(e.target.value)} 
                                        className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Developer</label>
                                    <input 
                                        type="text" 
                                        value={formDeveloper} 
                                        onChange={(e) => setFormDeveloper(e.target.value)} 
                                        className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Category</label>
                                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white font-black focus:border-primary outline-none text-sm">
                                        <option value="Exploitation">EXPLOITATION</option>
                                        <option value="Discovery">DISCOVERY</option>
                                        <option value="Payloads">PAYLOADS</option>
                                        <option value="Recon">RECONNAISSANCE</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Tier</label>
                                    <select value={formTier} onChange={e => setFormTier(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white font-black focus:border-primary outline-none text-sm">
                                        <option value="Beginner">BEGINNER</option>
                                        <option value="Intermediate">INTERMEDIATE</option>
                                        <option value="Expert">EXPERT</option>
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Best For</label>
                                    <select value={formBestFor} onChange={e => setFormBestFor(e.target.value)} className="w-full bg-black border border-white/10 p-3 text-white font-black focus:border-primary outline-none text-sm">
                                        <option value="Red Teaming">RED TEAMING</option>
                                        <option value="Penetration Testing">PENETRATION TESTING</option>
                                        <option value="CTF">CTF</option>
                                        <option value="Research">RESEARCH</option>
                                        <option value="OSINT">OSINT</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">Overview Description (HTML Supported)</label>
                                <textarea 
                                    value={formOverview} 
                                    onChange={(e) => setFormOverview(e.target.value)} 
                                    className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                    rows={8}
                                />
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
