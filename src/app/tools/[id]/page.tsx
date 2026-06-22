import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { notFound } from "next/navigation";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
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

import EditableSpecs from "./EditableSpecs";
import ToolBackgroundAnimation from "./ToolBackgroundAnimation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || Terminal;
    return Icon;
};

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

    // Fallbacks if not populated
    const systemSupportList = tool.system_support || [];
    const minSpecs = tool.minimum_spec || [];
    const optSpecs = tool.optimized_spec || [];

    return (
        <div className="w-full pb-20 relative">
            <ToolBackgroundAnimation />
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
                
                <EditableSpecs 
                    systemSupport={JSON.parse(JSON.stringify(systemSupportList))} 
                    minimumSpec={JSON.parse(JSON.stringify(minSpecs))} 
                    optimizedSpec={JSON.parse(JSON.stringify(optSpecs))} 
                    isAdmin={isAdmin}
                    toolId={tool._id.toString()}
                />

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
