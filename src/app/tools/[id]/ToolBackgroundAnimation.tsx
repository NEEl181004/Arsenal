"use client";

import { useEffect, useRef } from "react";

export default function ToolBackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        const fontSize = 12;
        const columns = Math.floor(width / fontSize);
        // Track the current y position for each column
        const drops: number[] = Array(columns).fill(1);

        let lastTime = 0;
        const fpsInterval = 1000 / 15; // Slow 15 FPS to be subtle

        const draw = (timestamp: number) => {
            if (timestamp - lastTime > fpsInterval) {
                lastTime = timestamp;

                // Clear with transparent color to keep background transparent
                ctx.clearRect(0, 0, width, height);

                ctx.fillStyle = "rgba(255, 0, 60, 0.08)"; // Very subtle red
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = Math.random() > 0.5 ? "0" : "1";
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    if (y > height && Math.random() > 0.98) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none -z-50 overflow-hidden">
            {/* Dark background base */}
            <div className="absolute inset-0 bg-[#060608] -z-50" />
            
            {/* The matrix binary rain canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 -z-40" />

            {/* Glowing tactical grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] -z-30" />

            {/* Red tactical overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-primary/[0.01] to-[#0a0a0a] -z-20" />

            {/* Floating blurred red orbs */}
            <div className="absolute top-1/4 left-1/10 w-[30rem] h-[30rem] bg-primary/[0.02] blur-[150px] rounded-full animate-pulse -z-20" />
            <div className="absolute bottom-1/4 right-1/10 w-[30rem] h-[30rem] bg-primary/[0.015] blur-[150px] rounded-full animate-pulse -z-20" />
        </div>
    );
}
