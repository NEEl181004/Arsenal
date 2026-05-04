"use client";

import { useState } from "react";
import { ChevronDown, AlertCircle, ShieldCheck, Zap, Copy } from "lucide-react";

interface TroubleshootingItem {
    problem: string;
    cause: string;
    resolution: string;
    command?: string;
}

export default function DiagnosisAccordion({ items }: { items: TroubleshootingItem[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className={`bg-white/[0.01] border border-white/5 overflow-hidden transition-all duration-500 ${openIndex === i ? "bg-white/[0.02] border-primary/20" : "hover:bg-white/[0.02]"}`}>
                    <button 
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 md:p-8 group text-left"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                            <div className="text-sm font-black text-white/20 uppercase tracking-widest group-hover:text-primary transition-colors">
                                {String.fromCharCode(75 + i)}-{400 + i * 12}:
                            </div>
                            <h3 className={`text-lg md:text-xl font-black text-white uppercase tracking-widest transition-all ${openIndex === i ? "text-primary" : "group-hover:text-white"}`} dangerouslySetInnerHTML={{ __html: item.problem }} />
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${openIndex === i ? "rotate-180 text-primary" : "text-white/10"}`} />
                    </button>
                    
                    <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                        <div className="p-6 md:p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <p className="text-white/40 text-lg font-light leading-relaxed max-w-4xl">
                                Detailed diagnostic analysis identifies an anomaly within the execution environment. Automated mitigation protocol is recommended for node synchronization.
                            </p>
                            
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary"></div>
                                        ROOT CAUSE
                                    </div>
                                    <div className="bg-[#0e0e0e] border border-white/5 p-6 md:p-10 min-h-[140px] flex items-center text-base text-white/60 font-light leading-relaxed" dangerouslySetInnerHTML={{ __html: item.cause }} />
                                </div>
                                <div className="space-y-6">
                                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary"></div>
                                        SOLUTION PROTOCOL
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-[#0e0e0e] border border-white/5 p-6 md:p-10 flex items-center text-sm text-white/80 leading-relaxed">
                                            <span dangerouslySetInnerHTML={{ __html: item.resolution }} />
                                        </div>
                                         {item.command && (
                                              <div className="relative group/cmd">
                                                <div className="bg-black/80 border border-primary/20 p-6 flex items-start text-[14px] text-primary font-mono leading-relaxed transition-all hover:bg-black">
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
            ))}
        </div>
    );
}
