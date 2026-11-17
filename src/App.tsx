import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { MeshBackground } from "./components/MeshBackground";
import { CursorGlow } from "./components/CursorGlow";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { SoundToggle } from "./components/SoundToggle";
import { initSound } from "./lib/sound";

export default function App() {
  useEffect(() => initSound(), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-svh overflow-x-clip bg-[#07070b]">
        <MeshBackground />
        <CursorGlow />
        <Navbar />

        <main className="relative z-10">
          <Hero />
          <Marquee />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>

        <SoundToggle />
      </div>
    </MotionConfig>
  );
}
