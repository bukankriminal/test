import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "../lib/motion";
import { cx } from "../lib/cx";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

/**
 * Fades/blurs/slides content in when it enters the viewport and softly back
 * out when it leaves. Only opacity, transform and blur are animated.
 */
export function Reveal({ children, className, delay = 0, amount = 0.2 }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cx(className)}
      initial={{ opacity: 0, y: reduced ? 0 : 26, filter: reduced ? "blur(0px)" : "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, amount, margin: "0px 0px -8% 0px" }}
      transition={
        reduced
          ? { duration: 0.6, ease: easeOut, delay }
          : {
              opacity: { duration: 1, ease: easeOut, delay },
              filter: { duration: 1, ease: easeOut, delay },
              y: { type: "spring", stiffness: 170, damping: 24, delay },
            }
      }
    >
      {children}
    </motion.div>
  );
}
