"use client";

export default function ToolBackgroundAnimation() {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none -z-50 overflow-hidden">
            {/* Pure black base */}
            <div className="absolute inset-0 bg-black -z-50" />

            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 -z-40 opacity-30"
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Faint red nebula top-right */}
            <div
                className="absolute -z-30"
                style={{
                    top: 0,
                    right: 0,
                    width: "50vw",
                    height: "50vh",
                    background: "radial-gradient(ellipse 70% 70% at 100% 0%, rgba(255,0,60,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Faint red nebula bottom-left */}
            <div
                className="absolute -z-30"
                style={{
                    bottom: 0,
                    left: 0,
                    width: "40vw",
                    height: "40vh",
                    background: "radial-gradient(ellipse 60% 60% at 0% 100%, rgba(180,0,40,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            {/* Horizontal scanline accent */}
            <div
                className="absolute inset-x-0 top-0 h-px -z-20"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,60,0.3), transparent)" }}
            />
        </div>
    );
}
