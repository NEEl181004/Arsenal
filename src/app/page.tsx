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
        query.$or = [
            { name: { $regex: new RegExp(search, "i") } },
            { category: { $regex: new RegExp(search, "i") } },
            { bestFor: { $regex: new RegExp(search, "i") } }
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
                        <Link href={`/tools/${tool._id}`} key={tool._id.toString()} className="group">
                            <div className="bg-white/[0.02] border border-white/[0.05] p-10 h-full flex flex-col hover:bg-white/[0.04] hover:border-primary/20 transition-all relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-12 h-12 bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-colors">
                                        <Shield className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{tool.tier} Tier</span>
                                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-tight">ID: {tool._id.toString().slice(-4)}</span>
                                    </div>
                                </div>
                                
                                <div className="mb-8 flex-1">
                                    <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                                        {tool.name}
                                    </h2>
                                    <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
                                        {tool.category}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 pt-6 border-t border-white/[0.03]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Clearance</span>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Unrestricted</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1 h-1 bg-primary rounded-full security-pulse"></span>
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
            
            <div className="mt-20 pt-8 border-t border-white/[0.03] flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-white/10"></span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">End of Index</span>
                    <span className="w-8 h-[1px] bg-white/10"></span>
                </div>
            </div>
        </div>
    );
}
