import Link from "next/link";
import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { ShieldCheck, Activity, Terminal, Database, ArrowRight, Shield } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const revalidate = 0;

export default async function Home({ 
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.length === 0 ? (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10">
                        <span className="text-xs font-medium text-white/20 uppercase tracking-widest">No tools found matching your search.</span>
                    </div>
                ) : (
                    tools.map((tool) => (
                        <Link href={`/tools/${tool._id}`} key={tool._id.toString()} className="group block h-full">
                            <div className="bg-gradient-to-br from-white/[0.01] to-white/[0.03] border border-white/[0.04] p-10 h-full flex flex-col hover:bg-white/[0.03] hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,0,60,0.05)] transition-all duration-500 relative overflow-hidden">
                                {/* Laser Scanning Sweep */}
                                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_3s_infinite] pointer-events-none"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                                {/* Tech Corner Brackets */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/10 group-hover:border-primary/50 transition-colors duration-500"></div>
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/10 group-hover:border-primary/50 transition-colors duration-500"></div>
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/10 group-hover:border-primary/50 transition-colors duration-500"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/10 group-hover:border-primary/50 transition-colors duration-500"></div>
                                
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="w-12 h-12 bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(255,0,60,0.15)] transition-all duration-500">
                                        <Shield className="w-5 h-5 text-white/20 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{tool.tier} Tier</span>
                                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-tight">ID: {tool._id.toString().slice(-4)}</span>
                                    </div>
                                </div>
                                
                                <div className="mb-8 flex-1 relative z-10">
                                    <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
                                        {tool.name}
                                    </h2>
                                    <span className="text-xs font-semibold text-white/40 uppercase tracking-widest mt-1 block">
                                        {tool.category}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 pt-6 border-t border-white/[0.03] relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Clearance</span>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Unrestricted</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#ff003c]"></span>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 z-10">
                                    <ArrowRight className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
