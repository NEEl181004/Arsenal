"use client";

import { useState } from "react";
import { Terminal, Copy, CheckCircle2, ChevronDown } from "lucide-react";
import { IInstallationTab } from "@/models/Tool";

export default function InstallationViewer({ data }: { data: IInstallationTab[] }) {
    const [activeTab, setActiveTab] = useState(0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const currentTab = data[activeTab] || data[0];

    if (!data || data.length === 0) {
        return (
            <div className="p-20 border border-dashed border-white/5 text-center text-white/10 font-black text-[11px] tracking-[0.5em] uppercase">
                AWAITING DEPLOYMENT PROTOCOLS...
            </div>
        );
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-1000">
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
            <div className="space-y-4">
                {currentTab.steps.map((step, i) => (
                    <div key={i} className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all group overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-white/5 relative">
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider border-l border-primary pl-3 mb-3 break-words">
                                    STEP {step.id || `0${i+1}`}: {step.name.toUpperCase()}
                                </div>
                                <p className="text-xs text-white/40 font-normal leading-relaxed pr-4 break-words">
                                    {step.desc}
                                </p>
                            </div>
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
