import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
    Pencil, 
    ArrowLeft, 
    Zap, 
    ShieldAlert, 
    Cpu, 
    HardDrive, 
    Network, 
    Monitor,
    ExternalLink,
    ArrowUpRight,
    Search,
    ChevronRight,
    Terminal,
    Target,
    Code2,
    Bug,
    Shield,
    Globe
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import DeleteToolButton from "./DeleteToolButton";
import ScenarioSelector from "./ScenarioSelector";
import InstallationViewer from "./InstallationViewer";
import DiagnosisAccordion from "./DiagnosisAccordion";
import CoreModuleViewer from "./CoreModuleViewer";
import AdminMobileLock from "./AdminMobileLock";

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    
    let tool;
    try {
        const { id } = await params;
        tool = await Tool.findById(id);
    } catch (e) {
        return notFound();
    }

    if (!tool) return notFound();

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    return (
        <div className="w-full pb-20">
            {/* Header / Hero Section */}
            <header className="mb-8 sm:mb-12 pt-0">
                <div className="flex items-center justify-between mb-8 sm:mb-16">
                    <Link href="/" className="text-white/20 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Index
                    </Link>
                    {isAdmin && (
                        <div className="flex items-center gap-4">
                            {/* Desktop only edit button */}
                            <Link href={`/admin/tools/${tool._id}/edit`} className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/[0.03] px-6 py-2.5 hover:bg-primary transition-all border border-white/10 whitespace-nowrap">
                                <Pencil className="w-3.5 h-3.5" /> Edit
                            </Link>
                            {/* Mobile edit button with warning */}
                            <AdminMobileLock />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-tight -ml-0.5 md:-ml-1 break-words" dangerouslySetInnerHTML={{ __html: tool.name + "." }} />
                    <div className="flex flex-wrap items-center gap-4 sm:gap-12 pt-0">
                        <div className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 sm:gap-4">
                            <span className="text-primary">//</span>
                            <span dangerouslySetInnerHTML={{ __html: `Category: ${tool.category}` }} />
                            <span className="h-[1px] w-8 sm:w-12 bg-white/10"></span>
                            <span className="text-white/40">ID: {tool._id.toString().slice(-8)}</span>
                        </div>
                        <div className="flex gap-2 sm:gap-4">
                            <div className="bg-primary text-white text-[10px] font-bold px-4 sm:px-6 py-1.5 flex items-center gap-2 uppercase shadow-lg shadow-primary/20 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                Tier: {tool.tier}
                            </div>
                            <div className="bg-primary text-white text-[10px] font-bold px-4 sm:px-6 py-1.5 uppercase shadow-lg shadow-primary/20 whitespace-nowrap">
                                Best For: {tool.bestFor}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 01. Overview */}
            <section id="overview" className="scroll-mt-24 mb-16">
                <div className="mt-20 max-w-5xl">
                    <div className="prose prose-invert prose-p:text-white/50 prose-p:text-lg lg:prose-p:text-xl prose-p:font-light prose-strong:text-primary leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: tool.overview || "" }} 
                    />
                </div>
            </section>

            {/* 02. Core Module */}
            <section id="core" className="scroll-mt-24 mb-16">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-tight mb-8 sm:mb-12 flex items-center gap-6">
                    <span>Core </span><span className="text-primary">Module</span>
                    <span className="h-[1px] flex-1 bg-white/5"></span>
                </h2>
                
                <CoreModuleViewer modules={JSON.parse(JSON.stringify(tool.core_modules || []))} />
            </section>

            {/* 03. Environment & Installation */}
            <section id="environment" className="scroll-mt-24 mb-16">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white uppercase tracking-tight mb-8 sm:mb-12 flex flex-wrap items-center gap-x-4 sm:gap-x-6 leading-tight">
                    <span className="whitespace-nowrap">Environment &</span> 
                    <span className="text-primary whitespace-nowrap">Installation</span>
                    <span className="h-[1px] flex-1 bg-white/5 min-w-[20px] hidden sm:block"></span>
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-24">
                    <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 space-y-10">
                        <div className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-4 mb-8 whitespace-nowrap">System Support</div>
                        <div className="space-y-10">
                            {[
                                { os: "Debian/Ubuntu", icon: Terminal, sub: "Kernel 5.x+ Required" },
                                { os: "Windows 11", icon: Monitor, sub: "WSL2 Subsystem Refined" },
                                { os: "macOS Silicon", icon: Globe, sub: "ARM64 Native Architecture" }
                            ].map((o, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <o.icon className="w-10 h-10 text-primary transition-transform group-hover:scale-110 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-xl font-bold text-white uppercase tracking-wider">{o.os}</div>
                                        <div className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-widest">{o.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 space-y-12">
                        <div className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-4 mb-10 whitespace-nowrap">Minimum Spec</div>
                        <div className="space-y-4">
                            {[
                                { k: "CPU", v: "8 CORES" },
                                { k: "RAM", v: "16 GB DDR5" },
                                { k: "STORAGE", v: "5 GB SSD" },
                                { k: "GPU", v: "SUPPORTED" }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-1 h-1 bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                    </div>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider text-right">{s.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-primary/10 p-6 md:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
                        <div className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-4 mb-10 whitespace-nowrap">Optimized Spec</div>
                        <div className="space-y-4">
                            {[
                                { k: "CPU", v: "32 CORES (5.0GHz+)" },
                                { k: "RAM", v: "64 GB DDR5" },
                                { k: "STORAGE", v: "25 GB NVMe Gen5" },
                                { k: "NETWORK", v: "10Gbps+ SYMMETRIC" }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all gap-4">
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="w-1 h-1 bg-primary shadow-[0_0_8px_rgba(255,0,60,0.6)]"></div>
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary uppercase tracking-wider text-right">{s.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <InstallationViewer data={JSON.parse(JSON.stringify(tool.installation_sequence || []))} />
                </div>
            </section>

            {/* 04. Execution */}
            <section id="scenarios" className="scroll-mt-24 mb-16">
                {/* Header is handled inside ScenarioSelector to avoid duplication */}
                <ScenarioSelector scenarios={JSON.parse(JSON.stringify(tool.scenarios))} />
            </section>

            {/* 05. Diagnostics */}
            <section id="diagnostics" className="scroll-mt-24 mb-16">
                <div className="relative h-[300px] overflow-hidden mb-12 group">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-10 grayscale group-hover:scale-105 transition-transform duration-[2000ms]" alt="Diagnostic" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-10">
                        <h2 className="text-[clamp(1.5rem,5vw,5rem)] font-bold text-white uppercase tracking-tight leading-none mb-6 flex flex-wrap justify-center gap-4">
                            <span className="whitespace-nowrap">System</span> <span className="text-primary whitespace-nowrap">Diagnostics</span>
                        </h2>
                    </div>
                </div>
                <DiagnosisAccordion items={JSON.parse(JSON.stringify(tool.troubleshooting))} />
            </section>

            {/* 06. Records */}
            <section id="references" className="scroll-mt-24 pb-20">
                <div className="flex flex-wrap items-end justify-between gap-12 mb-12">
                    <h2 className="text-xl sm:text-4xl font-bold text-white uppercase tracking-tight mb-0 flex items-center gap-6">
                        <span>References</span>
                    </h2>
                    <div className="relative w-full md:w-[500px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input type="text" className="bg-white/[0.03] border border-white/10 pl-16 pr-8 py-5 text-xs font-bold uppercase tracking-widest text-white w-full focus:outline-none focus:border-primary/50 transition-all" placeholder="Search references..." />
                    </div>
                </div>
                
                <div className="space-y-4">
                    {/* Header - Desktop Only */}
                    <div className="hidden md:grid grid-cols-12 gap-8 px-10 py-8 border-b border-white/10 text-xs font-bold text-white uppercase tracking-widest items-center">
                        <div className="col-span-1 text-white/20 whitespace-nowrap">ID</div>
                        <div className="col-span-6 whitespace-nowrap">Resource Name</div>
                        <div className="col-span-2 whitespace-nowrap">Category</div>
                        <div className="col-span-3 text-right whitespace-nowrap">Modified</div>
                    </div>

                    {/* Content Rows */}
                    {tool.references_list?.map((ref: any, i: number) => (
                        <div key={i} className="group bg-white/[0.01] md:bg-transparent border border-white/5 md:border-0 md:border-b md:border-white/[0.03] p-6 md:p-0 hover:bg-white/[0.02] transition-all">
                            <Link href={ref.url} target="_blank" className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 md:px-10 md:py-6 items-center cursor-pointer">
                                {/* Mobile Header Info */}
                                <div className="flex items-center justify-between md:col-span-1">
                                    <span className="text-[11px] font-bold text-white/10 uppercase tracking-widest">{i < 9 ? `0${i+1}` : i+1}</span>
                                    <span className="md:hidden px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest">{ref.type || "Docs"}</span>
                                </div>

                                {/* Resource Name */}
                                <div className="md:col-span-6">
                                    <div className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors break-words flex items-center gap-4">
                                        {ref.name}
                                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                    </div>
                                    <div className="text-[10px] font-medium text-white/10 uppercase tracking-widest mt-1">Resource Archive // v1.0.4</div>
                                </div>

                                {/* Desktop Category */}
                                <div className="hidden md:block md:col-span-2">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest">{ref.type || "Docs"}</span>
                                </div>

                                {/* Desktop Modified Date */}
                                <div className="hidden md:block md:col-span-3 text-[11px] font-bold text-white/20 uppercase tracking-widest text-right">
                                    {ref.updatedAt || "2024.03.12"}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
