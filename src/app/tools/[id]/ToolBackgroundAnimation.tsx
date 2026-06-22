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

        // Matrix code/binary streams
        const fontSize = 10;
        const columns = Math.floor(width / fontSize);
        const drops: number[] = Array(columns).fill(1);

        // Slowing down the speed of matrix drops
        let lastTime = 0;
        const fpsInterval = 1000 / 20; // 20 FPS for Matrix rain to keep it slow and non-distracting

        const draw = (timestamp: number) => {
            // Ambient pulsing lights drawn behind matrix code
            ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
            ctx.fillRect(0, 0, width, height);

            if (timestamp - lastTime > fpsInterval) {
                lastTime = timestamp;

                ctx.fillStyle = "rgba(255, 0, 60, 0.05)"; // Ultra low opacity crimson
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                    // Random binary or hex digit
                    const text = Math.random() > 0.5 ? "0" : "1";
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    ctx.fillText(text, x, y);

                    // Reset drops when they reach bottom
                    if (y > height && Math.random() > 0.975) {
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
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            {/* Dark background base */}
            <div className="absolute inset-0 bg-[#070708] -z-20" />
            
            {/* The matrix binary rain canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 -z-10" />

            {/* Glowing tactical grids */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] -z-10" />

            {/* Red tactical overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-primary/[0.015] to-[#0a0a0a] -z-10" />

            {/* Floating blurred red orbs */}
            <div className="absolute top-1/4 left-1/12 w-[35rem] h-[35rem] bg-primary/[0.03] blur-[150px] rounded-full animate-[pulse_10s_ease-in-out_infinite] -z-10" />
            <div className="absolute bottom-1/4 right-1/12 w-[35rem] h-[35rem] bg-primary/[0.025] blur-[150px] rounded-full animate-[pulse_12s_ease-in-out_infinite] delay-1000 -z-10" />
        </div>
    );
}
