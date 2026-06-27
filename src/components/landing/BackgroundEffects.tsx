"use client";

export default function BackgroundEffects() {
  return (
    <>
      {/* Top-right large red nebula — most prominent glow per reference */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "-120px",
          right: "-80px",
          width: "680px",
          height: "680px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,0,40,0.22) 0%, rgba(180,0,30,0.12) 35%, transparent 68%)",
          filter: "blur(60px)",
        }}
      />

      {/* Secondary mid-right glow */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: "25%",
          right: "8%",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,0,35,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Bottom-left subtle ambient */}
      <div
        className="pointer-events-none fixed"
        style={{
          bottom: "-60px",
          left: "-40px",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,0,25,0.07) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Very subtle scanlines for texture */}
      <div className="scanlines pointer-events-none fixed inset-0 opacity-[0.025]" />
    </>
  );
}