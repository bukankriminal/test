import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "./GlassPanel";
import { Reveal } from "./Reveal";
import { easeOut } from "../lib/motion";

type Skill = {
  name: string;
  note: string;
  level: number;
};

const SKILLS: Skill[] = [
  { name: "Minecraft Cinematic", note: "1.2 yrs", level: 62 },
  { name: "Video Editing", note: "since 2020", level: 85 },
  { name: "GFX", note: "basic", level: 38 },
  { name: "Vibecoding", note: "basic", level: 34 },
];

export function Skills() {
  const reduced = useReducedMotion();

  return (
    <section
      id="skills"
      className="relative scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            Skills
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] text-white/95">
            Skills I keep,{" "}
            <span className="text-white/45">building.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <GlassPanel className="p-7 sm:p-10">
            <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {SKILLS.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-sm font-medium tracking-[-0.01em] text-white/85 sm:text-[15px]">
                      {skill.name}
                    </p>
                    <p className="text-[11px] text-white/40">{skill.note}</p>
                  </div>

                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full origin-left rounded-full"
                      style={{
                        width: `${skill.level}%`,
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.88), rgba(255,255,255,0.34))",
                      }}
                      initial={{ scaleX: reduced ? 1 : 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false, amount: 0.6 }}
                      transition={{
                        duration: 1.6,
                        ease: easeOut,
                        delay: index * 0.12,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
