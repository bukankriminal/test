import { motion, useReducedMotion } from "framer-motion";
import { GlassButton, GlassPanel } from "./GlassPanel";
import { fadeUp, staggerParent } from "../lib/motion";
import { scrollToSection } from "../lib/scroll";

function ArrowRight() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const go = (id: string) => scrollToSection(id, reduced ?? false);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-28 items-center justify-center px-5 pb-20 pt-32 sm:px-8 sm:pb-24"
    >
      <motion.div
        className="mx-auto w-full max-w-4xl text-center"
        variants={staggerParent}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="mb-7 flex justify-center">
          <GlassPanel className="flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.02em] text-white/70 sm:text-xs">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            Available for select projects — 2026
          </GlassPanel>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="bg-[linear-gradient(180deg,#ffffff_30%,rgba(255,255,255,0.68)_100%)] bg-clip-text text-[clamp(3rem,11vw,7rem)] font-light leading-[0.92] tracking-[-0.03em] text-transparent"
        >
          Allen Putra
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60 sm:mt-7 sm:text-lg sm:leading-relaxed"
        >
          Minecraft cinematic creator and video editor — editing since 2020,
          with light GFX and a little vibecoding on the side.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-3.5"
        >
          <GlassButton
            variant="primary"
            size="lg"
            onClick={() => go("skills")}
            data-sound-click="whoosh"
            className="w-full sm:w-auto"
          >
            See my skills
            <ArrowRight />
          </GlassButton>
          <GlassButton
            size="lg"
            onClick={() => go("contact")}
            data-sound-click="whoosh"
            className="w-full sm:w-auto"
          >
            Get in touch
          </GlassButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
