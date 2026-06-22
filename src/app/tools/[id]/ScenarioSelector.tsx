"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IScenario, IKeyTakeaway, IAttackPath } from "@/models/Tool";
import { 
    ChevronDown, 
    TrendingUp,
    Share2,
    Database,
    ArrowRight,
    Target,
    Terminal,
    Copy,
    ShieldAlert,
    Activity,
    Shield,
    Globe,
    Pencil,
    Plus,
    Trash2,
    X,
    Save,
    Loader2
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const parseImages = (logsImage: any): string[] => {
    if (!logsImage) return [];
    if (Array.isArray(logsImage)) return logsImage.filter(Boolean);
    if (typeof logsImage === "string") {
        const str = logsImage.trim();
        if (!str) return [];
        if (str.includes("||")) {
            return str.split("||").map(s => s.trim()).filter(Boolean);
        }
        if (str.includes(",data:")) {
            return str.split(/,(?=data:)/).map(s => s.trim()).filter(Boolean);
        }
        return [str];
    }
    return [];
};

function ImageCarousel({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="py-20 text-white/5 flex flex-col items-center gap-6">
                <ShieldAlert className="w-20 h-20" />
                <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">no output shared yet</span>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="w-full flex items-center justify-center p-4">
                <img 
                    src={images[0]} 
                    alt="Output" 
                    className="max-h-[360px] w-auto grayscale group-hover:grayscale-0 transition-all duration-1000 object-contain" 
                />
            </div>
        );
    }

    return (
        <div className="relative w-full group overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 flex items-center justify-center p-4">
                        <img 
                            src={img} 
                            alt={`Output Slide ${idx + 1}`} 
                            className="max-h-[360px] w-auto grayscale group-hover:grayscale-0 transition-all duration-1000 object-contain" 
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button 
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:border-primary/50 transition-all cursor-pointer z-10"
            >
                &larr;
            </button>
            <button 
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:border-primary/50 transition-all cursor-pointer z-10"
            >
                &rarr;
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? "bg-primary w-3" : "bg-white/20"}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function ScenarioSelector({ 
    scenarios, 
    isAdmin = false, 
    toolId 
}: { 
    scenarios: IScenario[]; 
    isAdmin?: boolean; 
    toolId?: string; 
}) {
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    
    // Modal & Form States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("edit");
    const [saving, setSaving] = useState(false);

    const [formName, setFormName] = useState("");
    const [formObjective, setFormObjective] = useState("");
    const [formObjectiveList, setFormObjectiveList] = useState<string[]>([]);
    const [formScript, setFormScript] = useState("");
    const [formLogsImage, setFormLogsImage] = useState("");
    const [formKeyTakeaways, setFormKeyTakeaways] = useState<IKeyTakeaway[]>([]);
    const [formAttackPaths, setFormAttackPaths] = useState<IAttackPath[]>([]);

    const active = scenarios[selectedIndex] || scenarios[0];

    const handleOpenEdit = () => {
        if (!active) return;
        setModalMode("edit");
        setFormName(active.name || "");
        setFormObjective(active.objective || "");
        setFormObjectiveList(active.objectiveList ? [...active.objectiveList] : []);
        setFormScript(active.script || "");
        setFormLogsImage(active.logsImage || "");
        setFormKeyTakeaways(active.keyTakeaways ? JSON.parse(JSON.stringify(active.keyTakeaways)) : []);
        setFormAttackPaths(active.attackPaths ? JSON.parse(JSON.stringify(active.attackPaths)) : []);
        setIsEditModalOpen(true);
    };

    const handleOpenAdd = () => {
        setModalMode("add");
        setFormName("New Mission");
        setFormObjective("");
        setFormObjectiveList([""]);
        setFormScript("");
        setFormLogsImage("");
        setFormKeyTakeaways([{ title: "SIGNATURE", content: "" }]);
        setFormAttackPaths([{ title: "ESCALATION", risk: "HIGH", desc: "" }]);
        setIsEditModalOpen(true);
    };

    const handleSaveScenario = async () => {
        if (!toolId) return;
        setSaving(true);
        try {
            let updatedScenarios = [...scenarios];
            const newScenarioData: IScenario = {
                ...((modalMode === "edit" && active) ? active : {}),
                name: formName,
                objective: formObjective,
                script: formScript,
                logsImage: formLogsImage,
                keyTakeaways: formKeyTakeaways,
                attackPaths: formAttackPaths,
                objectiveList: formObjectiveList.filter(Boolean)
            };

            if (modalMode === "edit") {
                updatedScenarios[selectedIndex] = newScenarioData;
            } else {
                updatedScenarios.push(newScenarioData);
            }

            // Optimize scenario payloads
            const optimizedScenarios = updatedScenarios.map((s) => {
                const orig = scenarios.find(o => 
                    ((s as any)._id && (o as any)._id && (s as any)._id === (o as any)._id) ||
                    (!(s as any)._id && !(o as any)._id && s.name === o.name)
                );
                if (orig && s.logsImage === orig.logsImage) {
                    return {
                        ...s,
                        logsImage: "__KEEP_EXISTING_IMAGE__"
                    };
                }
                return s;
            });

            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenarios: optimizedScenarios })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                router.refresh();
                if (modalMode === "add") {
                    setSelectedIndex(scenarios.length);
                }
            } else {
                const err = await res.json();
                alert(`Error saving: ${err.error || "Unknown server error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteScenario = async () => {
        if (!toolId || !active) return;
        if (!confirm(`Are you sure you want to delete scenario "${active.name}"?`)) return;
        setSaving(true);
        try {
            const updatedScenarios = scenarios.filter((_, idx) => idx !== selectedIndex);
            
            // Optimize scenario payloads
            const optimizedScenarios = updatedScenarios.map((s) => {
                const orig = scenarios.find(o => 
                    ((s as any)._id && (o as any)._id && (s as any)._id === (o as any)._id) ||
                    (!(s as any)._id && !(o as any)._id && s.name === o.name)
                );
                if (orig && s.logsImage === orig.logsImage) {
                    return {
                        ...s,
                        logsImage: "__KEEP_EXISTING_IMAGE__"
                    };
                }
                return s;
            });

            const res = await fetch(`/api/tools/${toolId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scenarios: optimizedScenarios })
            });

            if (res.ok) {
                setSelectedIndex(0);
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error deleting: ${err.error || "Unknown server error"}`);
            }
        } catch (e: any) {
            alert(`Error: ${e.message || e}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-12">
            {!scenarios || scenarios.length === 0 ? (
                <div className="p-20 border border-white/5 text-center text-white/10 uppercase font-black flex flex-col items-center gap-4">
                    <span>AWAITING MISSION PARAMETERS...</span>
                    {isAdmin && (
                        <button onClick={handleOpenAdd} className="bg-primary/20 hover:bg-primary px-6 py-3 border border-primary/40 text-xs font-bold text-white uppercase tracking-widest transition-all cursor-pointer">
                            Create First Scenario
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Protocol Select Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
                        <div className="space-y-6">
                            <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider flex items-center gap-4">
                                <span>Test</span> <span className="text-primary">Scenario</span>
                                <span className="h-[1px] flex-1 bg-white/5"></span>
                            </h2>
                            <p className="text-sm text-white/40 font-light max-w-2xl leading-relaxed">
                                Initialize automated offensive modules against target perimeter. Deploying The Crimson Vault authorization tokens for active session state.
                            </p>
                        </div>
                        
                        <div className="relative w-full md:w-80 lg:w-96">
                            <div className="flex justify-between items-center mb-4 ml-2">
                                <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] whitespace-nowrap">SELECT MISSION PROFILE</div>
                                {isAdmin && (
                                    <div className="flex items-center gap-4">
                                        <button onClick={handleOpenAdd} className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1">
                                            <Plus className="w-3 h-3 text-primary" /> Add
                                        </button>
                                        <button onClick={handleOpenEdit} className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1">
                                            <Pencil className="w-3 h-3 text-primary" /> Edit
                                        </button>
                                        <button onClick={handleDeleteScenario} className="text-[10px] font-black text-white/40 hover:text-primary transition-colors uppercase flex items-center gap-1">
                                            <Trash2 className="w-3 h-3 text-primary" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 px-6 py-4 sm:py-6 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                <span className="text-xs font-bold uppercase tracking-[0.1em] lg:tracking-[0.2em] text-white truncate pr-4">
                                    {(active?.name || "").toUpperCase()}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-500 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                            </button>
                            {isOpen && (
                                <div className="absolute top-full right-0 w-full bg-[#111] border border-white/[0.1] shadow-2xl z-40 mt-3 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
                                    {scenarios.map((s, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { setSelectedIndex(i); setIsOpen(false); }} 
                                            className={`w-full text-left px-10 py-6 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-b border-white/[0.03] ${i === selectedIndex ? "text-primary bg-white/[0.01]" : "text-white/40"}`}
                                        >
                                            {s.name.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* REORDERED Sections */}
                    <div className="space-y-12">
                        {/* 1. MISSION OBJECTIVE */}
                        {(active?.objective || (active?.objectiveList && active.objectiveList.filter(Boolean).length > 0)) && (
                            <div className="space-y-6">
                                <div className="text-xs font-bold text-white/50 uppercase tracking-widest border-l-2 border-primary pl-3 whitespace-nowrap">MISSION OBJECTIVE</div>
                                <div className="space-y-4">
                                    {active.objective && (
                                        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight break-words" dangerouslySetInnerHTML={{ __html: active.objective }} />
                                    )}
                                    {active.objectiveList && active.objectiveList.filter(Boolean).length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {active.objectiveList.filter(Boolean).map((obj, i) => (
                                                <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.01] border border-white/5">
                                                    <div className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></div>
                                                    <span className="text-xs text-white/60 font-light leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: obj }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 2. EXECUTION SCRIPT */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest border-l-2 border-primary pl-3 whitespace-nowrap">EXECUTION SCRIPT</div>
                                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest animate-pulse whitespace-nowrap">LIVE PROTOCOL</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(active?.script || "");
                                        alert("SCRIPT COPIED TO CLIPBOARD");
                                    }}
                                    className="group/btn self-start sm:self-auto flex items-center gap-3 px-6 py-2 bg-white/[0.03] border border-white/10 hover:border-primary/50 transition-all"
                                >
                                    <span className="text-xs font-bold text-white/40 group-hover/btn:text-primary uppercase tracking-widest">EXTRACT DATA</span>
                                    <Copy className="w-3.5 h-3.5 text-white/20 group-hover/btn:text-primary" />
                                </button>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary/40"></div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary/40"></div>
                                <div className="bg-[#050505] border border-white/[0.05] relative overflow-hidden group shadow-2xl">
                                    <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between px-6">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                        </div>
                                        <div className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em] hidden sm:block">ARSENAL PROTOCOL V4</div>
                                    </div>
                                    <div className="p-6 md:p-8 font-mono text-xs md:text-sm text-white/80 leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto custom-scrollbar">
                                        {(active?.script || "AWAITING MISSION SCRIPT...").split('\n').map((line, i) => (
                                            <div key={i} className="flex gap-4 sm:gap-6 group/line hover:bg-white/[0.02] transition-colors -mx-4 px-4">
                                                <span className="text-primary font-black opacity-40 select-none">$</span>
                                                <span className="flex-1">{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. OUTPUT */}
                        <div className="space-y-6">
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest border-l-2 border-primary pl-3 whitespace-nowrap">OUTPUT</div>
                            <div className="bg-[#080808] border border-white/5 p-4 relative group overflow-hidden max-h-[400px] flex items-center justify-center shadow-inner">
                                <ImageCarousel images={parseImages(active?.logsImage)} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                            </div>
                        </div>

                        {/* 4. MISSION TAKEAWAYS */}
                        <div className="space-y-8">
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest border-l-2 border-primary pl-3 whitespace-nowrap">MISSION TAKEAWAYS</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(active?.keyTakeaways || []).map((card, i) => {
                                    const hasTitle = card.title && card.title.trim().length > 0;
                                    return (
                                        <div key={i} className={`bg-white/[0.02] border border-white/5 p-6 md:p-10 space-y-6 group hover:border-primary/40 transition-all relative overflow-hidden flex flex-col ${!hasTitle ? "justify-center items-center text-center" : ""}`}>
                                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mb-12 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                                            {hasTitle && (
                                                <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em] lg:tracking-[0.4em] break-words">{card.title.replace(/_/g, ' ')}</h4>
                                            )}
                                            <p className={`text-sm text-white/40 font-light leading-relaxed break-words ${!hasTitle ? "text-center" : ""}`} dangerouslySetInnerHTML={{ __html: card.content }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. ATTACK PLANS */}
                        <div className="space-y-8">
                            <div className="text-xs font-bold text-white/50 uppercase tracking-widest border-l-2 border-primary pl-3 whitespace-nowrap">ATTACK PLANS</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(active?.attackPaths || []).map((path, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-start justify-between mb-6 gap-4">
                                            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
                                            <span className="bg-primary/10 border border-primary/20 text-xs font-bold text-primary px-3 py-1 uppercase tracking-widest whitespace-nowrap truncate max-w-[150px]">
                                                {path.risk.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 break-words">{path.title.replace(/_/g, ' ')}</h4>
                                        <p className="text-sm text-white/40 font-light leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: path.desc }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Glassmorphic Edit/Add Scenario Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#0b0b0b] border border-white/10 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="text-lg font-black text-white uppercase tracking-widest">
                                {modalMode === "add" ? "ADD NEW SCENARIO" : `EDIT: ${(active?.name || "").toUpperCase()}`}
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/40 hover:text-primary transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Fields */}
                        <div className="space-y-6">
                            {/* Name & Objective */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Scenario Name</label>
                                    <input 
                                        type="text" 
                                        value={formName} 
                                        onChange={(e) => setFormName(e.target.value)} 
                                        className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all uppercase"
                                        placeholder="SCENARIO_NAME"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Primary Objective</label>
                                    <input 
                                        type="text" 
                                        value={formObjective} 
                                        onChange={(e) => setFormObjective(e.target.value)} 
                                        className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                        placeholder="PRIMARY_OBJECTIVE"
                                    />
                                </div>
                            </div>

                             {/* Mission Objectives List */}
                             <div className="space-y-3 pt-4 border-t border-white/5">
                                 <div className="flex justify-between items-center">
                                     <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Objective Boxes (Optional)</label>
                                     <button 
                                         type="button"
                                         onClick={() => setFormObjectiveList([...formObjectiveList, ""])}
                                         className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black cursor-pointer"
                                     >
                                         <Plus className="w-3 h-3" /> Add Objective Box
                                     </button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {formObjectiveList.map((obj, idx) => (
                                         <div key={idx} className="flex gap-2 items-center bg-black/40 border border-white/5 p-3 relative group">
                                             <input 
                                                 type="text" 
                                                 value={obj} 
                                                 onChange={(e) => {
                                                     const n = [...formObjectiveList];
                                                     n[idx] = e.target.value;
                                                     setFormObjectiveList(n);
                                                 }}
                                                 className="flex-1 bg-transparent text-xs text-white/60 font-light outline-none"
                                                 placeholder="Objective description..."
                                             />
                                             <button 
                                                 type="button"
                                                 onClick={() => setFormObjectiveList(formObjectiveList.filter((_, i) => i !== idx))} 
                                                 className="text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                             >
                                                 <Trash2 className="w-3.5 h-3.5" />
                                             </button>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                            {/* Script */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Execution Script</label>
                                <textarea 
                                    value={formScript} 
                                    onChange={(e) => setFormScript(e.target.value)} 
                                    className="w-full bg-white/[0.03] border border-white/[0.06] text-primary px-4 py-3 text-xs font-mono focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                    rows={6}
                                    placeholder="Execution script..."
                                />
                            </div>

                            {/* Screenshot Upload */}
                            <ImageUpload label="Evidence logs image" value={formLogsImage} onChange={setFormLogsImage} />

                            {/* Key Takeaways */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Key Takeaways</label>
                                    <button 
                                        onClick={() => setFormKeyTakeaways([...formKeyTakeaways, { title: "SIGNATURE", content: "" }])}
                                        className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                    >
                                        <Plus className="w-3 h-3" /> Add Takeaway
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formKeyTakeaways.map((take, idx) => (
                                        <div key={idx} className="p-4 bg-black/40 border border-white/5 space-y-3 relative group">
                                            <button 
                                                onClick={() => setFormKeyTakeaways(formKeyTakeaways.filter((_, i) => i !== idx))} 
                                                className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <input 
                                                type="text" 
                                                value={take.title} 
                                                onChange={(e) => {
                                                    const n = [...formKeyTakeaways];
                                                    n[idx].title = e.target.value;
                                                    setFormKeyTakeaways(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-2 text-xs font-black text-primary uppercase outline-none"
                                                placeholder="TAKEAWAY_TITLE"
                                            />
                                            <textarea 
                                                value={take.content} 
                                                onChange={(e) => {
                                                    const n = [...formKeyTakeaways];
                                                    n[idx].content = e.target.value;
                                                    setFormKeyTakeaways(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-2 text-xs text-white/60 font-light outline-none"
                                                rows={2}
                                                placeholder="Takeaway content..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attack Plans */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Attack Plans</label>
                                    <button 
                                        onClick={() => setFormAttackPaths([...formAttackPaths, { title: "ESCALATION", risk: "HIGH", desc: "" }])}
                                        className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"
                                    >
                                        <Plus className="w-3 h-3" /> Add Attack Plan
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formAttackPaths.map((path, idx) => (
                                        <div key={idx} className="p-4 bg-black/40 border border-white/5 space-y-3 relative group">
                                            <button 
                                                onClick={() => setFormAttackPaths(formAttackPaths.filter((_, i) => i !== idx))} 
                                                className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input 
                                                    type="text" 
                                                    value={path.title} 
                                                    onChange={(e) => {
                                                        const n = [...formAttackPaths];
                                                        n[idx].title = e.target.value;
                                                        setFormAttackPaths(n);
                                                    }}
                                                    className="w-full bg-black border border-white/10 p-2 text-xs font-black text-white uppercase outline-none"
                                                    placeholder="PLAN_TITLE"
                                                />
                                                <select 
                                                    value={path.risk} 
                                                    onChange={(e) => {
                                                        const n = [...formAttackPaths];
                                                        n[idx].risk = e.target.value;
                                                        setFormAttackPaths(n);
                                                    }}
                                                    className="w-full bg-black border border-white/10 p-2 text-xs text-white font-black uppercase outline-none"
                                                >
                                                    <option value="CRITICAL">CRITICAL</option>
                                                    <option value="HIGH">HIGH</option>
                                                    <option value="MEDIUM">MEDIUM</option>
                                                    <option value="LOW">LOW</option>
                                                </select>
                                            </div>
                                            <textarea 
                                                value={path.desc} 
                                                onChange={(e) => {
                                                    const n = [...formAttackPaths];
                                                    n[idx].desc = e.target.value;
                                                    setFormAttackPaths(n);
                                                }}
                                                className="w-full bg-black border border-white/10 p-2 text-xs text-white/60 font-light outline-none"
                                                rows={2}
                                                placeholder="Plan description..."
                                            />
                                        </div>
                                    ))}
                                </div>
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
                                onClick={handleSaveScenario}
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
