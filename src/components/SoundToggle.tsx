import { useState } from "react";
import { GlassPanel } from "./GlassPanel";
import { isMuted, play, setMuted } from "../lib/sound";

function SpeakerOnIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6.5 9H4v6h2.5L11 19V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6.5 9H4v6h2.5L11 19V5Z" />
      <path d="m16 9.5 5 5" />
      <path d="m21 9.5-5 5" />
    </svg>
  );
}

/** Small glass mute toggle for the UI sounds, persisted in localStorage. */
export function SoundToggle() {
  const [muted, setLocalMuted] = useState(isMuted);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setLocalMuted(next);
    if (!next) play("toggle-on");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] sm:bottom-7 sm:right-7">
      <GlassPanel
        as="button"
        type="button"
        aria-label="UI sounds"
        aria-pressed={!muted}
        data-sound="none"
        onClick={toggle}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-0 text-white/70 transition-colors duration-300 hover:text-white"
      >
        {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </GlassPanel>
    </div>
  );
}
