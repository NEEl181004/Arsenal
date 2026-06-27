import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { notFound, redirect } from "next/navigation";
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

/* Section heading component matching reference design */
function SectionHeading({
    white,
    red,
    id,
}: {
    white: string;
    red: string;
    id?: string;
}) {
    return (
        <div className="mb-6" id={id}>
            <h2
                className="text-[15px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
                <span className="text-white/90">{white}</span>
                <span style={{ color: "#FF003C" }}>{red}</span>
            </h2>
        </div>
    );
}

export default async function ToolPage({ params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();

    let tool;
    try {
        const { id } = await params;
        const rawTool = await Tool.findById(id).lean();
        if (rawTool) tool = JSON.parse(JSON.stringify(rawTool));
    } catch {
        return notFound();
    }

    if (!tool) return notFound();

    const session = await getServerSession(authOptions);
    if (!session) redirect("/#login");

    const isAdmin = session?.user?.role === "admin";

    const systemSupportList = tool.system_support || [];
    const minSpecs = tool.minimum_spec || [];
    const optSpecs = tool.optimized_spec || [];

    return (
        <div className="w-full pb-24 relative">
            <ToolBackgroundAnimation />

            {/* Padded inner container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* ── 00. Hero / Overview ── */}
                <div id="overview" className="scroll-mt-24">
                    <EditableOverview tool={tool} isAdmin={isAdmin} toolId={tool._id.toString()} />
                </div>

                {/* ── 02. Core Module ── */}
                <section className="scroll-mt-24 mb-10" id="core">
                    <SectionHeading white="CORE" red="MODULE" />
                    <CoreModuleViewer
                        modules={JSON.parse(JSON.stringify(tool.core_modules || []))}
                        isAdmin={isAdmin}
                        toolId={tool._id.toString()}
                    />
                </section>

                {/* ── 03. Environment & Installation ── */}
                <section className="scroll-mt-24 mb-10" id="installation">
                    <SectionHeading white="ENVIRONMENT &" red="INSTALLATION" />
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

                {/* ── 04. Test Scenarios ── */}
                <section className="scroll-mt-24 mb-10" id="scenarios">
                    <ScenarioSelector
                        scenarios={JSON.parse(JSON.stringify(tool.scenarios || []))}
                        isAdmin={isAdmin}
                        toolId={tool._id.toString()}
                    />
                </section>

                {/* ── 05. System Diagnostics ── */}
                <section className="scroll-mt-24 mb-16" id="diagnostics">
                    <DiagnosisAccordion
                        items={JSON.parse(JSON.stringify(tool.troubleshooting || []))}
                        isAdmin={isAdmin}
                        toolId={tool._id.toString()}
                    />
                </section>

                {/* ── 06. References ── */}
                <section className="scroll-mt-24 mb-16" id="references">
                    <EditableReferences
                        references={JSON.parse(JSON.stringify(tool.references_list || []))}
                        isAdmin={isAdmin}
                        toolId={tool._id.toString()}
                    />
                </section>
            </div>
        </div>
    );
}
