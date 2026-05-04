"use client";

import { useState } from "react";
import { IScenario } from "@/models/Tool";
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
    Globe
} from "lucide-react";

export default function ScenarioSelector({ scenarios }: { scenarios: IScenario[] }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    
    const active = scenarios[selectedIndex] || scenarios[0];

    if (!scenarios || scenarios.length === 0) {
        return <div className="p-20 border border-white/5 text-center text-white/10 uppercase font-black">AWAITING MISSION PARAMETERS...</div>;
    }

    return (
        <div className="space-y-12">
            {/* Protocol Select Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
                <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                        <span className="whitespace-nowrap">TEST</span> <span className="text-primary whitespace-nowrap">SCENARIO</span>
                        <span className="h-[1px] flex-1 bg-white/5 min-w-[20px]"></span>
                    </h2>
                    <p className="text-white/40 text-sm md:text-base font-light max-w-2xl leading-relaxed">
                        Initialize automated offensive modules against target perimeter. Deploying The Crimson Vault authorization tokens for active session state.
                    </p>
                </div>
                
                <div className="relative w-full md:w-80 lg:w-96">
                    <div className="text-[10px] lg:text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-4 ml-2 whitespace-nowrap">SELECT MISSION PROFILE</div>
                    <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 px-6 py-4 sm:py-6 hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                        <span className="text-[11px] lg:text-[12px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] text-white truncate pr-4">
                            {active.name.toUpperCase()}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-white/20 transition-transform duration-500 shrink-0 ${isOpen ? "rotate-180 text-primary" : ""}`} />
                    </button>
                    {isOpen && (
                        <div className="absolute top-full right-0 w-full bg-[#111] border border-white/[0.1] shadow-2xl z-40 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {scenarios.map((s, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => { setSelectedIndex(i); setIsOpen(false); }} 
                                    className={`w-full text-left px-10 py-6 text-[10px] lg:text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-b border-white/[0.03] ${i === selectedIndex ? "text-primary bg-white/[0.01]" : "text-white/40"}`}
                                >
                                    {s.name.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* REORDERED Sections */}
            <div className="space-y-16">
                {/* 1. MISSION OBJECTIVE */}
                <div className="space-y-8">
                    <div className="text-[13px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.4em] border-l-2 border-primary pl-4 whitespace-nowrap">MISSION OBJECTIVE</div>
                    <div className="space-y-8">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight break-words" dangerouslySetInnerHTML={{ __html: active.objective || "AWAITING..." }} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(active.objectiveList || []).map((obj, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 bg-white/[0.02] border border-white/5">
                                    <div className="w-1.5 h-1.5 bg-primary mt-1.5 shrink-0"></div>
                                    <span className="text-[14px] text-white/60 font-light leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: obj }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. EXECUTION SCRIPT */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-[13px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.4em] border-l-2 border-primary pl-4 whitespace-nowrap">EXECUTION SCRIPT</div>
                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest animate-pulse whitespace-nowrap">LIVE PROTOCOL</span>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(active.script || "");
                                alert("SCRIPT COPIED TO CLIPBOARD");
                            }}
                            className="group/btn self-start sm:self-auto flex items-center gap-3 px-6 py-2 bg-white/[0.03] border border-white/10 hover:border-primary/50 transition-all"
                        >
                            <span className="text-[10px] font-black text-white/40 group-hover/btn:text-primary uppercase tracking-widest">EXTRACT DATA</span>
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
                            <div className="p-6 md:p-8 font-mono text-[13px] md:text-[15px] text-white/80 leading-relaxed whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto custom-scrollbar">
                                {(active.script || "AWAITING MISSION SCRIPT...").split('\n').map((line, i) => (
                                    <div key={i} className="flex gap-4 sm:gap-6 group/line hover:bg-white/[0.02] transition-colors -mx-4 px-4">
                                        <span className="text-primary font-black opacity-40 select-none">$</span>
                                        <span className="flex-1">{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. LIVE EVIDENCE */}
                <div className="space-y-8">
                    <div className="text-[13px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.4em] border-l-2 border-primary pl-4 whitespace-nowrap">LIVE EVIDENCE LOGS</div>
                    <div className="bg-[#080808] border border-white/5 p-4 relative group overflow-hidden max-h-[400px] flex items-center justify-center shadow-inner">
                        {active.logsImage ? (
                            <img src={active.logsImage} alt="Evidence" className="max-h-[360px] w-auto grayscale group-hover:grayscale-0 transition-all duration-1000 object-contain" />
                        ) : (
                            <div className="py-20 text-white/5 flex flex-col items-center gap-6">
                                <ShieldAlert className="w-20 h-20" />
                                <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest whitespace-nowrap">NO EVIDENCE ATTACHED</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                </div>

                {/* 4. MISSION TAKEAWAYS */}
                <div className="space-y-8">
                    <div className="text-[13px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.4em] border-l-2 border-primary pl-4 whitespace-nowrap">MISSION TAKEAWAYS</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(active.keyTakeaways || []).map((card, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-6 md:p-10 space-y-6 group hover:border-primary/40 transition-all relative overflow-hidden">
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mb-12 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                                <h4 className="text-[11px] lg:text-[12px] font-black text-primary uppercase tracking-[0.2em] lg:tracking-[0.4em] break-words">{card.title.replace(/_/g, ' ')}</h4>
                                <p className="text-[14px] md:text-[15px] text-white/40 font-light leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: card.content }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. ATTACK PLANS */}
                <div className="space-y-8">
                    <div className="text-[13px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] lg:tracking-[0.4em] border-l-2 border-primary pl-4 whitespace-nowrap">ATTACK PLANS</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(active.attackPaths || []).map((path, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-6 md:p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-start justify-between mb-6 gap-4">
                                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
                                    <span className="bg-primary/10 border border-primary/20 text-[9px] font-black text-primary px-3 py-1 uppercase tracking-widest whitespace-nowrap truncate max-w-[150px]">
                                        {path.risk.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-wider mb-4 break-words">{path.title.replace(/_/g, ' ')}</h4>
                                <p className="text-[13px] md:text-[14px] text-white/40 font-light leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: path.desc }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
