import { useEffect, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { easeOut } from "../lib/motion";

const SIZE = 560;

export function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 28, mass: 0.5 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x.set(event.clientX - SIZE / 2);
      y.set(event.clientY - SIZE / 2);
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
    };
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden rounded-full mix-blend-screen md:block"
      style={{
        x,
        y,
        width: SIZE,
        height: SIZE,
        background:
          "radial-gradient(circle, rgba(160,178,255,0.18) 0%, rgba(150,168,255,0.07) 38%, rgba(150,168,255,0) 70%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: easeOut }}
    />
  );
}
