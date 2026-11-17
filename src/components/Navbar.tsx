import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "./GlassPanel";
import { scrollToSection } from "../lib/scroll";
import { easeOut, spring } from "../lib/motion";
import { cx } from "../lib/cx";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setActive(id);
    scrollToSection(id, reduced ?? false);
  };

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
      initial={{ opacity: 0, y: -18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.1, ease: easeOut, delay: 0.08 }}
    >
      <motion.div
        className="pointer-events-auto"
        animate={{ scale: scrolled ? 0.96 : 1, y: scrolled ? -1 : 0 }}
        transition={spring}
      >
        <GlassPanel
          as="nav"
          aria-label="Primary"
          className={cx(
            "flex items-center gap-0.5 rounded-full p-1.5",
            "transition-[background-color,border-color,box-shadow] duration-500",
            scrolled && "border-white/25",
          )}
        >
          <motion.span
            aria-hidden
            className="nav-frost pointer-events-none absolute inset-0 rounded-full"
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          />
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link.id)}
                data-sound-click="whoosh"
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "relative rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight sm:px-4 sm:text-sm",
                  "transition-colors duration-300",
                  isActive ? "text-white" : "text-white/60 hover:text-white/90",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="glass-pill absolute inset-0 rounded-full"
                    transition={reduced ? { duration: 0 } : spring}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
