"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Continent outlines: [longitude, latitude] in degrees
const CONTINENT_OUTLINES = [
    // North America (detailed trace)
    [
        [-168, 65], [-160, 70], [-140, 71], [-120, 68], [-100, 69], [-80, 70], [-60, 60], [-55, 50],
        [-52, 47], [-60, 43], [-70, 42], [-75, 35], [-80, 25], [-81, 24], [-85, 20], [-90, 19],
        [-97, 18], [-104, 20], [-110, 22], [-115, 30], [-120, 34], [-124, 40], [-125, 48], [-130, 52],
        [-135, 55], [-145, 60], [-160, 60], [-168, 65]
    ],
    // South America (detailed trace)
    [
        [-80, 12], [-75, 10], [-72, 10], [-60, 5], [-50, -5], [-40, -8], [-35, -6], [-38, -15],
        [-45, -23], [-55, -35], [-62, -45], [-70, -53], [-75, -53], [-74, -45], [-70, -35], [-73, -25],
        [-80, -15], [-81, -5], [-81, 5], [-80, 12]
    ],
    // Africa (detailed trace)
    [
        [-17, 32], [-5, 35], [10, 37], [20, 34], [30, 31], [32, 30], [34, 27], [43, 12], [50, 11],
        [45, -5], [40, -15], [33, -30], [25, -34], [18, -34], [12, -22], [13, -15], [8, -5],
        [-10, 5], [-15, 12], [-17, 22], [-17, 32]
    ],
    // Europe & Asia (Eurasia - detailed trace)
    [
        [-10, 60], [-5, 62], [5, 61], [10, 65], [20, 66], [30, 70], [40, 68], [60, 70], [80, 72],
        [100, 73], [120, 73], [140, 72], [160, 70], [170, 66], [180, 65], [170, 60], [160, 50],
        [145, 43], [140, 35], [130, 37], [120, 32], [122, 25], [115, 20], [108, 18], [105, 10],
        [98, 8], [90, 22], [80, 15], [75, 8], [72, 20], [60, 25], [45, 12], [35, 30], [12, 32],
        [-10, 36], [-8, 43], [-10, 50], [-10, 60]
    ],
    // Australia (detailed trace)
    [
        [113, -26], [115, -35], [125, -38], [138, -35], [150, -38], [153, -28], [145, -15], [136, -10],
        [130, -12], [113, -26]
    ]
];

export default function LandingPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });

    // Linear Interpolation in degree space to avoid wild Catmull-Rom wrap-around jumps
    const interpolatePath = (points: Array<[number, number]>, subdivisions: number = 8) => {
        const interpolated = [];
        const len = points.length;
        for (let i = 0; i < len; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % len];

            for (let j = 0; j < subdivisions; j++) {
                const t = j / subdivisions;
                const lon = p1[0] + (p2[0] - p1[0]) * t;
                const lat = p1[1] + (p2[1] - p1[1]) * t;

                const phi = ((lon + 180) / 360) * 2 * Math.PI;
                const theta = ((90 - lat) / 180) * Math.PI;
                interpolated.push({ theta, phi, lon, lat });
            }
        }
        return interpolated;
    };

    // Point in Polygon (Ray-Casting PIP algorithm in clean 2D degree space)
    const isPointInContinent = (lon: number, lat: number, polygon: Array<{ lon: number; lat: number }>) => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].lon, yi = polygon[i].lat;
            const xj = polygon[j].lon, yj = polygon[j].lat;

            const intersect = ((yi > lat) !== (yj > lat))
                && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || 550);
        let height = (canvas.height = canvas.parentElement?.clientHeight || 550);

        const handleResize = () => {
            if (!canvas || !canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener("resize", handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.targetX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            mouseRef.current.targetY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        };
        const handleMouseEnter = () => { mouseRef.current.isHovering = true; };
        const handleMouseLeave = () => {
            mouseRef.current.isHovering = false;
            mouseRef.current.targetX = 0;
            mouseRef.current.targetY = 0;
        };

        const canvasParent = canvas.parentElement;
        canvasParent?.addEventListener("mousemove", handleMouseMove);
        canvasParent?.addEventListener("mouseenter", handleMouseEnter);
        canvasParent?.addEventListener("mouseleave", handleMouseLeave);

        const globeRadius = Math.min(width, height) * 0.38;
        let rotationY = 0;
        let rotationX = 0.3;

        // Generate smooth borders directly from CONTINENT_OUTLINES
        const smoothContinents = CONTINENT_OUTLINES.map(poly => interpolatePath(poly, 8));

        // Generate uniformly distributed points on the sphere (Fibonacci sampling)
        // Check which points land inside continents to draw crosshairs
        const totalPoints = 3000;
        const crosshairPoints: Array<{ x: number; y: number; z: number }> = [];

        for (let i = 0; i < totalPoints; i++) {
            const y = 1 - (i / (totalPoints - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);

            const goldenAngle = Math.PI * (3 - Math.sqrt(5));
            const theta = goldenAngle * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            // Spherical angles
            const latAngle = Math.acos(y);
            let lonAngle = Math.atan2(z, x);

            // Convert to degrees for PIP
            const latDeg = 90 - (latAngle * 180 / Math.PI);
            let lonDeg = (lonAngle * 180 / Math.PI) - 180;
            if (lonDeg < -180) lonDeg += 360;
            if (lonDeg > 180) lonDeg -= 360;

            // Determine if the point is land
            let isLand = false;
            for (const continent of smoothContinents) {
                if (isPointInContinent(lonDeg, latDeg, continent)) {
                    isLand = true;
                    break;
                }
            }

            if (isLand) {
                crosshairPoints.push({ x, y, z });
            }
        }

        // Setup permanent white wireframe grid lines
        const latitudeLines: Array<Array<{ theta: number; phi: number }>> = [];
        for (let lat = -60; lat <= 60; lat += 20) {
            const theta = ((90 - lat) / 180) * Math.PI;
            const line = [];
            for (let lon = -180; lon <= 180; lon += 5) {
                const phi = ((lon + 180) / 360) * 2 * Math.PI;
                line.push({ theta, phi });
            }
            latitudeLines.push(line);
        }

        const longitudeLines: Array<Array<{ theta: number; phi: number }>> = [];
        for (let lon = -180; lon < 180; lon += 30) {
            const phi = ((lon + 180) / 360) * 2 * Math.PI;
            const line = [];
            for (let lat = -80; lat <= 80; lat += 5) {
                const theta = ((90 - lat) / 180) * Math.PI;
                line.push({ theta, phi });
            }
            longitudeLines.push(line);
        }

        // Setup connections
        const arcs: Array<{
            p1: { x: number; y: number; z: number };
            p2: { x: number; y: number; z: number };
            progress: number;
            speed: number;
        }> = [];

        for (let i = 0; i < 15; i++) {
            if (crosshairPoints.length > 2) {
                arcs.push({
                    p1: crosshairPoints[Math.floor(Math.random() * crosshairPoints.length)],
                    p2: crosshairPoints[Math.floor(Math.random() * crosshairPoints.length)],
                    progress: Math.random(),
                    speed: 0.003 + Math.random() * 0.004
                });
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;

            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

            rotationY += 0.015 + (mouseRef.current.x * 0.015);
            rotationX += ((0.3 + mouseRef.current.y * 0.3) - rotationX) * 0.05;

            const cosY = Math.cos(rotationY);
            const sinY = Math.sin(rotationY);
            const cosX = Math.cos(rotationX);
            const sinX = Math.sin(rotationX);

            const projectPoint = (x: number, y: number, z: number) => {
                let x1 = x * cosY - z * sinY;
                let z1 = z * cosY + x * sinY;
                let y2 = y * cosX - z1 * sinX;
                let z2 = z1 * cosX + y * sinX;

                const scale = 400 / (400 + z2 * globeRadius);
                return {
                    x: cx + x1 * globeRadius * scale,
                    y: cy + y2 * globeRadius * scale,
                    z2,
                    scale
                };
            };

            const projectSphereCoords = (theta: number, phi: number) => {
                const x = Math.sin(theta) * Math.cos(phi);
                const y = Math.cos(theta);
                const z = Math.sin(theta) * Math.sin(phi);
                return projectPoint(x, y, z);
            };

            // 1. Draw Globe Base Sphere glow
            const backGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, globeRadius);
            backGlow.addColorStop(0, "rgba(255, 0, 60, 0.03)");
            backGlow.addColorStop(0.85, "rgba(255, 0, 60, 0.08)");
            backGlow.addColorStop(1, "rgba(255, 0, 60, 0.22)");
            ctx.fillStyle = backGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Draw latitude / longitude wireframe rings (permanent)
            ctx.lineWidth = 0.6;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";

            latitudeLines.forEach(line => {
                ctx.beginPath();
                let first = true;
                line.forEach(p => {
                    const pt = projectSphereCoords(p.theta, p.phi);
                    if (pt.z2 < 0.1) {
                        if (first) {
                            ctx.moveTo(pt.x, pt.y);
                            first = false;
                        } else {
                            ctx.lineTo(pt.x, pt.y);
                        }
                    }
                });
                ctx.stroke();
            });

            longitudeLines.forEach(line => {
                ctx.beginPath();
                let first = true;
                line.forEach(p => {
                    const pt = projectSphereCoords(p.theta, p.phi);
                    if (pt.z2 < 0.1) {
                        if (first) {
                            ctx.moveTo(pt.x, pt.y);
                            first = false;
                        } else {
                            ctx.lineTo(pt.x, pt.y);
                        }
                    }
                });
                ctx.stroke();
            });

            // 3. Draw detailed continent border lines (Catmull-Rom smoothed, permanently wrapped in 3D)
            ctx.strokeStyle = "rgba(255, 0, 60, 0.85)";
            ctx.lineWidth = 1.6;

            smoothContinents.forEach(path => {
                let first = true;
                for (let i = 0; i < path.length - 1; i++) {
                    const p1 = path[i];
                    const p2 = path[i + 1];

                    const pt1 = projectSphereCoords(p1.theta, p1.phi);
                    const pt2 = projectSphereCoords(p2.theta, p2.phi);

                    // Draw segment only if both vertices are on the front face
                    if (pt1.z2 < 0.08 && pt2.z2 < 0.08) {
                        if (first) {
                            ctx.beginPath();
                            ctx.moveTo(pt1.x, pt1.y);
                            first = false;
                        }
                        ctx.lineTo(pt2.x, pt2.y);
                        ctx.stroke();
                    } else {
                        first = true;
                    }
                }
            });

            // 4. Draw tiny tactical crosshair lines ('+') inside the continents (uniformly sampled, no polar clustering)
            ctx.strokeStyle = "rgba(255, 0, 60, 0.9)";
            ctx.lineWidth = 1.0;

            crosshairPoints.forEach(p => {
                const pt = projectPoint(p.x, p.y, p.z);
                const isFront = pt.z2 < 0.12;

                if (isFront) {
                    ctx.beginPath();
                    // Draw a little crosshair '+'
                    ctx.moveTo(pt.x - 2, pt.y);
                    ctx.lineTo(pt.x + 2, pt.y);
                    ctx.moveTo(pt.x, pt.y - 2);
                    ctx.lineTo(pt.x, pt.y + 2);
                    ctx.stroke();
                }
            });

            // 5. Draw connection arcs and flashing white nodes
            arcs.forEach(arc => {
                arc.progress += arc.speed;
                if (arc.progress > 1) arc.progress = 0;

                const pt1 = projectPoint(arc.p1.x, arc.p1.y, arc.p1.z);
                const pt2 = projectPoint(arc.p2.x, arc.p2.y, arc.p2.z);

                if (pt1.z2 < 0.15 && pt2.z2 < 0.15) {
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    const mx = (pt1.x + pt2.x) / 2;
                    const my = (pt1.y + pt2.y) / 2 - 35;
                    ctx.quadraticCurveTo(mx, my, pt2.x, pt2.y);

                    ctx.strokeStyle = "rgba(255, 255, 255, 0.28)"; // Thin white network paths
                    ctx.lineWidth = 1.2;
                    ctx.stroke();

                    // Flashing glowing endpoints (drawn as crosses instead of dots)
                    ctx.beginPath();
                    // pt1 cross
                    ctx.moveTo(pt1.x - 3, pt1.y);
                    ctx.lineTo(pt1.x + 3, pt1.y);
                    ctx.moveTo(pt1.x, pt1.y - 3);
                    ctx.lineTo(pt1.x, pt1.y + 3);
                    // pt2 cross
                    ctx.moveTo(pt2.x - 3, pt2.y);
                    ctx.lineTo(pt2.x + 3, pt2.y);
                    ctx.moveTo(pt2.x, pt2.y - 3);
                    ctx.lineTo(pt2.x, pt2.y + 3);
                    
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 1.5;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#ffffff";
                    ctx.stroke();
                    ctx.shadowBlur = 0;

                    // Moving signal data packet (drawn as cross instead of dot)
                    const t = arc.progress;
                    const px = (1 - t) * (1 - t) * pt1.x + 2 * (1 - t) * t * mx + t * t * pt2.x;
                    const py = (1 - t) * (1 - t) * pt1.y + 2 * (1 - t) * t * my + t * t * pt2.y;

                    ctx.beginPath();
                    ctx.moveTo(px - 3, py);
                    ctx.lineTo(px + 3, py);
                    ctx.moveTo(px, py - 3);
                    ctx.lineTo(px, py + 3);
                    
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2.0;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#ffffff";
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            });

            // 6. Draw sphere atmosphere outer glow ring
            const edgeGlow = ctx.createRadialGradient(cx, cy, globeRadius * 0.96, cx, cy, globeRadius * 1.04);
            edgeGlow.addColorStop(0, "rgba(255, 0, 60, 0)");
            edgeGlow.addColorStop(0.5, "rgba(255, 0, 60, 0.38)");
            edgeGlow.addColorStop(1, "rgba(255, 0, 60, 0)");
            ctx.fillStyle = edgeGlow;
            ctx.beginPath();
            ctx.arc(cx, cy, globeRadius * 1.05, 0, Math.PI * 2);
            ctx.fill();

            // Concentric HUD outer tracker arcs
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy, globeRadius * 1.15, 0, Math.PI * 2);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            canvasParent?.removeEventListener("mousemove", handleMouseMove);
            canvasParent?.removeEventListener("mouseenter", handleMouseEnter);
            canvasParent?.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative min-h-screen w-full flex flex-col justify-between items-center text-white overflow-hidden py-16 px-8 z-10">
            
            {/* Control Room Background image representation with desaturated overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-[0.06] grayscale z-0 pointer-events-none" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000')" }}
            />
            
            {/* Solid and radial background bases */}
            <div className="absolute inset-0 bg-[#070708] -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.08)_0%,transparent_75%)] pointer-events-none" />

            {/* Glowing vertical alert light pillars on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-primary/50 to-transparent shadow-[0_0_20px_#ff003c]" />
            <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-primary/50 to-transparent shadow-[0_0_20px_#ff003c]" />

            {/* Metallic Top Bezel Curve Overlay */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent shadow-md" />
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent shadow-md" />

            {/* Glass Bezels Left/Right Wing Panels */}
            <div className="absolute left-16 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block" />
            <div className="absolute right-16 top-16 bottom-16 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block" />

            {/* Top Branding Section */}
            <div className="w-full max-w-6xl z-10 text-center flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                    {/* Shield Logo matching mockup */}
                    <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-[0_0_15px_rgba(255,0,60,0.6)]">
                        <path d="M 50 15 L 80 28 L 80 55 C 80 73 50 86 50 86 C 50 86 20 73 20 55 L 20 28 Z" fill="rgba(8, 8, 10, 0.8)" stroke="#ff003c" strokeWidth="4" />
                        <path d="M 38 60 L 50 44 L 42 44 L 60 25 L 60 46 L 52 46 L 62 60 Z" fill="#ff003c" />
                    </svg>
                    <div className="text-left">
                        <span className="block text-3xl font-black tracking-[0.2em] text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">ARSENAL</span>
                        <span className="block text-[9px] font-bold text-primary tracking-[0.35em] uppercase mt-1.5">STRATEGIC ASSET</span>
                    </div>
                </div>
            </div>

            {/* Main content deck grid */}
            <div className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8">
                
                {/* ── LEFT TITLE DECK (7 cols) ── */}
                <div className="lg:col-span-7 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] uppercase text-white">
                            RED TEAM TOOL<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-rose-600 drop-shadow-[0_0_20px_rgba(255,0,60,0.25)]">
                                DOCUMENTATION
                            </span>
                        </h1>
                        <div className="w-20 h-[3px] bg-primary mx-auto lg:mx-0 shadow-[0_0_8px_#ff003c]" />
                        <p className="max-w-xl text-white/50 text-xs sm:text-sm font-semibold tracking-[0.15em] leading-relaxed uppercase">
                            UNIFIED COMMAND, CONTROL, AND COMMUNICATIONS FOR ADVANCED OPERATIONAL SYNERGY.
                        </p>
                    </div>

                    <p className="max-w-lg text-white/70 text-xs sm:text-sm leading-relaxed font-light font-sans text-center lg:text-left">
                        The military-grade orchestration documentation and command repository. Housing advanced payload models, host discovery maps, automated threat emulation sequences, and secure diagnostics logs.
                    </p>
                </div>

                {/* ── RIGHT GLOBAL NETWORK CANVAS (5 cols) ── */}
                <div className="lg:col-span-5 relative w-full h-[360px] lg:h-[480px] flex justify-center items-center group">
                    <canvas ref={canvasRef} className="w-full h-full max-w-[480px] max-h-[480px] drop-shadow-[0_0_30px_rgba(255,0,60,0.25)]" />
                </div>

            </div>

            {/* Bottom Strategic Access CTA Button */}
            <div className="w-full max-w-6xl z-10 flex justify-center mt-auto mb-2">
                <Link 
                    href="/dashboard"
                    className="group flex items-center justify-center gap-4 bg-gradient-to-b from-[#1b1b1f] via-[#101013] to-[#0a0a0c] border-2 border-primary text-white font-black text-[13px] tracking-[0.3em] hover:shadow-[0_0_40px_rgba(255,0,60,0.4)] transition-all duration-500 uppercase rounded-sm relative overflow-hidden px-14 py-5 shadow-2xl min-w-[350px]"
                >
                    {/* Metallic reflective line animation */}
                    <div className="absolute inset-y-0 left-0 w-4 bg-white/5 skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    
                    {/* Tech corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />
                    
                    {/* Glowing bottom progress indicator bar */}
                    <div className="absolute bottom-[2px] left-[5%] right-[5%] h-[2px] bg-primary/20 overflow-hidden">
                        <div className="h-full bg-primary w-1/3 group-hover:w-full transition-all duration-700" />
                    </div>

                    <span>Go to Documentations</span>
                    <span className="text-primary font-bold text-sm tracking-tighter group-hover:translate-x-1.5 transition-transform duration-300 leading-none">
                        &gt;&gt;
                    </span>
                </Link>
            </div>
            
        </div>
    );
}
