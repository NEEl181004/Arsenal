"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, Copy, CheckCircle2, ChevronDown, Pencil, X, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { IInstallationTab } from "@/models/Tool";

export default function InstallationViewer({ 
    data, 
    isAdmin = false, 
    toolId 
}: { 
    data: IInstallationTab[]; 
    isAdmin?: boolean; 
    toolId?: string; 
}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formSequence, setFormSequence] = useState<IInstallationTab[]>([]);

    const currentTab = data[activeTab] || data[0];

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleOpenEdit = () => {
        setFormSequence(data ? JSON.parse(JSON.stringify(data)) : []);
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
                    installation_sequence: formSequence
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error saving installation sequence: ${err.error || "Unknown error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="p-20 border border-dashed border-white/5 text-center text-white/10 font-black text-[11px] tracking-[0.5em] uppercase flex flex-col items-center gap-4">
                <span>AWAITING DEPLOYMENT PROTOCOLS...</span>
                {isAdmin && (
                    <button onClick={handleOpenEdit} className="bg-primary/20 hover:bg-primary px-6 py-3 border border-primary/40 text-xs font-bold text-white uppercase tracking-widest transition-all">
                        Create First Target OS
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-1000 relative">
            {/* Header Overlay Edit Button */}
            {isAdmin && (
                <div className="flex justify-end mb-1">
                    <button 
                        onClick={handleOpenEdit}
                        className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer bg-white/[0.03] border border-white/10 px-4 py-2"
                    >
                        <Pencil className="w-3 h-3 text-primary" /> Edit Installation
                    </button>
                </div>
            )}

            {/* Environment Selection Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 sm:pb-6 gap-4">
                {/* Mobile Dropdown View (Phone only) */}
                <div className="md:hidden relative w-full group">
                    <div className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-2 ml-1">SELECT ENVIRONMENT</div>
                    <select 
                        value={activeTab}
                        onChange={(e) => setActiveTab(Number(e.target.value))}
                        className="w-full bg-white/[0.03] border border-white/10 p-3 pr-10 appearance-none text-[11px] font-bold text-white uppercase tracking-wider focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        {data.map((tab, i) => (
                            <option key={i} value={i} className="bg-[#0a0a0a] text-white">
                                {tab.tabName.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 bottom-3 pointer-events-none text-primary">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                {/* Tablet & Desktop Tabs View (768px+) */}
                <div className="hidden md:flex flex-wrap gap-3">
                    {data.map((tab, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveTab(i)}
                            className={`px-5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                i === activeTab 
                                ? "bg-primary text-white border-primary shadow-[0_0_10px_rgba(255,0,60,0.2)]" 
                                : "text-white/30 border-white/5 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab.tabName.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest whitespace-nowrap">
                        MODULE: DEPLOY SEQUENCE 0{activeTab + 1}
                    </div>
                    <div className="h-0.5 w-8 bg-primary/20 self-start md:self-end"></div>
                </div>
            </div>

            {/* Steps List */}
            {currentTab && (
                <div className="space-y-4">
                    {currentTab.steps.map((step, i) => {
                        const hasCmd = step.cmd && step.cmd.trim().length > 0;
                        return (
                            <div key={i} className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all group overflow-hidden">
                                <div className={hasCmd ? "grid grid-cols-1 lg:grid-cols-2" : "w-full"}>
                                    <div className={`p-5 md:p-6 relative ${hasCmd ? "border-b lg:border-b-0 lg:border-r border-white/5" : ""}`}>
                                        <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                        <div className="text-xs font-bold text-white uppercase tracking-wider border-l border-primary pl-3 mb-3 break-words">
                                            STEP {step.id || `0${i+1}`}: {step.name.toUpperCase()}
                                        </div>
                                        <p className="text-xs text-white/40 font-normal leading-relaxed pr-4 break-words">
                                            {step.desc}
                                        </p>
                                    </div>
                                    {hasCmd && (
                                        <div className="flex-1 p-5 md:p-6 bg-black/20 flex items-center justify-between group/cmd relative">
                                            <div className="flex items-start gap-3 font-mono text-xs scroll-smooth">
                                                <span className="text-primary font-black animate-pulse shrink-0">$</span>
                                                <span className="text-white tracking-wide break-words whitespace-normal leading-relaxed">{step.cmd}</span>
                                            </div>
                                            <button 
                                                onClick={() => copyToClipboard(step.cmd, i)}
                                                className="p-2 bg-white/[0.03] border border-white/5 text-white/20 hover:text-primary hover:border-primary/30 transition-all shrink-0 ml-4"
                                            >
                                                {copiedIndex === i ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Glassmorphic Edit Installation Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">EDIT INSTALLATION SEQUENCE</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Target OS Environments</span>
                                <button 
                                    onClick={() => setFormSequence([...formSequence, { tabName: "New OS", steps: [] }])}
                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                >
                                    <Plus className="w-3 h-3" /> Add Target OS
                                </button>
                            </div>
                            <div className="space-y-6">
                                {formSequence.map((tab, ti) => (
                                    <div key={ti} className="bg-white/[0.01] border border-white/5 p-5 space-y-4 relative group">
                                        <button 
                                            onClick={() => setFormSequence(formSequence.filter((_, i) => i !== ti))}
                                            className="absolute top-4 right-4 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">OS Name</label>
                                                <input value={tab.tabName} onChange={e => { const n = [...formSequence]; n[ti].tabName = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-3 text-primary font-black uppercase outline-none text-sm" placeholder="OS_NAME" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">OS Icon (lucide-react name or SVG)</label>
                                                <input value={tab.svgIcon || ""} onChange={e => { const n = [...formSequence]; n[ti].svgIcon = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-3 text-white/40 font-mono outline-none text-xs" placeholder="Paste <svg> or lucide-name..." />
                                            </div>
                                        </div>
                                        
                                        {/* Steps list */}
                                        <div className="space-y-3 pt-3 border-t border-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Steps List</span>
                                                <button 
                                                    onClick={() => {
                                                        const n = [...formSequence];
                                                        const nextId = (n[ti].steps.length + 1).toString().padStart(2, '0');
                                                        n[ti].steps.push({ id: nextId, name: "New Step", desc: "", cmd: "" });
                                                        setFormSequence(n);
                                                    }}
                                                    className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Step
                                                </button>
                                            </div>
                                            {tab.steps.map((step, si) => (
                                                <div key={si} className="bg-black/60 p-4 border border-white/5 space-y-3 relative group/step">
                                                    <button
                                                        onClick={() => {
                                                            const n = [...formSequence];
                                                            n[ti].steps = n[ti].steps.filter((_, idx) => idx !== si);
                                                            setFormSequence(n);
                                                        }}
                                                        className="absolute top-3 right-3 text-white/10 hover:text-primary opacity-0 group-hover/step:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div className="col-span-1 space-y-1">
                                                            <label className="text-[8px] font-black text-white/25 uppercase tracking-widest">Step ID</label>
                                                            <input value={step.id} onChange={e => { const n = [...formSequence]; n[ti].steps[si].id = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-2 text-xs font-mono" placeholder="01" />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[8px] font-black text-white/25 uppercase tracking-widest">Step Name</label>
                                                            <input value={step.name} onChange={e => { const n = [...formSequence]; n[ti].steps[si].name = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-2 text-xs font-bold uppercase" placeholder="Step Name" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-white/25 uppercase tracking-widest">Description</label>
                                                        <textarea value={step.desc} onChange={e => { const n = [...formSequence]; n[ti].steps[si].desc = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-2 text-xs" rows={2} placeholder="Step description..." />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[8px] font-black text-white/25 uppercase tracking-widest">Command</label>
                                                        <input value={step.cmd} onChange={e => { const n = [...formSequence]; n[ti].steps[si].cmd = e.target.value; setFormSequence(n); }} className="w-full bg-black border border-white/10 p-2 text-xs text-white font-mono" placeholder="Command..." />
                                                    </div>
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
