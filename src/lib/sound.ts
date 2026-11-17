/**
 * UI sound engine — Web Audio API only, no audio files, no dependencies.
 *
 * SOUND LIST (edit pitches, lengths and peaks in the `render` switch below)
 *  tick        1800 Hz sine blip, 40 ms ............ hover and focus
 *  tap         320 -> 220 Hz sine thud, 80 ms ...... pointer press
 *  pop         500 -> 900 Hz sine, 120 ms .......... opening / clicking
 *  close       700 -> 380 Hz sine, 120 ms .......... closing
 *  toggle-on   two rising blips .................... unmuting
 *  toggle-off  two falling blips ................... muting
 *  whoosh      300 -> 2500 Hz band-passed noise .... page / section transition
 *  land        soft tick + quiet low sine .......... transition finished
 *  success     880 then 1320 Hz triangle + tail .... Discord copy / success
 *  error       two soft low blips .................. failed action
 *  scroll-tick 1400 Hz sine, 30 ms ................. new section becomes active
 *  intro       220 -> 440 Hz sine swell + whoosh ... page intro
 */

export type SoundName =
  | "tick"
  | "tap"
  | "pop"
  | "close"
  | "toggle-on"
  | "toggle-off"
  | "whoosh"
  | "land"
  | "success"
  | "error"
  | "scroll-tick"
  | "intro";

type Audio = {
  ctx: AudioContext;
  master: GainNode;
};

const MASTER_VOLUME = 0.25;
const RETRIGGER_MS = 60;
const HOVER_COOLDOWN_MS = 120;
const MAX_VOICES = 4;
const STORAGE_KEY = "nv-ui-sounds-muted";

let audio: Audio | null = null;
let muted = readMuted();
let unlocked = false;
let introDone = false;
let voices = 0;

const lastPlayed = new Map<SoundName, number>();
const lastHovered = new Map<SoundName, number>();

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* storage blocked: keep the in-memory state only */
  }
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function coarsePointer() {
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}

/** Lazily builds the single shared context and its soft output chain. */
function getAudio(): Audio | null {
  if (audio) return audio;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  try {
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER_VOLUME;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 6000;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 24;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    master.connect(filter);
    filter.connect(compressor);
    compressor.connect(ctx.destination);

    audio = { ctx, master };
    return audio;
  } catch {
    return null;
  }
}

type ToneOptions = {
  freq: number;
  toFreq?: number;
  type?: "sine" | "triangle";
  at?: number;
  duration: number;
  peak?: number;
  attack?: number;
};

/** One oscillator with a short attack and an exponential decay to silence. */
function tone(
  { ctx, master }: Audio,
  {
    freq,
    toFreq,
    type = "sine",
    at = 0,
    duration,
    peak = 0.2,
    attack = 0.007,
  }: ToneOptions,
) {
  const start = ctx.currentTime + at;
  const jitter = 1 + (Math.random() * 0.04 - 0.02);

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq * jitter, start);
  if (toFreq) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(20, toFreq * jitter),
      start + duration,
    );
  }

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain);
  gain.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
  osc.onended = () => {
    try {
      osc.disconnect();
      gain.disconnect();
    } catch {
      /* already torn down */
    }
  };
}

/** Band-passed white noise sweeping upward, used for whooshes. */
function noiseSweep(
  { ctx, master }: Audio,
  {
    from,
    to,
    at = 0,
    duration,
    peak = 0.16,
  }: { from: number; to: number; at?: number; duration: number; peak?: number },
) {
  const start = ctx.currentTime + at;
  const frames = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.1;
  band.frequency.setValueAtTime(from, start);
  band.frequency.exponentialRampToValueAtTime(to, start + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.07);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(band);
  band.connect(gain);
  gain.connect(master);
  source.start(start);
  source.stop(start + duration + 0.02);
  source.onended = () => {
    try {
      source.disconnect();
      band.disconnect();
      gain.disconnect();
    } catch {
      /* already torn down */
    }
  };
}

/** Builds a sound and returns how long it lasts, in seconds. */
function render(name: SoundName, out: Audio): number {
  switch (name) {
    case "tick":
      tone(out, { freq: 1800, duration: 0.04, peak: 0.14, attack: 0.005 });
      return 0.04;
    case "tap":
      tone(out, { freq: 320, toFreq: 220, duration: 0.08, peak: 0.3 });
      return 0.08;
    case "pop":
      tone(out, { freq: 500, toFreq: 900, duration: 0.12, peak: 0.2 });
      return 0.12;
    case "close":
      tone(out, { freq: 700, toFreq: 380, duration: 0.12, peak: 0.2 });
      return 0.12;
    case "toggle-on":
      tone(out, { freq: 660, duration: 0.07, peak: 0.16 });
      tone(out, { freq: 990, at: 0.07, duration: 0.08, peak: 0.14 });
      return 0.15;
    case "toggle-off":
      tone(out, { freq: 880, duration: 0.07, peak: 0.14 });
      tone(out, { freq: 587, at: 0.07, duration: 0.08, peak: 0.12 });
      return 0.15;
    case "whoosh":
      noiseSweep(out, { from: 300, to: 2500, duration: 0.35 });
      return 0.35;
    case "land":
      tone(out, { freq: 1500, duration: 0.035, peak: 0.09, attack: 0.005 });
      tone(out, { freq: 180, at: 0.01, duration: 0.14, peak: 0.06 });
      return 0.15;
    case "success": {
      const { ctx, master } = out;

      // Short feedback delay for a reverb-like tail on the second note.
      const bus = ctx.createGain();
      const delay = ctx.createDelay(0.5);
      delay.delayTime.value = 0.09;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.25;
      const wet = ctx.createGain();
      wet.gain.value = 0.18;

      bus.connect(master);
      bus.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(wet);
      wet.connect(master);

      const start = ctx.currentTime;
      [880, 1320].forEach((freq, index) => {
        const at = index * 0.12;
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, start + at);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, start + at);
        gain.gain.exponentialRampToValueAtTime(
          index === 0 ? 0.16 : 0.13,
          start + at + 0.01,
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, start + at + 0.3);

        osc.connect(gain);
        gain.connect(bus);
        osc.start(start + at);
        osc.stop(start + at + 0.32);
      });

      window.setTimeout(() => {
        try {
          bus.disconnect();
          delay.disconnect();
          feedback.disconnect();
          wet.disconnect();
        } catch {
          /* already torn down */
        }
      }, 1200);
      return 1.1;
    }
    case "error":
      tone(out, { freq: 300, duration: 0.09, peak: 0.15 });
      tone(out, { freq: 240, at: 0.1, duration: 0.12, peak: 0.13 });
      return 0.22;
    case "scroll-tick":
      tone(out, { freq: 1400, duration: 0.03, peak: 0.06, attack: 0.005 });
      return 0.03;
    case "intro":
      tone(out, { freq: 220, toFreq: 440, duration: 0.6, peak: 0.16, attack: 0.09 });
      noiseSweep(out, { from: 300, to: 2500, at: 0.45, duration: 0.35, peak: 0.1 });
      return 0.8;
  }
}

function start(name: SoundName, out: Audio) {
  const now = performance.now();
  if (now - (lastPlayed.get(name) ?? 0) < RETRIGGER_MS) return;
  if (voices >= MAX_VOICES) return;

  lastPlayed.set(name, now);
  voices += 1;
  const duration = render(name, out);
  window.setTimeout(() => {
    voices = Math.max(0, voices - 1);
  }, duration * 1000 + 120);
}

/** Suspended contexts are resumed on demand; while locked the sound is skipped. */
export function play(name: SoundName) {
  if (muted || typeof window === "undefined") return;
  if (!audio && !unlocked) return;
  if (prefersReducedMotion() && (name === "whoosh" || name === "scroll-tick")) {
    return;
  }
  if (
    coarsePointer() &&
    !["tap", "pop", "close", "toggle-on", "toggle-off", "success", "error", "whoosh"].includes(
      name,
    )
  ) {
    return;
  }

  const out = getAudio();
  if (!out) return;

  if (out.ctx.state === "suspended") {
    void out.ctx
      .resume()
      .then(() => {
        if (!muted && out.ctx.state === "running") start(name, out);
      })
      .catch(() => {
        /* resume blocked until a user gesture */
      });
    return;
  }
  if (out.ctx.state !== "running") return;
  start(name, out);
}

/** Hover tick with its own cooldown, never on touch or reduced-motion. */
function playHover(name: SoundName) {
  if (muted || prefersReducedMotion() || coarsePointer()) return;
  const now = performance.now();
  if (now - (lastHovered.get(name) ?? 0) < HOVER_COOLDOWN_MS) return;
  lastHovered.set(name, now);
  play(name);
}

export function isMuted() {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
  writeMuted(next);
  if (!next) unlocked = true;
  if (!audio) return;

  const { ctx, master } = audio;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setTargetAtTime(next ? 0 : MASTER_VOLUME, now, 0.02);

  if (next) {
    void ctx.suspend().catch(() => {});
  } else {
    void ctx.resume().catch(() => {});
  }
}

const INTERACTIVE = [
  "button",
  "a",
  "[role='button']",
  "[data-sound]",
  "[data-sound-hover]",
  "[data-sound-press]",
  "[data-sound-click]",
].join(",");

type Slot = "hover" | "press" | "click";

function resolve(el: HTMLElement, slot: Slot): SoundName | "none" | null {
  const generic = el.dataset.sound;
  const specific =
    slot === "hover"
      ? el.dataset.soundHover
      : slot === "press"
        ? el.dataset.soundPress
        : el.dataset.soundClick;

  if (specific === "none" || generic === "none") return "none";
  if (specific) return specific as SoundName;
  if (generic) return generic as SoundName;
  return null;
}

function targetFor(node: EventTarget | null) {
  if (!(node instanceof Element)) return null;
  const el = node.closest<HTMLElement>(INTERACTIVE);
  return el;
}

let hovered: HTMLElement | null = null;
let lastSection: string | null = null;
let lastScrollTick = 0;
let landTimer = 0;

/**
 * Wires the interaction map through document-level delegation and the section
 * observer. Returns a cleanup function; safe to call in any browser.
 */
export function initSound() {
  if (typeof window === "undefined") return () => {};

  const mountedAt = performance.now();

  const unlock = () => {
    if (muted) return;
    unlocked = true;
    const out = getAudio();
    if (out && out.ctx.state === "suspended") {
      void out.ctx.resume().catch(() => {});
    }
    // The intro swell only makes sense while the hero is still settling.
    if (!introDone && performance.now() - mountedAt < 900) {
      introDone = true;
      play("intro");
    }
  };

  const onPointerOver = (event: PointerEvent) => {
    const el = targetFor(event.target);
    if (!el || el === hovered) return;
    hovered = el;
    const sound = resolve(el, "hover") ?? "tick";
    if (sound !== "none") playHover(sound);
  };

  const onPointerOut = (event: PointerEvent) => {
    const el = targetFor(event.target);
    if (el && el === hovered && !el.contains(event.relatedTarget as Node | null)) {
      hovered = null;
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    unlock();
    const el = targetFor(event.target);
    if (!el) return;
    const sound = resolve(el, "press") ?? "tap";
    if (sound !== "none") play(sound);
  };

  const onClick = (event: MouseEvent) => {
    const el = targetFor(event.target);
    if (!el) return;

    const explicit = resolve(el, "click");
    if (explicit === "none") return;

    const anchor = el.closest<HTMLAnchorElement>("a[href]");
    const isSectionLink = anchor?.getAttribute("href")?.startsWith("#") ?? false;
    const sound: SoundName = explicit ?? (isSectionLink ? "whoosh" : "pop");

    play(sound);

    if (sound === "whoosh" && !prefersReducedMotion()) {
      window.clearTimeout(landTimer);
      landTimer = window.setTimeout(() => play("land"), 700);
    }
  };

  const onFocusIn = (event: FocusEvent) => {
    const el = targetFor(event.target);
    if (!el || coarsePointer()) return;
    if (!el.matches(":focus-visible")) return;
    play("tick");
  };

  const onKeyDown = (event: KeyboardEvent) => {
    unlock();
    if (event.repeat) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    const el = targetFor(event.target);
    if (!el) return;
    const sound = resolve(el, "press") ?? "tap";
    if (sound !== "none") play(sound);
  };

  const onVisibility = () => {
    if (!audio) return;
    if (document.hidden) {
      void audio.ctx.suspend().catch(() => {});
    } else if (!muted) {
      void audio.ctx.resume().catch(() => {});
    }
  };

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("section[id]"),
  );
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      if (id === lastSection) return;
      lastSection = id;
      const now = performance.now();
      if (now - lastScrollTick < 400) return;
      lastScrollTick = now;
      play("scroll-tick");
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] },
  );
  sections.forEach((section) => observer.observe(section));

  document.addEventListener("pointerover", onPointerOver, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("click", onClick);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("touchend", unlock, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    observer.disconnect();
    window.clearTimeout(landTimer);
    document.removeEventListener("pointerover", onPointerOver);
    document.removeEventListener("pointerout", onPointerOut);
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("click", onClick);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("touchend", unlock);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
