"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function CoreModuleViewer({ modules }: { modules: any[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = modules[activeIndex] || modules[0];

    if (!modules || modules.length === 0) {
        return (
            <div className="p-20 border border-dashed border-white/5 text-center text-white/10 font-black text-[11px] tracking-[0.5em] uppercase">
                AWAITING CORE MODULES...
            </div>
        );
    }

    return (
        <div className="space-y-1">
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
                            <span className={`text-[10px] lg:text-[11px] font-black tracking-[0.1em] lg:tracking-[0.2em] text-center ${isActive ? "text-primary" : "text-white/60 group-hover:text-white"} break-words w-full`}>{m.name.toUpperCase()}</span>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-12 md:p-16 xl:p-20 grid grid-cols-1 xl:grid-cols-5 gap-12 xl:gap-20 relative overflow-hidden animate-in fade-in duration-700">
                <div className="xl:col-span-3 space-y-6 sm:space-y-10">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-black text-primary uppercase tracking-tighter break-words" dangerouslySetInnerHTML={{ __html: active.title.toUpperCase() }} />
                    <p className="text-white/40 text-lg lg:text-xl leading-relaxed font-light break-words" dangerouslySetInnerHTML={{ __html: active.description }} />
                </div>
                
                {/* Telemetry Section - Adjusted for Tablet */}
                <div className="xl:col-span-2 border-t xl:border-t-0 xl:border-l border-primary/20 pt-10 xl:pt-6 xl:pl-16">
                    <div className="text-[14px] lg:text-[16px] font-black text-white uppercase tracking-[0.2em] xl:tracking-[0.4em] border-l-2 border-primary pl-4 mb-8 sm:mb-12 whitespace-nowrap">LIVE TELEMETRY</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-x-12 gap-y-6 sm:gap-y-8">
                        {active.telemetry?.map((row: any, i: number) => (
                            <div key={i} className="space-y-2 pb-4 sm:pb-6 border-b border-white/5 last:border-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(255,0,60,0.8)] shrink-0"></div>
                                        <span className="text-[10px] lg:text-[11px] font-black text-white uppercase tracking-wider whitespace-nowrap overflow-hidden" dangerouslySetInnerHTML={{ __html: row.key.toUpperCase() }} />
                                    </div>
                                    <span className="text-[10px] lg:text-[11px] font-black text-primary uppercase tracking-wider whitespace-nowrap text-right" dangerouslySetInnerHTML={{ __html: row.value.toUpperCase() }} />
                                </div>
                                {row.description && (
                                    <div className="text-[10px] text-white/30 font-light leading-relaxed pl-5 italic break-words">
                                        {row.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
