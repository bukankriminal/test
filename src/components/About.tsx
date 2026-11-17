import { GlassPanel } from "./GlassPanel";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "1.2 yrs", label: "Minecraft cinematic" },
  { value: "2020", label: "Editing video since" },
];

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            About
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] text-white/95">
            Edits that feel{" "}
            <span className="text-white/45">cinematic.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <GlassPanel className="p-7 sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-14">
              <div className="space-y-5 text-[15px] leading-relaxed text-white/65 sm:text-base">
                <p>
                  I'm Allen Putra — Al here, NVY online. I've spent about 1.2
                  years making Minecraft cinematics, and I've been editing video
                  since 2020.
                </p>
                <p>
                  Alongside editing I do light GFX and a bit of vibecoding. I
                  keep learning new tools and styles as I go.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {STATS.map((stat) => (
                  <GlassPanel
                    key={stat.value}
                    className="flex items-center justify-between gap-6 rounded-full px-6 py-4"
                  >
                    <span className="text-xl font-light tracking-[-0.03em] text-white sm:text-2xl">
                      {stat.value}
                    </span>
                    <span className="text-right text-xs leading-snug text-white/50">
                      {stat.label}
                    </span>
                  </GlassPanel>
                ))}
              </div>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
