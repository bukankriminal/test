import { GlassPanel } from "./GlassPanel";
import { Reveal } from "./Reveal";

type Entry = {
  year: string;
  title: string;
  body: string;
};

const TIMELINE: Entry[] = [
  {
    year: "2020",
    title: "Started video editing",
    body: "Began editing videos and learning the basics of pacing, cuts and transitions.",
  },
  {
    year: "2021",
    title: "Learning jedag jedug",
    body: "Started learning the Indonesian editing style called jedag jedug: fast beat-synced cuts, flashes and shake effects.",
  },
  {
    year: "2022 - 2023",
    title: "Learning twixtor edits",
    body: "Learned how to make twixtor edits and practiced by editing Marvel films, DC films and other movies for TikTok.",
  },
  {
    year: "2023 - 2024",
    title: "Learning motion graphics",
    body: "Learned how to build mograph: animated typography, shapes and clean motion design.",
  },
  {
    year: "2025",
    title: "Learning long-form editing",
    body: "Learned how to edit long-form video, YouTube videos and shorts.",
  },
  {
    year: "2026",
    title: "Learning Premiere Pro and other tools",
    body: "Moving into Adobe Premiere Pro and other professional editing tools.",
  },
];

export function Experience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-28 px-5 pb-24 pt-0 sm:px-8 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            Experience
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] text-white/95">
            Still learning,{" "}
            <span className="text-white/45">always editing.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-10">
          <GlassPanel className="p-7 sm:p-10 lg:p-12">
            <ol className="relative ml-1 space-y-8 border-l border-white/12 pl-7 sm:space-y-9 sm:pl-8">
              {TIMELINE.map((entry, index) => {
                const current = index === TIMELINE.length - 1;

                return (
                  <li key={entry.year} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[33px] top-[3px] flex h-2.5 w-2.5 items-center justify-center sm:-left-[37px]"
                    >
                      {current && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/60 motion-reduce:animate-none" />
                      )}
                      <span
                        className={
                          current
                            ? "relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300"
                            : "relative inline-flex h-2.5 w-2.5 rounded-full bg-white/30"
                        }
                      />
                    </span>

                    <Reveal delay={index * 0.04}>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
                        {entry.year}
                      </p>
                      <h3 className="mt-2 text-lg font-light tracking-[-0.03em] text-white/90 sm:text-xl">
                        {entry.title}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
                        {entry.body}
                      </p>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
