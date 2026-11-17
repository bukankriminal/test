const WORDS = ["Minecraft Cinematic", "Video Editing", "GFX", "Vibecode"];

function WordGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12"
    >
      {WORDS.map((word) => (
        <span key={word} className="flex items-center gap-8 sm:gap-12">
          <span className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.28em] text-white/35 sm:text-base">
            {word}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-5 sm:py-6">
      <div className="marquee-track flex w-max">
        <WordGroup />
        <WordGroup hidden />
      </div>
    </div>
  );
}
