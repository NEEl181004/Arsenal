"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight, Activity, Cpu, Database, Eye, Radio, Network } from "lucide-react";

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState("logs");
    const [commandInput, setCommandInput] = useState("");
    const [terminalLines, setTerminalLines] = useState<string[]>([
        "SYSTEM: AUTHENTICATION OK - SECLEVEL 4 BEACON ACTIVE",
        "SECURE_GATE: CONNECTED TO ARSENAL CLUSTER V1.4.0",
        "Type 'help' to list available system overrides."
    ]);

    // Command line interactive parser for the dashboard widget
    const handleCommandSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = commandInput.trim().toLowerCase();
        if (!cmd) return;

        let response = "";
        if (cmd === "help") {
            response = "AVAILABLE COMMANDS: help, clear, status, scan, decrypt";
        } else if (cmd === "clear") {
            setTerminalLines([]);
            setCommandInput("");
            return;
        } else if (cmd === "status") {
            response = "ALL NODES COMPLIANT. ACTIVE SESSIONS: 4. THREAT LEVEL: ELEVATED.";
        } else if (cmd === "scan") {
            response = "INITIATING TARGET ENUMERATION... 12 COMPROMISED HOSTS RECORDED.";
        } else if (cmd === "decrypt") {
            response = "VAULT STATUS: FULLY DECRYPTED. REDIRECTING...";
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1000);
        } else {
            response = `COMMAND NOT FOUND: '${cmd}'. Type 'help' for console options.`;
        }

        setTerminalLines(prev => [...prev, `> ${commandInput}`, response]);
        setCommandInput("");
    };

    // 3D Perspective Wireframe Grid canvas animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        let rotation = 0;
        let pitch = 60; // tilt angle

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw radial dark vignette gradient
            const bgGrad = ctx.createRadialGradient(
                width / 2,
                height / 2,
                10,
                width / 2,
                height / 2,
                width * 0.8
            );
            bgGrad.addColorStop(0, "rgba(8, 8, 10, 0.4)");
            bgGrad.addColorStop(1, "rgba(4, 4, 5, 0.95)");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Draw 3D-looking grid lines
            ctx.strokeStyle = "rgba(255, 0, 60, 0.04)";
            ctx.lineWidth = 1;
            rotation += 0.0008;

            const centerX = width / 2;
            const centerY = height * 0.75; // horizon point
            const maxRadius = Math.max(width, height) * 1.2;

            // Perspective grid rays radiating from horizon
            const rayCount = 42;
            for (let i = 0; i < rayCount; i++) {
                const angle = (i / rayCount) * Math.PI * 2 + rotation;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                // Project outward to bounds
                ctx.lineTo(centerX + cos * maxRadius, centerY + sin * maxRadius * 0.35);
                ctx.stroke();
            }

            // Concentric rings (perspective rings)
            const ringCount = 12;
            for (let i = 1; i <= ringCount; i++) {
                const radius = (i / ringCount) * maxRadius;
                ctx.beginPath();
                // Draw ellipse representing perspective circle
                ctx.ellipse(
                    centerX,
                    centerY,
                    radius,
                    radius * 0.35,
                    0,
                    0,
                    Math.PI * 2
                );
                ctx.strokeStyle = `rgba(255, 0, 60, ${0.07 * (1 - i / ringCount)})`;
                ctx.stroke();
            }

            // Draw floating tech nodes in 3D space
            const nodeCount = 18;
            for (let i = 0; i < nodeCount; i++) {
                const seed = i * 133.7;
                const distRatio = ((seed + rotation * 200) % maxRadius) / maxRadius;
                const angle = (seed + rotation * 0.2) % (Math.PI * 2);
                
                const x = centerX + Math.cos(angle) * (distRatio * maxRadius);
                const y = centerY + Math.sin(angle) * (distRatio * maxRadius) * 0.35;

                if (y > centerY) { // Only draw elements below horizon line
                    ctx.beginPath();
                    ctx.arc(x, y, 2 + (1 - distRatio) * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 0, 60, ${0.45 * (1 - distRatio)})`;
                    ctx.fill();

                    // Optional vertical projection line to "ground"
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y - (1 - distRatio) * 60);
                    ctx.strokeStyle = `rgba(255, 0, 60, ${0.15 * (1 - distRatio)})`;
                    ctx.stroke();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center overflow-hidden font-sans text-white py-12 px-6">
            {/* Background 3D Perspective Plane Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
            
            {/* Hologram scanline strip overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_6px,4px_100%] pointer-events-none z-10 opacity-40" />

            <div className="w-full max-w-7xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* ── LEFT TACTICAL BRIEFING (7 cols) ── */}
                <div className="lg:col-span-7 space-y-8 text-left">
                    
                    {/* Security Agency Badge Header */}
                    <div className="inline-flex items-center gap-2 bg-[#0c0c0f] border border-white/10 px-4 py-2 rounded-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-primary" />
                        <Radio className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/60">
                            NODE ADDRESS: <span className="text-white">ARSENAL_GW_0x49</span>
                        </span>
                    </div>

                    {/* Pro Level Headline */}
                    <div className="space-y-4">
                        <div className="text-[11px] font-black uppercase text-primary tracking-[0.4em] mb-1">
                            CLASSIFIED INTELLIGENCE SYSTEM
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] uppercase relative group">
                            ARSENAL
                            <span className="block text-2xl sm:text-3xl lg:text-4xl text-white/50 font-light mt-2 tracking-[0.1em]">
                                RED TEAM PLATFORM
                            </span>
                        </h1>
                        <p className="max-w-xl text-white/40 text-xs sm:text-sm font-light leading-relaxed pt-2">
                            The military-grade orchestration documentation and command repository. Housing advanced payload models, host discovery maps, automated threat emulation sequences, and secure diagnostics logs.
                        </p>
                    </div>

                    {/* Operational Dashboard Counters */}
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-b border-white/[0.05] py-6 max-w-lg">
                        <div className="space-y-1">
                            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">DECRYPTED_TOOLS</div>
                            <div className="text-2xl font-black text-white">09 <span className="text-[10px] font-normal text-primary">SECURE</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">ACTIVE_BEACONS</div>
                            <div className="text-2xl font-black text-white">04 <span className="text-[10px] font-normal text-primary">LIVE</span></div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">SECTOR_THREAT</div>
                            <div className="text-2xl font-black text-primary">92% <span className="text-[10px] font-normal text-white/40">CRIT</span></div>
                        </div>
                    </div>

                    {/* Core CTA triggers */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link 
                            href="/dashboard"
                            className="px-10 py-5 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary-hover transition-all duration-300 flex items-center gap-3 group relative overflow-hidden shadow-[0_0_40px_rgba(255,0,60,0.2)] border border-primary/40 rounded-sm"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            INITIALIZE SYSTEM CONSOLE <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* ── RIGHT HACKER DECK WIDGET (5 cols) ── */}
                <div className="lg:col-span-5 relative w-full flex justify-center">
                    
                    <div className="w-full max-w-[450px] bg-[#08080a] border border-white/10 shadow-2xl relative overflow-hidden rounded-sm">
                        {/* Interactive Widget Header Tabs */}
                        <div className="bg-[#0b0b0e] border-b border-white/[0.08] flex items-center justify-between px-4">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setActiveTab("logs")}
                                    className={`py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 cursor-pointer transition-all ${activeTab === "logs" ? "border-primary text-white" : "border-transparent text-white/30"}`}
                                >
                                    LOGS_STREAM
                                </button>
                                <button 
                                    onClick={() => setActiveTab("console")}
                                    className={`py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 cursor-pointer transition-all ${activeTab === "console" ? "border-primary text-white" : "border-transparent text-white/30"}`}
                                >
                                    INTERACTIVE_SH
                                </button>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>

                        {/* Interactive Widget Body */}
                        <div className="p-6 h-[250px] overflow-y-auto font-mono text-[10px] space-y-3">
                            
                            {activeTab === "logs" ? (
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-white/50">
                                        <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>[SYS] SCANNING PORT SUITE ON LOCAL HOSTS</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50">
                                        <Cpu className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>[SYS] WEAPONIZED EXPLOIT PAYLOAD BUILDS LOADED</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50">
                                        <Database className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>[DB] DATABASE CONNECTED - MONGO_CLUSTER_7</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50">
                                        <Network className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>[NET] GATEWAY HANDSHAKE CONFIRMED AT IP 10.99.1.1</span>
                                    </div>
                                    <div className="text-white/20 pt-4 flex items-center gap-1.5 animate-pulse">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                        LISTENING FOR TACTICAL BEACONS...
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full justify-between">
                                    <div className="space-y-1.5 overflow-y-auto max-h-[160px] pr-2">
                                        {terminalLines.map((line, idx) => (
                                            <div key={idx} className={line.startsWith(">") ? "text-primary font-bold" : "text-white/60"}>
                                                {line}
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={handleCommandSubmit} className="flex gap-2 border-t border-white/5 pt-3 mt-3">
                                        <span className="text-primary font-bold">{`$`}</span>
                                        <input
                                            type="text"
                                            value={commandInput}
                                            onChange={(e) => setCommandInput(e.target.value)}
                                            placeholder="Type 'help' or commands here..."
                                            className="bg-transparent flex-1 focus:outline-none text-[10px] text-white font-mono placeholder:text-white/25"
                                        />
                                    </form>
                                </div>
                            )}

                        </div>

                        {/* Interactive Widget Footer */}
                        <div className="bg-[#0b0b0e] border-t border-white/[0.08] px-4 py-3 flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
                            <div>CLEARANCE: LEVEL_4</div>
                            <div className="text-primary font-bold animate-pulse">HUD_ONLINE</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
