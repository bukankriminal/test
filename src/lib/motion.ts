import type { Transition, Variants } from "framer-motion";

/** Movement always uses the same spring so the whole site feels like one system. */
export const spring: Transition = {
  type: "spring",
  stiffness: 170,
  damping: 24,
  mass: 1,
};

/** iOS-style deceleration curve for fades and blur. */
export const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fade: Transition = { duration: 1, ease: easeOut };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      opacity: { duration: 1, ease: easeOut },
      filter: { duration: 1, ease: easeOut },
      y: { type: "spring", stiffness: 170, damping: 24 },
    },
  },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: easeOut } },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};
