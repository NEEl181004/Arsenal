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
import ScenarioSelector from "./ScenarioSelector";
import InstallationViewer from "./InstallationViewer";
import DiagnosisAccordion from "./DiagnosisAccordion";
import CoreModuleViewer from "./CoreModuleViewer";
import EditableOverview from "./EditableOverview";
import EditableReferences from "./EditableReferences";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
            {/* Header / Hero Section & 01. Overview */}
            <EditableOverview tool={tool} isAdmin={isAdmin} toolId={tool._id.toString()} />

            {/* 02. Core Module */}
            <section id="core" className="scroll-mt-24 mb-16">
                <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-4">
                    <span>Core </span><span className="text-primary">Module</span>
                    <span className="h-[1px] flex-1 bg-white/5"></span>
                </h2>
                
                <CoreModuleViewer 
                    modules={JSON.parse(JSON.stringify(tool.core_modules || []))} 
                    isAdmin={isAdmin}
                    toolId={tool._id.toString()}
                />
            </section>

            {/* 03. Environment & Installation */}
            <section id="environment" className="scroll-mt-24 mb-16">
                <h2 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-4">
                    <span>Environment &</span> 
                    <span className="text-primary">Installation</span>
                    <span className="h-[1px] flex-1 bg-white/5"></span>
                </h2>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-6">
                        <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">System Support</div>
                        <div className="space-y-6">
                            {[
                                { os: "Debian/Ubuntu", icon: Terminal, sub: "Kernel 5.x+ Required" },
                                { os: "Windows 11", icon: Monitor, sub: "WSL2 Subsystem Refined" },
                                { os: "macOS Silicon", icon: Globe, sub: "ARM64 Native Architecture" }
                            ].map((o, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <o.icon className="w-8 h-8 text-primary transition-transform group-hover:scale-105 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">{o.os}</div>
                                        <div className="text-[10px] text-white/40 mt-0.5 uppercase font-bold tracking-widest">{o.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-6">
                        <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">Minimum Spec</div>
                        <div className="space-y-3">
                            {[
                                { k: "CPU", v: "8 CORES" },
                                { k: "RAM", v: "16 GB DDR5" },
                                { k: "STORAGE", v: "5 GB SSD" },
                                { k: "GPU", v: "SUPPORTED" }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all">
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-1 h-1 bg-primary/40 group-hover:bg-primary transition-colors"></div>
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                    </div>
                                    <span className="text-xs font-bold text-white uppercase tracking-wider text-right">{s.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-primary/10 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full blur-3xl"></div>
                        <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-primary pl-3 mb-4 whitespace-nowrap">Optimized Spec</div>
                        <div className="space-y-3">
                            {[
                                { k: "CPU", v: "32 CORES (5.0GHz+)" },
                                { k: "RAM", v: "64 GB DDR5" },
                                { k: "STORAGE", v: "25 GB NVMe Gen5" },
                                { k: "NETWORK", v: "10Gbps+ SYMMETRIC" }
                            ].map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/[0.01] border border-white/[0.03] group hover:bg-white/[0.03] transition-all gap-3">
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-1 h-1 bg-primary shadow-[0_0_8px_rgba(255,0,60,0.6)]"></div>
                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{s.k}</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider text-right">{s.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <InstallationViewer 
                        data={JSON.parse(JSON.stringify(tool.installation_sequence || []))} 
                        isAdmin={isAdmin}
                        toolId={tool._id.toString()}
                    />
                </div>
            </section>

            {/* 04. Execution */}
            <section id="scenarios" className="scroll-mt-24 mb-16">
                <ScenarioSelector 
                    scenarios={JSON.parse(JSON.stringify(tool.scenarios || []))} 
                    isAdmin={isAdmin} 
                    toolId={tool._id.toString()} 
                />
            </section>

            {/* 05. Diagnostics */}
            <section id="diagnostics" className="scroll-mt-24 mb-16">
                <div className="relative h-[200px] overflow-hidden mb-8 group">
                    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-10 grayscale group-hover:scale-105 transition-transform duration-[2000ms]" alt="Diagnostic" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-10">
                        <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider mb-2 flex flex-wrap justify-center gap-2">
                            <span>System</span> <span className="text-primary">Diagnostics</span>
                        </h2>
                    </div>
                </div>
                
                <DiagnosisAccordion 
                    items={JSON.parse(JSON.stringify(tool.troubleshooting || []))} 
                    isAdmin={isAdmin}
                    toolId={tool._id.toString()}
                />
            </section>

            {/* 06. Records / References */}
            <EditableReferences 
                references={JSON.parse(JSON.stringify(tool.references_list || []))}
                isAdmin={isAdmin}
                toolId={tool._id.toString()}
            />
        </div>
    );
}
