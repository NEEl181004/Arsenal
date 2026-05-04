"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Plus, Trash2, Save, Loader2,
    Target, Cpu, Shield, Globe, Terminal, 
    AlertTriangle, BookOpen, Activity, LayoutGrid 
} from "lucide-react";
import { 
    IInstallationTab, IScenario, ITroubleshooting, 
    IReference, IKeyTakeaway, IAttackPath 
} from "@/models/Tool";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextarea from "@/components/admin/RichTextarea";
import RichInput from "@/components/admin/RichInput";

export default function CreateToolPage() {
    const router = useRouter();
    
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Exploitation");
    const [developer, setDeveloper] = useState("");
    const [tier, setTier] = useState("Expert");
    const [bestFor, setBestFor] = useState("Red Teaming");
    const [overview, setOverview] = useState("");
    const [security, setSecurity] = useState("");

    const [coreModules, setCoreModules] = useState<any[]>([
        { name: "Scanning", icon: "Target", title: "Target Identification", description: "Probing network boundaries.", telemetry: [{ key: "Latency", value: "Low" }] }
    ]);
    const [installationSequence, setInstallationSequence] = useState<IInstallationTab[]>([
        { tabName: "Debian/Ubuntu", steps: [{ id: "01", name: "Env Sync", desc: "Update packages", cmd: "sudo apt update" }] }
    ]);
    const [scenarios, setScenarios] = useState<IScenario[]>([
        { 
            name: "Initial Access", objective: "Bypass perimeter", objectiveList: ["Bypass IDS"], 
            script: "import core\ncore.execute()", logsImage: "", 
            keyTakeaways: [
                { title: "PAYLOAD_SIGNATURE", content: "Generating high packet volume across edge clusters." },
                { title: "NETWORK_EXPOSURE", content: "Stealth protocol bypass active on target nodes." },
                { title: "DATA_INTEGRITY", content: "Hash verification required for incoming telemetry." }
            ], 
            attackPaths: [
                { title: "PRIVILEGE_ESCALATION", risk: "HIGH", desc: "Escalating from standard user to system-level root." },
                { title: "LATERAL_MOVEMENT", risk: "MEDIUM", desc: "Pivoting across internal financial subnets." },
                { title: "DATA_SIPHON", risk: "LOW", desc: "Establishing persistent reverse proxy tunnels." }
            ] 
        }
    ]);
    const [troubleshooting, setTroubleshooting] = useState<ITroubleshooting[]>([]);
    const [referencesList, setReferencesList] = useState<IReference[]>([]);

    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, category, developer, tier, bestFor, overview, security,
                    core_modules: coreModules,
                    installation_sequence: installationSequence,
                    scenarios, troubleshooting, references_list: referencesList
                }),
            });
            if (res.ok) router.push("/");
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // --- Helpers ---
    const addCoreModule = () => setCoreModules([...coreModules, { name: "New Module", icon: "Layers", title: "", description: "", telemetry: [] }]);
    const addTelemetry = (mi: number) => {
        const n = [...coreModules]; n[mi].telemetry.push({ key: "", value: "" }); setCoreModules(n);
    };

    const addInstallationTab = () => setInstallationSequence([...installationSequence, { tabName: "New OS", steps: [] }]);
    const addStepToTab = (ti: number) => {
        const n = [...installationSequence];
        const nextId = (n[ti].steps.length + 1).toString().padStart(2, '0');
        n[ti].steps.push({ id: nextId, name: "New Step", desc: "", cmd: "" });
        setInstallationSequence(n);
    };

    const addScenario = () => setScenarios([...scenarios, { 
        name: "New Mission", objective: "", objectiveList: [""], script: "", logsImage: "", 
        keyTakeaways: [
            { title: "PAYLOAD_SIGNATURE", content: "Generating high packet volume across edge clusters." },
            { title: "NETWORK_EXPOSURE", content: "Stealth protocol bypass active on target nodes." },
            { title: "DATA_INTEGRITY", content: "Hash verification required for incoming telemetry." }
        ], 
        attackPaths: [
            { title: "PRIVILEGE_ESCALATION", risk: "HIGH", desc: "Escalating from standard user to system-level root." },
            { title: "LATERAL_MOVEMENT", risk: "MEDIUM", desc: "Pivoting across internal financial subnets." },
            { title: "DATA_SIPHON", risk: "LOW", desc: "Establishing persistent reverse proxy tunnels." }
        ] 
    }]);

    const addKeyTakeaway = (si: number) => {
        const n = [...scenarios]; n[si].keyTakeaways.push({ title: "", content: "" }); setScenarios(n);
    };

    const addAttackPath = (si: number) => {
        const n = [...scenarios]; n[si].attackPaths.push({ title: "", risk: "HIGH", desc: "" }); setScenarios(n);
    };

    const addTrouble = () => setTroubleshooting([...troubleshooting, { problem: "", cause: "", resolution: "" }]);
    const addReference = () => setReferencesList([...referencesList, { name: "", type: "Docs", url: "", updatedAt: "2024.01.01" }]);

    return (
        <div className="max-w-none mx-auto pb-40 px-8 md:px-24">
            <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-8">
                <div className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black font-headline text-white italic tracking-tighter uppercase leading-none">
                        REGISTER_<span className="text-primary">NEW</span>_ASSET
                    </h1>
                    <div className="text-[11px] font-black text-primary uppercase tracking-[0.5em] italic">AWAITING_VAULT_AUTHORIZATION</div>
                </div>
                <button onClick={handleSave} disabled={loading} className="bg-primary text-white px-12 py-6 font-black text-[12px] tracking-[0.3em] flex items-center gap-4 hover:bg-primary-hover transition-all border border-primary/20 shadow-[0_0_50px_rgba(255,0,60,0.4)] uppercase italic group">
                    <Save className="w-5 h-5 group-hover:scale-125 transition-transform" /> {loading ? "INITIALIZING..." : "COMMENCE_VAULT_ENTRY"}
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-16">
                <nav className="w-full lg:w-80 space-y-3 shrink-0">
                    {[
                        { id: "overview", label: "OVERVIEW", icon: BookOpen },
                        { id: "core", label: "CORE MODULE", icon: Activity },
                        { id: "installation", label: "ENV & INSTALL", icon: LayoutGrid },
                        { id: "scenarios", label: "TEST SCENARIO", icon: Target },
                        { id: "troubleshooting", label: "DIAGNOSTICS", icon: AlertTriangle },
                        { id: "references", label: "REFERENCES", icon: Globe }
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full text-left px-8 py-5 text-[11px] font-black uppercase tracking-[0.3em] border-l-2 transition-all flex items-center gap-4 ${activeTab === t.id ? "bg-white/[0.03] border-primary text-white shadow-[inset_10px_0_20px_rgba(255,0,60,0.05)]" : "border-transparent text-white/20 hover:text-white hover:bg-white/[0.01]"}`}>
                            <t.icon className={`w-4 h-4 ${activeTab === t.id ? "text-primary" : "text-white/10"}`} />
                            {t.label}
                        </button>
                    ))}
                </nav>

                <div className="flex-1 space-y-24 bg-white/[0.01] border border-white/5 p-8 md:p-20 relative">
                    
                    {/* 01. Metadata & Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <RichInput label="ASSET_NAME" value={name} onChange={setName} />
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">CLASSIFICATION</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black border border-white/10 p-5 text-white font-black focus:border-primary outline-none appearance-none">
                                        <option value="Exploitation">EXPLOITATION</option>
                                        <option value="Discovery">DISCOVERY</option>
                                        <option value="Payloads">PAYLOADS</option>
                                        <option value="Recon">RECONNAISSANCE</option>
                                    </select>
                                </div>
                            </div>
                            <RichTextarea label="OVERVIEW_HTML" value={overview} onChange={setOverview} rows={8} />
                        </div>
                    )}

                    {/* 03. Core Modules */}
                    {activeTab === "core" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">TACTICAL_MODULES</h3>
                                <button onClick={addCoreModule} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-black tracking-widest italic uppercase">ADD_MODULE</button>
                            </div>
                            {coreModules.map((m, mi) => (
                                <div key={mi} className="bg-white/[0.02] border border-white/5 p-10 space-y-8 relative group">
                                    <button onClick={() => setCoreModules(coreModules.filter((_, i) => i !== mi))} className="absolute top-6 right-6 text-white/10 hover:text-primary"><Trash2 className="w-5 h-5" /></button>
                                    <div className="grid grid-cols-2 gap-8">
                                        <input value={m.name} onChange={e => { const n = [...coreModules]; n[mi].name = e.target.value; setCoreModules(n); }} className="w-full bg-black border border-white/10 p-4 text-primary font-black uppercase outline-none" placeholder="MODULE_LABEL" />
                                        <input value={m.icon} onChange={e => { const n = [...coreModules]; n[mi].icon = e.target.value; setCoreModules(n); }} className="w-full bg-black border border-white/10 p-4 text-white/40 font-mono outline-none text-xs" placeholder="LUCIDE_NAME OR <SVG>..." />
                                    </div>
                                    <RichInput placeholder="MODULE_TITLE" value={m.title} onChange={val => { const n = [...coreModules]; n[mi].title = val; setCoreModules(n); }} />
                                    <RichTextarea placeholder="Description..." value={m.description} onChange={val => { const n = [...coreModules]; n[mi].description = val; setCoreModules(n); }} rows={4} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 04. Deployment */}
                    {activeTab === "installation" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">DEPLOY_SEQUENCE</h3>
                                <button onClick={addInstallationTab} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-black tracking-widest italic uppercase">ADD_OS_TARGET</button>
                            </div>
                            {installationSequence.map((tab, ti) => (
                                <div key={ti} className="bg-white/[0.02] border border-white/5 p-12 space-y-10 relative">
                                    <button onClick={() => setInstallationSequence(installationSequence.filter((_, i) => i !== ti))} className="absolute top-6 right-6 text-white/10 hover:text-primary transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    <div className="grid grid-cols-2 gap-8 mt-4">
                                        <input value={tab.tabName} onChange={e => { const n = [...installationSequence]; n[ti].tabName = e.target.value; setInstallationSequence(n); }} className="bg-black border border-white/10 text-2xl font-black text-primary outline-none p-5 w-full uppercase" placeholder="OS_NAME" />
                                        <input value={tab.svgIcon || ""} onChange={e => { const n = [...installationSequence]; n[ti].svgIcon = e.target.value; setInstallationSequence(n); }} className="bg-black border border-white/10 text-xs font-mono text-white/40 outline-none p-5 w-full" placeholder="OPTIONAL_<SVG>_ICON..." />
                                    </div>
                                    <button onClick={() => addStepToTab(ti)} className="text-[10px] font-black text-white/20 hover:text-primary flex items-center gap-2">ADD_STEP</button>
                                    {tab.steps.map((step, si) => (
                                        <div key={si} className="bg-black/60 p-6 border border-white/5 space-y-4">
                                            <input value={step.name} onChange={e => { const n = [...installationSequence]; n[ti].steps[si].name = e.target.value; setInstallationSequence(n); }} className="w-full bg-black border border-white/10 p-3 text-xs font-black uppercase italic" placeholder="Step Name" />
                                            <input value={step.cmd} onChange={e => { const n = [...installationSequence]; n[ti].steps[si].cmd = e.target.value; setInstallationSequence(n); }} className="w-full bg-black border border-white/10 p-4 text-xs text-white font-mono" placeholder="Command" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 05. Scenarios */}
                    {activeTab === "scenarios" && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest">TEST_SCENARIO</h3>
                                <button onClick={addScenario} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-black tracking-widest uppercase">ADD_SCENARIO</button>
                            </div>
                            {scenarios.map((s, si) => (
                                <div key={si} className="bg-white/[0.02] border border-white/5 p-12 space-y-12 relative group">
                                    <button onClick={() => setScenarios(scenarios.filter((_, idx) => idx !== si))} className="absolute top-8 right-8 text-white/10 hover:text-primary"><Trash2 className="w-6 h-6" /></button>
                                    <input value={s.name} onChange={e => { const n = [...scenarios]; n[si].name = e.target.value; setScenarios(n); }} className="bg-transparent border-b border-white/10 text-3xl font-black text-primary outline-none pb-4 w-full uppercase" placeholder="SCENARIO_NAME" />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <RichInput placeholder="01. MISSION_OBJECTIVE" value={s.objective} onChange={val => { const n = [...scenarios]; n[si].objective = val; setScenarios(n); }} />
                                            <RichTextarea placeholder="02. HADES_OPS_EXECUTABLE" value={s.script} onChange={val => { const n = [...scenarios]; n[si].script = val; setScenarios(n); }} rows={10} className="text-primary font-mono text-xs" />
                                        </div>
                                        <div className="space-y-12">
                                            <ImageUpload label="03. EVIDENCE_LOG" value={s.logsImage} onChange={(val) => { const n = [...scenarios]; n[si].logsImage = val; setScenarios(n); }} />
                                            
                                            {/* Key Takeaways */}
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">KEY_TAKEAWAYS</label>
                                                    <button onClick={() => addKeyTakeaway(si)} className="text-[9px] text-white/20 hover:text-primary transition-colors flex items-center gap-1 uppercase italic font-black">
                                                        <Plus className="w-3 h-3"/> ADD_TAKEAWAY
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    {s.keyTakeaways?.map((take, ii) => (
                                                        <div key={ii} className="p-6 bg-black/40 border border-white/5 space-y-4 relative group">
                                                            <button onClick={() => { const n = [...scenarios]; n[si].keyTakeaways = n[si].keyTakeaways.filter((_:any, idx:any) => idx !== ii); setScenarios(n); }} className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <RichInput placeholder="TAKEAWAY_TITLE" value={take.title} onChange={val => { const n = [...scenarios]; n[si].keyTakeaways[ii].title = val; setScenarios(n); }} />
                                                            <RichTextarea placeholder="TAKEAWAY_DETAIL" value={take.content} onChange={val => { const n = [...scenarios]; n[si].keyTakeaways[ii].content = val; setScenarios(n); }} rows={3} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recommended Attack Plans */}
                                            <div className="space-y-6 pt-8 border-t border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">RECOMMENDED_ATTACK_PLANS</label>
                                                    <button onClick={() => addAttackPath(si)} className="text-[9px] text-white/20 hover:text-primary transition-colors flex items-center gap-1 uppercase italic font-black">
                                                        <Plus className="w-3 h-3"/> ADD_PLAN
                                                    </button>
                                                </div>
                                                <div className="space-y-4">
                                                    {s.attackPaths?.map((path, pi) => (
                                                        <div key={pi} className="p-6 bg-black/40 border border-white/5 space-y-4 relative group">
                                                            <button onClick={() => { const n = [...scenarios]; n[si].attackPaths = n[si].attackPaths.filter((_:any, idx:any) => idx !== pi); setScenarios(n); }} className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <RichInput placeholder="PLAN_TITLE" value={path.title} onChange={val => { const n = [...scenarios]; n[si].attackPaths[pi].title = val; setScenarios(n); }} />
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">RISK_LEVEL</label>
                                                                    <select value={path.risk} onChange={e => { const n = [...scenarios]; n[si].attackPaths[pi].risk = e.target.value; setScenarios(n); }} className="w-full bg-black border border-white/10 p-4 text-white font-black italic focus:border-primary outline-none appearance-none uppercase text-xs">
                                                                        <option value="CRITICAL">CRITICAL</option>
                                                                        <option value="HIGH">HIGH</option>
                                                                        <option value="MEDIUM">MEDIUM</option>
                                                                        <option value="LOW">LOW</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <RichTextarea placeholder="PLAN_DESCRIPTION" value={path.desc} onChange={val => { const n = [...scenarios]; n[si].attackPaths[pi].desc = val; setScenarios(n); }} rows={3} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 06. Diagnostics */}
                    {activeTab === "troubleshooting" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-widest">DIAGNOSTIC_ENTRIES</h3>
                                <button onClick={addTrouble} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-black tracking-widest italic uppercase">ADD_DIAGNOSTIC</button>
                            </div>
                            {troubleshooting.map((t, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-10 space-y-8 relative">
                                    <button onClick={() => setTroubleshooting(troubleshooting.filter((_, idx) => idx !== i))} className="absolute top-6 right-6 text-white/10 hover:text-primary"><Trash2 className="w-5 h-5" /></button>
                                    <RichInput placeholder="PROBLEM" value={t.problem} onChange={val => { const n = [...troubleshooting]; n[i].problem = val; setTroubleshooting(n); }} />
                                    <RichTextarea placeholder="CAUSE" value={t.cause} onChange={val => { const n = [...troubleshooting]; n[i].cause = val; setTroubleshooting(n); }} rows={3} />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <RichTextarea placeholder="RESOLUTION" value={t.resolution} onChange={val => { const n = [...troubleshooting]; n[i].resolution = val; setTroubleshooting(n); }} rows={3} />
                                        <RichTextarea placeholder="COMMAND_OVERRIDE (OPTIONAL)" value={t.command || ""} onChange={val => { const n = [...troubleshooting]; n[i].command = val; setTroubleshooting(n); }} rows={3} className="font-mono text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 06. References */}
                    {activeTab === "references" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-8">
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest">REFERENCES</h3>
                                <button onClick={addReference} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-black tracking-widest uppercase">ADD_REFERENCE</button>
                            </div>
                            {referencesList.map((ref, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-8 flex gap-8 items-end relative">
                                    <button onClick={() => setReferencesList(referencesList.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-white/5 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                                    <input value={ref.name} onChange={e => { const n = [...referencesList]; n[i].name = e.target.value; setReferencesList(n); }} className="flex-1 bg-black border border-white/10 p-3 text-white font-black text-xs outline-none" placeholder="NAME" />
                                    <input value={ref.url} onChange={e => { const n = [...referencesList]; n[i].url = e.target.value; setReferencesList(n); }} className="flex-[2] bg-black border border-white/10 p-3 text-white/40 font-mono text-xs outline-none" placeholder="SECURE_URL" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
