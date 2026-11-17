import { useState } from "react";
import { play } from "../lib/sound";
import { GlassPanel } from "./GlassPanel";
import { Reveal } from "./Reveal";

const SOCIALS = [
  { label: "WhatsApp", href: "https://wa.me/6289675664040" },
  { label: "Instagram", href: "https://instagram.com/aproudindonesia" },
  { label: "TikTok", href: "https://tiktok.com/@user1431414251" },
];

const DISCORD = "sdrkematian";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
      play("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-28 px-5 pb-12 pt-24 sm:px-8 sm:pb-16 sm:pt-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <GlassPanel
            tone="strong"
            className="overflow-hidden p-7 sm:p-10 lg:p-14"
          >
            <div className="grid gap-10 lg:grid-cols-[1.25fr_auto] lg:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
                  Contact
                </p>
                <h2 className="mt-4 max-w-xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] text-white/95">
                  Let's make something{" "}
                  <span className="text-white/45">worth watching.</span>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
                  Open to Minecraft cinematic work, video edits and GFX
                  collaborations.
                </p>

                <a
                  href="https://wa.me/6289675664040"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-sound-click="pop"
                  className="mt-8 inline-flex items-center gap-2 text-base font-medium tracking-[-0.01em] text-white/90 transition-colors duration-300 hover:text-white sm:text-lg"
                >
                  +62 896-7566-4040
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
                    <path d="M5 11L11 5M11 5H5.5M11 5v5.5" />
                  </svg>
                </a>
              </div>

              <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                {SOCIALS.map((social) => (
                  <GlassPanel
                    key={social.label}
                    as="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-sound-click="pop"
                    className="rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition-colors duration-300 hover:text-white"
                  >
                    {social.label}
                  </GlassPanel>
                ))}
                <GlassPanel
                  as="button"
                  type="button"
                  onClick={copyDiscord}
                  data-sound-click="success"
                  className="cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium text-white/70 transition-colors duration-300 hover:text-white"
                >
                  Discord
                </GlassPanel>
                <span
                  aria-live="polite"
                  className={
                    copied
                      ? "text-[11px] text-white/45 opacity-100 transition-opacity duration-300"
                      : "text-[11px] text-white/45 opacity-0 transition-opacity duration-300"
                  }
                >
                  Copied {DISCORD}
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-white/35 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Allen Putra (NVY). All rights reserved.</p>
              <p>Minecraft cinematics, edits and light GFX.</p>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </section>
  );
}
