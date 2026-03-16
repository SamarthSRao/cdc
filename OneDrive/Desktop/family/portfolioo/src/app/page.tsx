"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import About from "@/components/About";
import Spotify from "@/components/Spotify";
import Visitors from "@/components/Visitors";
import GitHubGraph from "@/components/GitHubGraph";
import Dock from "@/components/Dock";
import Experience from "@/components/Experience";
export default function Home() {
  const [showAbout, setShowAbout] = useState(true);
  const [showExperience, setShowExperience] = useState(true);
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden pb-32">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-40 -z-10" />

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-24 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

        {/* Row 1: About (1), Experience (1), Spotify (1) */}
        <AnimatePresence mode="popLayout">
          {showAbout && (
            <motion.div
              key="about-card"
              className="md:col-span-1"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <About onClose={() => setShowAbout(false)} />
            </motion.div>
          )}
          {showExperience && (
            <motion.div
              key="experience-card"
              className="md:col-span-1"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut", delay: 0.05 }}
            >
              <Experience onClose={() => setShowExperience(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className={(showAbout || showExperience) ? "md:col-span-1" : "md:col-span-3 lg:col-span-1 lg:col-start-3"}>
          <Spotify />
        </div>

        {/* Row 2: Visitors takes up 1 column, GitHub Graph takes up 2 */}
        <div className="md:col-span-1">
          <Visitors />
        </div>
        <div className="md:col-span-2">
          <GitHubGraph />
        </div>

      </div>

      {/* Floating Navigation Dock */}
      <Dock onToggleAbout={() => setShowAbout((prev) => !prev)} />
    </main>
  );
}
