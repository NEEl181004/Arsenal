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
        <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-1000">
            {/* Environment Selection Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 sm:pb-8 gap-6">
                {/* Mobile Dropdown View (Phone only) */}
                <div className="md:hidden relative w-full group">
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3 ml-1">SELECT ENVIRONMENT</div>
                    <select 
                        value={activeTab}
                        onChange={(e) => setActiveTab(Number(e.target.value))}
                        className="w-full bg-white/[0.03] border border-white/10 p-4 pr-12 appearance-none text-[12px] font-black text-white uppercase tracking-[0.2em] focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        {data.map((tab, i) => (
                            <option key={i} value={i} className="bg-[#0a0a0a] text-white">
                                {tab.tabName.toUpperCase()}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 bottom-4 pointer-events-none text-primary">
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>

                {/* Tablet & Desktop Tabs View (768px+) */}
                <div className="hidden md:flex flex-wrap gap-4">
                    {data.map((tab, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveTab(i)}
                            className={`px-8 py-3 text-[12px] font-black uppercase tracking-[0.3em] transition-all border ${
                                i === activeTab 
                                ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,0,60,0.3)]" 
                                : "text-white/20 border-white/5 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab.tabName.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                    <div className="text-[10px] sm:text-[12px] font-black text-white/10 uppercase tracking-[0.2em] sm:tracking-[0.4em] whitespace-nowrap">
                        MODULE: DEPLOY SEQUENCE 0{activeTab + 1}
                    </div>
                    <div className="h-1 w-12 bg-primary/20 self-start md:self-end"></div>
                </div>
            </div>

            {/* Steps List */}
            <div className="space-y-6">
                {currentTab.steps.map((step, i) => (
                    <div key={i} className="bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all group overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5 relative">
                                <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                                <div className="text-[14px] sm:text-[16px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] border-l-2 border-primary pl-4 mb-6 break-words">
                                    STEP {step.id || `0${i+1}`}: {step.name.toUpperCase()}
                                </div>
                                <p className="text-[14px] sm:text-[15px] text-white/50 font-light leading-relaxed pr-4 break-words">
                                    {step.desc}
                                </p>
                            </div>
                            <div className="flex-1 p-6 md:p-10 bg-black/40 flex items-center justify-between group/cmd relative">
                                <div className="flex items-start gap-4 sm:gap-6 font-mono text-[13px] sm:text-[17px] scroll-smooth">
                                    <span className="text-primary font-black animate-pulse shrink-0">$</span>
                                    <span className="text-white tracking-wide break-words whitespace-normal leading-relaxed">{step.cmd}</span>
                                </div>
                                <button 
                                    onClick={() => copyToClipboard(step.cmd, i)}
                                    className="p-3 bg-white/[0.03] border border-white/5 text-white/20 hover:text-primary hover:border-primary/30 transition-all shrink-0 ml-4 sm:ml-8"
                                >
                                    {copiedIndex === i ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
