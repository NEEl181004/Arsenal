import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { ShieldCheck, Activity, Terminal, Database, ArrowRight, Shield } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const revalidate = 0;

export default async function DashboardPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string, search?: string }> 
}) {
    await connectToDatabase();
    const { category, search } = await searchParams;
    
    let query: any = {};
    if (category) {
        query.category = { $regex: new RegExp(category, "i") };
    }
    if (search) {
        const safeSearch = search.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
        query.$or = [
            { name: { $regex: new RegExp("\\b" + safeSearch, "i") } },
            { category: { $regex: new RegExp("\\b" + safeSearch, "i") } },
            { bestFor: { $regex: new RegExp("\\b" + safeSearch, "i") } }
        ];
    }
    
    const tools = await Tool.find(query).sort({ createdAt: -1 });
    
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="max-w-7xl mx-auto px-4 pb-32">
            <header className="mb-12 pb-8 border-b border-white/[0.03]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="classified-label text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Tools Overview
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                            Arsenal
                        </h1>
                        <p className="text-white/40 font-medium text-[11px] uppercase tracking-widest">
                            {category ? `Filter: ${category}` : "Offensive Security Index"}
                        </p>
                    </div>
                    
                    {isAdmin && (
                        <Link href="/admin/tools/create" className="px-6 py-4 bg-primary text-white font-bold text-xs tracking-widest hover:bg-primary-hover transition-all uppercase flex items-center gap-3 group">
                            <Terminal className="w-5 h-5" /> Add Tool <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </header>

            {/* Redesigned Card Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.length === 0 ? (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10">
                        <span className="text-xs font-medium text-white/20 uppercase tracking-widest">No tools found matching your search.</span>
                    </div>
                ) : (
                    tools.map((tool) => (
                        <Link href={`/tools/${tool._id}`} key={tool._id.toString()} className="group block h-full">
                            <div className="bg-[#0b0b0d] border border-white/[0.05] p-8 h-full flex flex-col hover:border-primary/40 hover:shadow-[0_0_50px_rgba(255,0,60,0.12)] transition-all duration-500 relative overflow-hidden rounded-md group/card">
                                {/* Tech scanner light sweep */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.04] to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                                
                                {/* Top and bottom accent bars */}
                                <div className="absolute top-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
                                <div className="absolute bottom-0 right-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />

                                {/* High-tech HUD classifications */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em]">
                                            // SEC_REQ::{tool.tier.toUpperCase()}_TIER
                                        </span>
                                        <span className="text-[10px] text-white/40 font-mono tracking-tighter">
                                            ADDR: 0x{tool._id.toString().slice(-6).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="px-2.5 py-1 bg-white/[0.03] border border-white/10 text-[9px] font-mono text-white/50 group-hover:text-primary group-hover:border-primary/30 transition-colors uppercase tracking-wider">
                                        {tool.category}
                                    </span>
                                </div>

                                {/* Main Tool Info */}
                                <div className="flex-1 mb-8">
                                    <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                                        {tool.name}
                                    </h3>
                                    <p className="mt-3 text-xs text-white/40 leading-relaxed font-light line-clamp-3">
                                        {tool.bestFor || "Advanced tool engineered for red teaming and penetration testing operations."}
                                    </p>
                                </div>

                                {/* Tech specs indicators */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.05]">
                                    <div className="space-y-1">
                                        <span className="block text-[8px] text-white/30 uppercase tracking-widest font-mono">INTEL_STATUS</span>
                                        <span className="block text-[10px] text-white/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            DEPLOYED
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <span className="block text-[8px] text-white/30 uppercase tracking-widest font-mono">ACCESS_GATE</span>
                                        <span className="block text-[10px] text-primary font-black uppercase tracking-widest">
                                            DECRYPTED
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Bottom right arrow icon overlay */}
                                <div className="absolute bottom-4 right-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
