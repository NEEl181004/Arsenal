"use client";

import { useEffect, useRef } from "react";

export default function DashboardMeshAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
        let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

        const handleResize = () => {
            if (!canvas || !canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener("resize", handleResize);

        const rows = 12;
        const cols = 20;
        let offset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = "rgba(255, 0, 60, 0.12)";
            ctx.lineWidth = 1;

            offset += 0.015;

            // Draw horizontal lines with wave effect
            for (let r = 0; r < rows; r++) {
                ctx.beginPath();
                for (let c = 0; c < cols; c++) {
                    const x = (c / (cols - 1)) * width;
                    // Project grid into 3D perspective
                    const yBase = (r / (rows - 1)) * height;
                    const z = Math.sin(c * 0.4 + offset) * Math.cos(r * 0.3 + offset) * 15;
                    const y = yBase + z + (height - yBase) * 0.15; // perspective tilt

                    if (c === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            // Draw vertical lines
            for (let c = 0; c < cols; c++) {
                ctx.beginPath();
                for (let r = 0; r < rows; r++) {
                    const x = (c / (cols - 1)) * width;
                    const yBase = (r / (rows - 1)) * height;
                    const z = Math.sin(c * 0.4 + offset) * Math.cos(r * 0.3 + offset) * 15;
                    const y = yBase + z + (height - yBase) * 0.15;

                    if (r === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            // Draw floating glowing coordinate points
            ctx.fillStyle = "rgba(255, 0, 60, 0.6)";
            for (let i = 0; i < 5; i++) {
                const cIndex = Math.floor((Math.sin(offset + i) * 0.5 + 0.5) * cols);
                const rIndex = Math.floor((Math.cos(offset * 0.5 + i) * 0.5 + 0.5) * rows);
                const x = (cIndex / (cols - 1)) * width;
                const yBase = (rIndex / (rows - 1)) * height;
                const z = Math.sin(cIndex * 0.4 + offset) * Math.cos(rIndex * 0.3 + offset) * 15;
                const y = yBase + z + (height - yBase) * 0.15;

                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Ring glow
                ctx.strokeStyle = "rgba(255, 0, 60, 0.2)";
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.stroke();
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
        <canvas ref={canvasRef} className="w-full h-full min-h-[140px] max-h-[220px]" />
    );
}
