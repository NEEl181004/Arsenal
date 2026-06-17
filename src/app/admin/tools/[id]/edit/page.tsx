"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
    Plus, Trash2, Save, Loader2, ChevronRight, 
    Target, Cpu, Shield, Globe, Terminal, 
    AlertTriangle, BookOpen, Activity, LayoutGrid,
    MoveUp, MoveDown
} from "lucide-react";
import { 
    IInstallationTab, IScenario, ITroubleshooting, 
    IReference, IKeyTakeaway, IAttackPath 
} from "@/models/Tool";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextarea from "@/components/admin/RichTextarea";
import RichInput from "@/components/admin/RichInput";

export default function EditToolPage() {
    const { id } = useParams();
    const router = useRouter();
    
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Exploitation");
    const [developer, setDeveloper] = useState("");
    const [tier, setTier] = useState("Expert");
    const [bestFor, setBestFor] = useState("Red Teaming");
    const [overview, setOverview] = useState("");
    const [security, setSecurity] = useState("");

    const [coreModules, setCoreModules] = useState<any[]>([]);
    const [installationSequence, setInstallationSequence] = useState<IInstallationTab[]>([]);
    const [scenarios, setScenarios] = useState<IScenario[]>([]);
    const [originalScenarios, setOriginalScenarios] = useState<IScenario[]>([]);
    const [troubleshooting, setTroubleshooting] = useState<ITroubleshooting[]>([]);
    const [referencesList, setReferencesList] = useState<IReference[]>([]);

    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            try {
                const res = await fetch(`/api/tools/${id}`);
                const data = await res.json();
                setName(data.name || "");
                setCategory(data.category || "Exploitation");
                setDeveloper(data.developer || "");
                setTier(data.tier || "Expert");
                setBestFor(data.bestFor || "Red Teaming");
                setOverview(data.overview || "");
                setSecurity(data.security || "");
                setCoreModules(data.core_modules || []);
                setInstallationSequence(data.installation_sequence || []);
                const normalizedScenarios = (data.scenarios || []).map((s: any) => ({
                    ...s,
                    keyTakeaways: (s.keyTakeaways && s.keyTakeaways.length > 0) ? s.keyTakeaways : [
                        { title: "PAYLOAD_SIGNATURE", content: "Generating high packet volume across edge clusters." },
                        { title: "NETWORK_EXPOSURE", content: "Stealth protocol bypass active on target nodes." },
                        { title: "DATA_INTEGRITY", content: "Hash verification required for incoming telemetry." }
                    ],
                    attackPaths: (s.attackPaths && s.attackPaths.length > 0) ? s.attackPaths : [
                        { title: "PRIVILEGE_ESCALATION", risk: "HIGH", desc: "Escalating from standard user to system-level root." },
                        { title: "LATERAL_MOVEMENT", risk: "MEDIUM", desc: "Pivoting across internal financial subnets." },
                        { title: "DATA_SIPHON", risk: "LOW", desc: "Establishing persistent reverse proxy tunnels." }
                    ]
                }));
                setScenarios(normalizedScenarios);
                setOriginalScenarios(JSON.parse(JSON.stringify(normalizedScenarios)));
                setTroubleshooting(data.troubleshooting || []);
                setReferencesList(data.references_list || []);
            } catch (e) { console.error(e); }
            finally { setFetching(false); }
        };
        fetchTool();
    }, [id]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Optimize scenarios by omitting unchanged Base64 image payloads
            const optimizedScenarios = scenarios.map((s) => {
                const orig = originalScenarios.find(o => {
                    const sId = (s as any)._id;
                    const oId = (o as any)._id;
                    return (sId && oId && sId === oId) || 
                           (!sId && !oId && s.name === o.name);
                });
                if (orig && s.logsImage === orig.logsImage) {
                    return {
                        ...s,
                        logsImage: "__KEEP_EXISTING_IMAGE__"
                    };
                }
                return s;
            });

            const res = await fetch(`/api/tools/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, category, developer, tier, bestFor, overview, security,
                    core_modules: coreModules,
                    installation_sequence: installationSequence,
                    scenarios: optimizedScenarios, troubleshooting, references_list: referencesList
                }),
            });
            if (res.ok) {
                router.push(`/tools/${id}`);
                router.refresh();
            } else {
                try {
                    const err = await res.json();
                    alert(`Failed to save: ${err.error || "Unknown server error"}`);
                } catch {
                    alert(`Failed to save: HTTP ${res.status}`);
                }
            }
        } catch (e: any) { 
            console.error(e); 
            alert(`Error saving: ${e.message || e}`);
        }
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
        keyTakeaways: [{ title: "SIGNATURE", content: "" }], 
        attackPaths: [{ title: "ESCALATION", risk: "HIGH", desc: "" }] 
    }]);

    const addKeyTakeaway = (si: number) => {
        const n = [...scenarios];
        if (!n[si].keyTakeaways) n[si].keyTakeaways = [];
        n[si].keyTakeaways.push({ title: "", content: "" });
        setScenarios(n);
    };

    const addAttackPath = (si: number) => {
        const n = [...scenarios];
        if (!n[si].attackPaths) n[si].attackPaths = [];
        n[si].attackPaths.push({ title: "", risk: "HIGH", desc: "" });
        setScenarios(n);
    };

    const addTrouble = () => setTroubleshooting([...troubleshooting, { problem: "", cause: "", resolution: "" }]);
    const addReference = () => setReferencesList([...referencesList, { name: "", type: "Docs", url: "", updatedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.') }]);

    if (fetching) return <div className="flex items-center justify-center min-h-screen bg-black"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;

    return (
        <div className="max-w-none mx-auto pb-20 px-4 md:px-8 xl:px-16">
            <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
                        Edit <span className="text-primary">Tool</span>
                    </h1>
                    <div className="text-xs font-medium text-primary/60 uppercase tracking-widest">Update Tool Information</div>
                </div>
                <button onClick={handleSave} disabled={loading} className="bg-primary text-white px-8 py-3.5 font-bold text-xs tracking-widest flex items-center gap-3 hover:bg-primary/90 transition-all uppercase shrink-0">
                    <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
                </button>
            </header>

            <div className="flex flex-col lg:flex-row gap-6">
                <nav className="w-full lg:w-56 flex lg:flex-col gap-1 shrink-0 overflow-x-auto">
                    {[
                        { id: "overview", label: "Overview", icon: BookOpen },
                        { id: "core", label: "Modules", icon: Activity },
                        { id: "installation", label: "Installation", icon: LayoutGrid },
                        { id: "scenarios", label: "Scenarios", icon: Target },
                        { id: "troubleshooting", label: "Diagnostics", icon: AlertTriangle },
                        { id: "references", label: "References", icon: Globe }
                    ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`shrink-0 lg:w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest border-l-2 transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === t.id ? "bg-white/[0.04] border-primary text-white" : "border-transparent text-white/25 hover:text-white hover:bg-white/[0.01]"}`}>
                            <t.icon className={`w-4 h-4 shrink-0 ${activeTab === t.id ? "text-primary" : "text-white/10"}`} />
                            {t.label}
                        </button>
                    ))}
                </nav>

                <div className="flex-1 min-w-0 bg-white/[0.01] border border-white/5 p-5 md:p-8 relative">
                    
                    {/* 01. Metadata & Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                <RichInput label="Tool Name" value={name} onChange={setName} />
                                <RichInput label="Developer" value={developer} onChange={setDeveloper} />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/20 uppercase tracking-widest">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white font-black focus:border-primary outline-none appearance-none text-sm">
                                        <option value="Exploitation">EXPLOITATION</option>
                                        <option value="Discovery">DISCOVERY</option>
                                        <option value="Payloads">PAYLOADS</option>
                                        <option value="Recon">RECONNAISSANCE</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/20 uppercase tracking-widest">Tier</label>
                                    <select value={tier} onChange={e => setTier(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white font-black focus:border-primary outline-none appearance-none text-sm">
                                        <option value="Beginner">BEGINNER</option>
                                        <option value="Intermediate">INTERMEDIATE</option>
                                        <option value="Expert">EXPERT</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/20 uppercase tracking-widest">Best For</label>
                                    <select value={bestFor} onChange={e => setBestFor(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-white font-black focus:border-primary outline-none appearance-none text-sm">
                                        <option value="Red Teaming">RED TEAMING</option>
                                        <option value="Penetration Testing">PENETRATION TESTING</option>
                                        <option value="CTF">CTF</option>
                                        <option value="Research">RESEARCH</option>
                                        <option value="OSINT">OSINT</option>
                                    </select>
                                </div>
                            </div>
                            <RichTextarea label="OVERVIEW_HTML" value={overview} onChange={setOverview} rows={6} />
                        </div>
                    )}

                    {/* 03. Core Modules */}
                    {activeTab === "core" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Modules</h3>
                                <button onClick={addCoreModule} className="bg-white/5 px-4 py-2 hover:bg-primary transition-all border border-white/10 text-[10px] font-bold tracking-widest uppercase">Add Module</button>
                            </div>
                            {coreModules.map((m, mi) => (
                                <div key={mi} className="bg-white/[0.02] border border-white/5 p-5 space-y-4 relative group">
                                    <button onClick={() => setCoreModules(coreModules.filter((_, i) => i !== mi))} className="absolute top-4 right-4 text-white/10 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input value={m.name} onChange={e => { const n = [...coreModules]; n[mi].name = e.target.value; setCoreModules(n); }} className="w-full bg-black border border-white/10 p-3 text-primary font-black uppercase outline-none text-sm" placeholder="MODULE_LABEL" />
                                        <input value={m.icon} onChange={e => { const n = [...coreModules]; n[mi].icon = e.target.value; setCoreModules(n); }} className="w-full bg-black border border-white/10 p-3 text-white/40 font-mono outline-none text-xs" placeholder="LUCIDE_NAME or paste <svg>..." />
                                    </div>
                                    <RichInput placeholder="MODULE_TITLE" value={m.title} onChange={val => { const n = [...coreModules]; n[mi].title = val; setCoreModules(n); }} />
                                    <RichTextarea placeholder="Description..." value={m.description} onChange={val => { const n = [...coreModules]; n[mi].description = val; setCoreModules(n); }} rows={3} />
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center"><label className="text-[11px] font-black text-primary tracking-widest">TELEMETRY_DATAFEED</label><button onClick={() => addTelemetry(mi)} className="text-[11px] text-white/20 hover:text-primary"><Plus className="w-4 h-4"/></button></div>
                                        {m.telemetry?.map((row: any, ri: number) => (
                                            <div key={ri} className="space-y-2">
                                                <div className="flex gap-3">
                                                    <input value={row.key} onChange={e => { const n = [...coreModules]; n[mi].telemetry[ri].key = e.target.value; setCoreModules(n); }} className="flex-1 bg-black p-2.5 text-[10px] border border-white/5 uppercase" placeholder="Key" />
                                                    <input value={row.value} onChange={e => { const n = [...coreModules]; n[mi].telemetry[ri].value = e.target.value; setCoreModules(n); }} className="flex-1 bg-black p-2.5 text-[10px] border border-white/5 text-primary" placeholder="Value" />
                                                    <button onClick={() => { const n = [...coreModules]; n[mi].telemetry = n[mi].telemetry.filter((_:any, i:any) => i !== ri); setCoreModules(n); }} className="text-white/10 hover:text-primary"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                                <input value={row.description || ""} onChange={e => { const n = [...coreModules]; n[mi].telemetry[ri].description = e.target.value; setCoreModules(n); }} className="w-full bg-black/40 p-2 text-[9px] border border-white/5 italic text-white/30" placeholder="Optional description for this telemetry point..." />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 04. Deployment */}
                    {activeTab === "installation" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Installation</h3>
                                <button onClick={addInstallationTab} className="bg-white/5 px-4 py-2 hover:bg-primary transition-all border border-white/10 text-[10px] font-bold tracking-widest uppercase">Add Target OS</button>
                            </div>
                            {installationSequence.map((tab, ti) => (
                                <div key={ti} className="bg-white/[0.02] border border-white/5 p-5 space-y-4 relative">
                                    <button onClick={() => setInstallationSequence(installationSequence.filter((_, i) => i !== ti))} className="absolute top-4 right-4 text-white/10 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input value={tab.tabName} onChange={e => { const n = [...installationSequence]; n[ti].tabName = e.target.value; setInstallationSequence(n); }} className="bg-black border border-white/10 text-lg font-black text-primary outline-none p-3 w-full uppercase" placeholder="OS_NAME" />
                                        <input value={tab.svgIcon || ""} onChange={e => { const n = [...installationSequence]; n[ti].svgIcon = e.target.value; setInstallationSequence(n); }} className="bg-black border border-white/10 text-xs font-mono text-white/40 outline-none p-3 w-full" placeholder="Paste <svg> or image URL for OS icon..." />
                                    </div>
                                    <button onClick={() => addStepToTab(ti)} className="text-[10px] font-black text-white/20 hover:text-primary flex items-center gap-2">+ ADD_STEP</button>
                                    {tab.steps.map((step, si) => (
                                        <div key={si} className="bg-black/60 p-4 border border-white/5 space-y-3 relative group">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const n = [...installationSequence];
                                                    n[ti].steps = n[ti].steps.filter((_, idx) => idx !== si);
                                                    setInstallationSequence(n);
                                                }}
                                                className="absolute top-3 right-3 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                            <input value={step.name} onChange={e => { const n = [...installationSequence]; n[ti].steps[si].name = e.target.value; setInstallationSequence(n); }} className="w-full bg-black border border-white/10 p-2.5 text-xs font-black uppercase pr-10" placeholder="Step Name" />
                                            <input value={step.cmd} onChange={e => { const n = [...installationSequence]; n[ti].steps[si].cmd = e.target.value; setInstallationSequence(n); }} className="w-full bg-black border border-white/10 p-3 text-xs text-white font-mono pr-10" placeholder="Command" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 05. Scenarios */}
                    {activeTab === "scenarios" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Scenarios</h3>
                                <button onClick={addScenario} className="bg-white/5 px-4 py-2 hover:bg-primary transition-all border border-white/10 text-[10px] font-bold tracking-widest uppercase">Add Scenario</button>
                            </div>
                            {scenarios.map((s, si) => (
                                <div key={si} className="bg-white/[0.02] border border-white/5 p-5 space-y-6 relative group">
                                    <button onClick={() => setScenarios(scenarios.filter((_, idx) => idx !== si))} className="absolute top-4 right-4 text-white/10 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                                    <input value={s.name} onChange={e => { const n = [...scenarios]; n[si].name = e.target.value; setScenarios(n); }} className="bg-transparent border-b border-white/10 text-xl font-black text-primary outline-none pb-2 w-full uppercase pr-8" placeholder="SCENARIO_NAME" />
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <RichInput placeholder="PRIMARY_OBJECTIVE" value={s.objective} onChange={val => { const n = [...scenarios]; n[si].objective = val; setScenarios(n); }} />
                                            
                                            {/* Objective List (Boxes) */}
                                            <div className="space-y-3 pt-3 border-t border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Objective Boxes</label>
                                                    <button type="button" onClick={() => {
                                                        const n = [...scenarios];
                                                        if (!n[si].objectiveList) n[si].objectiveList = [];
                                                        n[si].objectiveList.push("");
                                                        setScenarios(n);
                                                    }} className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"><Plus className="w-3 h-3"/>ADD</button>
                                                </div>
                                                <div className="space-y-2">
                                                    {(s.objectiveList || []).map((obj, oi) => (
                                                        <div key={oi} className="flex gap-2 items-center bg-black/40 border border-white/5 p-2 relative group/obj">
                                                            <input value={obj} onChange={e => {
                                                                const n = [...scenarios];
                                                                n[si].objectiveList[oi] = e.target.value;
                                                                setScenarios(n);
                                                            }} className="flex-1 bg-transparent text-xs text-white/60 font-light outline-none" placeholder="Objective description..." />
                                                            <button type="button" onClick={() => {
                                                                const n = [...scenarios];
                                                                n[si].objectiveList = n[si].objectiveList.filter((_, idx) => idx !== oi);
                                                                setScenarios(n);
                                                            }} className="text-white/10 hover:text-primary opacity-0 group-hover/obj:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <RichTextarea placeholder="HADES_OPS_SCRIPT" value={s.script} onChange={val => { const n = [...scenarios]; n[si].script = val; setScenarios(n); }} rows={8} className="text-primary font-mono text-xs" />
                                        </div>
                                        <div className="space-y-4">
                                            <ImageUpload label="EVIDENCE_LOG_SCREENSHOT" value={s.logsImage} onChange={(val) => { const n = [...scenarios]; n[si].logsImage = val; setScenarios(n); }} />
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">KEY_TAKEAWAYS</label>
                                                    <button onClick={() => addKeyTakeaway(si)} className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"><Plus className="w-3 h-3"/>ADD</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {s.keyTakeaways?.map((take, ii) => (
                                                        <div key={ii} className="p-4 bg-black/40 border border-white/5 space-y-3 relative group">
                                                            <button onClick={() => { const n = [...scenarios]; n[si].keyTakeaways = n[si].keyTakeaways.filter((_:any, idx:any) => idx !== ii); setScenarios(n); }} className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            <RichInput placeholder="TAKEAWAY_TITLE" value={take.title} onChange={val => { const n = [...scenarios]; n[si].keyTakeaways[ii].title = val; setScenarios(n); }} />
                                                            <RichTextarea placeholder="TAKEAWAY_DETAIL" value={take.content} onChange={val => { const n = [...scenarios]; n[si].keyTakeaways[ii].content = val; setScenarios(n); }} rows={2} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">ATTACK_PLANS</label>
                                                    <button onClick={() => addAttackPath(si)} className="text-[9px] text-white/20 hover:text-primary flex items-center gap-1 uppercase font-black"><Plus className="w-3 h-3"/>ADD</button>
                                                </div>
                                                <div className="space-y-3">
                                                    {s.attackPaths?.map((path, pi) => (
                                                        <div key={pi} className="p-4 bg-black/40 border border-white/5 space-y-3 relative group">
                                                            <button onClick={() => { const n = [...scenarios]; n[si].attackPaths = n[si].attackPaths.filter((_:any, idx:any) => idx !== pi); setScenarios(n); }} className="absolute top-2 right-2 text-white/10 hover:text-primary opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <RichInput placeholder="PLAN_TITLE" value={path.title} onChange={val => { const n = [...scenarios]; n[si].attackPaths[pi].title = val; setScenarios(n); }} />
                                                                <select value={path.risk} onChange={e => { const n = [...scenarios]; n[si].attackPaths[pi].risk = e.target.value; setScenarios(n); }} className="w-full bg-black border border-white/10 p-3 text-white font-black focus:border-primary outline-none appearance-none uppercase text-xs">
                                                                    <option value="CRITICAL">CRITICAL</option>
                                                                    <option value="HIGH">HIGH</option>
                                                                    <option value="MEDIUM">MEDIUM</option>
                                                                    <option value="LOW">LOW</option>
                                                                </select>
                                                            </div>
                                                            <RichTextarea placeholder="PLAN_DESCRIPTION" value={path.desc} onChange={val => { const n = [...scenarios]; n[si].attackPaths[pi].desc = val; setScenarios(n); }} rows={2} />
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
                                <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Diagnostics</h3>
                                <button onClick={addTrouble} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-bold tracking-widest uppercase">Add Entry</button>
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
                                <h3 className="text-2xl font-bold text-white uppercase tracking-widest">References</h3>
                                <button onClick={addReference} className="bg-white/5 p-4 hover:bg-primary transition-all border border-white/10 text-[10px] font-bold tracking-widest uppercase">Add Reference</button>
                            </div>
                            {referencesList.map((ref, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 p-8 flex gap-8 items-end relative">
                                    <button onClick={() => setReferencesList(referencesList.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-white/5 hover:text-primary"><Trash2 className="w-4 h-4" /></button>
                                    <input value={ref.name} onChange={e => { const n = [...referencesList]; n[i].name = e.target.value; setReferencesList(n); }} className="flex-1 bg-black border border-white/10 p-3 text-white font-black text-xs outline-none" placeholder="NAME" />
                                    <input value={ref.url} onChange={e => { const n = [...referencesList]; n[i].url = e.target.value; setReferencesList(n); }} className="flex-[2] bg-black border border-white/10 p-3 text-white/40 font-mono text-xs outline-none uppercase" placeholder="SECURE_URL" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
