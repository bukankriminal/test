import { motion, useReducedMotion } from "framer-motion";

type Blob = {
  className: string;
  background: string;
  animate: { x: number[]; y: number[]; scale: number[] };
  duration: number;
};

const blobs: Blob[] = [
  {
    className: "-top-[26vmax] -left-[20vmax] h-[64vmax] w-[64vmax]",
    background:
      "radial-gradient(circle at center, rgba(47,107,255,0.55) 0%, rgba(47,107,255,0) 64%)",
    animate: { x: [0, 130, -50, 0], y: [0, 80, -60, 0], scale: [1, 1.16, 0.95, 1] },
    duration: 34,
  },
  {
    className: "-top-[20vmax] -right-[24vmax] h-[58vmax] w-[58vmax]",
    background:
      "radial-gradient(circle at center, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 66%)",
    animate: { x: [0, -110, 40, 0], y: [0, 120, -40, 0], scale: [1.04, 0.92, 1.12, 1.04] },
    duration: 40,
  },
  {
    className: "-bottom-[30vmax] left-[2vmax] h-[56vmax] w-[56vmax]",
    background:
      "radial-gradient(circle at center, rgba(236,72,153,0.42) 0%, rgba(236,72,153,0) 66%)",
    animate: { x: [0, 90, -70, 0], y: [0, -70, 40, 0], scale: [1, 1.1, 0.94, 1] },
    duration: 30,
  },
  {
    className: "-bottom-[26vmax] -right-[16vmax] h-[52vmax] w-[52vmax]",
    background:
      "radial-gradient(circle at center, rgba(20,184,166,0.38) 0%, rgba(20,184,166,0) 66%)",
    animate: { x: [0, -80, 60, 0], y: [0, -60, 70, 0], scale: [1, 1.14, 0.92, 1] },
    duration: 44,
  },
];

export function MeshBackground() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#07070b]" />

      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-[90px] will-change-transform ${blob.className}`}
          style={{ background: blob.background }}
          animate={reduced ? undefined : blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Depth: grattop glow, edge vignette, then grain. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(120,140,255,0.14),rgba(7,7,11,0)_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(110%_110%_at_50%_40%,rgba(7,7,11,0)_30%,rgba(7,7,11,0.62)_100%)]" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
