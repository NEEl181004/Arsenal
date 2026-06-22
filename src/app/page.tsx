"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight, Activity, Cpu, Disc, Zap } from "lucide-react";

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const [stats, setStats] = useState({
        nodesConnected: 142,
        integrity: 98.4,
        threatLevel: "ELEVATED"
    });

    // Simulated terminal output logs
    useEffect(() => {
        const logs = [
            "SYSTEM: Initializing tactical HUD...",
            "DB: Connection established to cluster-0x4",
            "SECURE_GATE: Decryption algorithm loaded successfully",
            "RED_TEAM: Target list updated from main vault",
            "PORT_SCAN: Scanning range 10.0.12.0/24...",
            "PORT_SCAN: Found open ports: 22, 80, 443, 8080",
            "EXPLOIT: Launching automated payload check...",
            "EXPLOIT: CVE-2024-3847 vulnerability detected",
            "SESSION: Spawned meterpreter shell at 10.0.12.89",
            "PERSISTENCE: Deploying background beacon service...",
            "AUDIT: Documentation indexing finalized."
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                setTerminalLogs(prev => [...prev.slice(-6), logs[index]]);
                index++;
            } else {
                index = 0;
                setTerminalLogs([]);
            }
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    // Interactive canvas nodes network animation
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

        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
        }> = [];

        // Generate particle nodes
        const particleCount = Math.min(60, Math.floor((width * height) / 25000));
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw tactical grid backdrop
            ctx.strokeStyle = "rgba(255, 0, 60, 0.02)";
            ctx.lineWidth = 1;
            const gridSpacing = 60;
            for (let x = 0; x < width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw particles and connection lines
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 0, 60, 0.4)";
                ctx.fill();

                // Draw lines to near neighbors
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 0, 60, ${0.18 * (1 - dist / 180)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center overflow-hidden font-sans text-white py-10 px-4">
            {/* Background Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
            
            {/* Glowing Red Ambient Ambient Lights */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/[0.03] blur-[150px] rounded-full pointer-events-none" />

            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10 opacity-30" />

            <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* ── LEFT HUD HERO PANEL (7 cols) ── */}
                <div className="lg:col-span-7 space-y-8 text-left">
                    <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/25 px-4 py-1.5 rounded-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Tactical Offense Hub</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] uppercase">
                            Red Teaming<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600 drop-shadow-[0_0_20px_rgba(255,0,60,0.25)]">
                                Documentation
                            </span>
                        </h1>
                        <p className="max-w-xl text-white/40 text-sm sm:text-base font-light leading-relaxed">
                            Welcome to the Arsenal repository. A hardened command vault detailing exploits, scan routines, weaponized payloads, and network mapping structures for secure operations.
                        </p>
                    </div>

                    {/* Quick Stats Panel */}
                    <div className="grid grid-cols-3 gap-4 border border-white/[0.04] bg-white/[0.01] backdrop-blur-md p-5 rounded-md relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-[1px] bg-primary" />
                        <div className="absolute top-0 left-0 w-[1px] h-2 bg-primary" />
                        
                        <div className="space-y-1">
                            <span className="block text-[8px] text-white/20 uppercase tracking-widest font-mono">THREAT_LEVEL</span>
                            <span className="block text-xs font-black text-primary tracking-wide">{stats.threatLevel}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[8px] text-white/20 uppercase tracking-widest font-mono">NODE_INTEGRITY</span>
                            <span className="block text-xs font-black text-white/90 tracking-wide">{stats.integrity}%</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-[8px] text-white/20 uppercase tracking-widest font-mono">DENSITY_INDEX</span>
                            <span className="block text-xs font-black text-white/90 tracking-wide">{stats.nodesConnected} PTS</span>
                        </div>
                    </div>

                    {/* Entry Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link 
                            href="/dashboard"
                            className="px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.25em] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(255,0,60,0.3)] transition-all duration-300 flex items-center gap-3 group relative overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            Enter Console <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* ── RIGHT ANIMATED HUD PANEL (5 cols) ── */}
                <div className="lg:col-span-5 relative w-full flex justify-center">
                    
                    {/* Simulated terminal feed & Cyber deck visualization */}
                    <div className="w-full max-w-[420px] bg-black/80 border border-white/[0.08] rounded-md shadow-2xl relative overflow-hidden">
                        
                        {/* Terminal Header */}
                        <div className="bg-[#0c0c0e] border-b border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                                <span className="text-[10px] font-mono text-white/50 tracking-wider">tactical_hud_stream.log</span>
                            </div>
                            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                        </div>

                        {/* Interactive HUD Animation Area */}
                        <div className="p-6 space-y-6">
                            
                            {/* Scanning rings or HUD radar */}
                            <div className="w-40 h-40 mx-auto rounded-full border border-primary/20 flex items-center justify-center relative bg-primary/[0.01]">
                                <div className="absolute inset-2 rounded-full border border-dashed border-primary/30 animate-[spin_30s_linear_infinite]" />
                                <div className="absolute inset-8 rounded-full border border-primary/10" />
                                <div className="absolute inset-14 rounded-full border border-dashed border-primary/40 animate-[spin_10s_linear_infinite]" />
                                
                                <Shield className="w-10 h-10 text-primary drop-shadow-[0_0_12px_rgba(255,0,60,0.4)] animate-pulse" />
                                
                                {/* Orbiting indicator point */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff003c] animate-ping" />
                            </div>

                            {/* Simulated Live Command Output Feed */}
                            <div className="bg-black/60 border border-white/5 p-4 rounded font-mono text-[10px] space-y-2 h-36 overflow-hidden select-none">
                                {terminalLogs.length === 0 ? (
                                    <div className="text-white/20 flex items-center gap-2 py-4">
                                        <span className="w-1 h-1.5 bg-primary animate-pulse" /> 
                                        Awaiting connection stream...
                                    </div>
                                ) : (
                                    terminalLogs.map((log, index) => {
                                        const isSystem = log.startsWith("SYSTEM");
                                        const isExploit = log.startsWith("EXPLOIT");
                                        const colorClass = isSystem ? "text-primary font-bold" : isExploit ? "text-amber-500 font-bold" : "text-white/60";
                                        return (
                                            <div key={index} className="truncate flex items-start gap-2">
                                                <span className="text-primary font-bold">{`>`}</span>
                                                <span className={colorClass}>{log}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* HUD bottom indicators */}
                        <div className="bg-[#0c0c0e] border-t border-white/[0.06] p-4 grid grid-cols-2 text-[9px] font-mono text-white/30">
                            <div>SEC_LEVEL: CLASS_4</div>
                            <div className="text-right text-primary font-bold animate-pulse">VAULT_LOCK: ACTIVE</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
