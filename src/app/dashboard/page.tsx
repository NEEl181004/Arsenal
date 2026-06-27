import Link from "next/link";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Database, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Laptop,
  Terminal as TerminalIcon,
  Shield,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import DashboardMeshAnimation from "./DashboardMeshAnimation";
import ToolCard from "@/components/ToolCard";

export const revalidate = 0;

export default async function DashboardPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ category?: string, search?: string, platform?: string, maturity?: string }> 
}) {
    await connectToDatabase();
    const { category, search, platform, maturity } = await searchParams;
    
    let query: any = {};
    if (category && category !== "All Categories") {
        query.category = { $regex: new RegExp(category, "i") };
    }
    if (maturity && maturity !== "All Maturity") {
        query.tier = { $regex: new RegExp(maturity, "i") };
    }
    if (search) {
        const safeSearch = search.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
        query.$or = [
            { name: { $regex: new RegExp("\\b" + safeSearch, "i") } },
            { category: { $regex: new RegExp("\\b" + safeSearch, "i") } },
            { bestFor: { $regex: new RegExp("\\b" + safeSearch, "i") } }
        ];
    }
    
    const toolsRaw = await Tool.find(query).sort({ createdAt: -1 }).lean();
    const tools = JSON.parse(JSON.stringify(toolsRaw));
    const session = await getServerSession(authOptions);

    // Auth guard — redirect unauthenticated users to landing page login modal
    if (!session) {
        redirect("/#login");
    }

    const isAdmin = session?.user?.role === "admin";

    // Static Categories for filters
    const categoriesList = ["All Categories", "Reconnaissance", "Exploitation", "Privilege Escalation", "Post-Exploitation", "Implant", "Defense Evasion", "Utility"];
    const platformsList = ["All Platforms", "Windows", "Linux", "macOS"];
    const maturityList = ["All Maturity", "Beginner", "Intermediate", "Advanced"];

    return (
        <div className="max-w-7xl mx-auto px-4 pb-32 space-y-12">
            
            <div className="relative border-b border-white/[0.04] pb-10 mb-6 overflow-hidden min-h-[320px] flex flex-col justify-center">
                {/* Right-side Static Image Background */}
                <div 
                    className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 pointer-events-none opacity-80" 
                    style={{ maskImage: "linear-gradient(to right, transparent, black 30%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 30%)" }}
                >
                    <img 
                        src="/images/mesh-bg.png" 
                        alt="Mesh Background" 
                        className="absolute inset-0 w-full h-full object-cover object-left opacity-90"
                    />
                </div>

                <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                    {/* Titles */}
                    <div className="lg:col-span-8 space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-3 h-3" /> BACK TO INDEX
                        </Link>
                        <div className="space-y-3">
                            <span className="text-[11px] font-bold text-[#FF003C] tracking-widest uppercase block">
                                DOCUMENTATION HUB
                            </span>
                            <h1 className="text-4xl sm:text-5xl md:text-[52px] font-bold tracking-tight text-white leading-tight">
                                Red Team Tools & Tradecraft
                            </h1>
                            <p className="max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed mt-4">
                                Comprehensive documentation for red teaming tools, techniques, and tradecraft. Built by operators, for operators.
                            </p>
                        </div>

                        {/* Central Search Bar */}
                        <div className="pt-6 max-w-xl">
                            <form method="GET" action="/dashboard" className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <input 
                                        name="search"
                                        type="text" 
                                        defaultValue={search || ""}
                                        placeholder="Search tools, techniques, or documentation..."
                                        className="w-full bg-[#050608] border border-zinc-800 focus:border-red-500/40 rounded-lg py-3.5 px-11 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                                    />
                                    <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                                <button type="submit" className="bg-[#FF003C] hover:bg-red-600 text-white p-3.5 rounded-lg transition-colors cursor-pointer shrink-0">
                                    <Search className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tools Grid Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {tools.length === 0 ? (
                    <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-sm">
                        <span className="text-xs font-bold text-white/25 uppercase tracking-widest">No tools found matching query.</span>
                    </div>
                ) : (
                    tools.map((tool: any) => (
                        <ToolCard key={tool._id.toString()} tool={tool} />
                    ))
                )}
            </div>


        </div>
    );
}
