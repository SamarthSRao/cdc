"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import About from "@/components/About";
import Spotify from "@/components/Spotify";
import GitHubGraph from "@/components/GitHubGraph";
import Dock from "@/components/Dock";
import Experience from "@/components/Experience";
import Header from "@/components/header";
import Books from "@/components/books";
import Project from "@/components/Projects";
import Contact from "@/components/Contact";
import Resume from "@/components/Resume";
import Calendar from "@/components/Calendar";

export default function Home() {
  const [showAbout, setShowAbout] = useState(true);
  const [showExperience, setShowExperience] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showResume, setShowResume] = useState(false);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden pb-32">
      <Header />
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-40 -z-10" />

      {/* Background/Utility Widgets */}
      <div className="hidden md:block">
        <Books />
      </div>

      {/* Main Workspace Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-24 px-4 sm:px-8 md:h-[calc(100vh-160px)]">
        
        {/* Desktop Widgets (Hidden on Mobile) */}
        <div className="hidden md:block absolute top-24 right-4 sm:right-8 w-64 pointer-events-auto">
          <Calendar />
        </div>
        <div className="hidden md:block absolute bottom-16 left-4 sm:left-8 w-[272px] pointer-events-auto">
          <Spotify />
        </div>
        <div className="hidden md:block absolute bottom-16 right-4 sm:right-8 w-[500px] pointer-events-auto">
          <GitHubGraph />
        </div>

        {/* Mobile View: Vertical Scrollable List */}
        <div className="flex md:hidden flex-col gap-12 pb-24">
          <section id="about-section">
            <About />
          </section>
          <div className="w-full h-px bg-white/5" />
          <section id="experience-section">
            <Experience />
          </section>
          <div className="w-full h-px bg-white/5" />
          <section id="projects-section">
            <Project />
          </section>
          <div className="w-full h-px bg-white/5" />
          <section id="contact-section">
            <Contact />
          </section>
          <div className="w-full h-px bg-white/5" />
          <section id="resume-section">
            <Resume />
          </section>
        </div>

        {/* Desktop View: Center Slot for Windows */}
        <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
          <div className="pointer-events-auto relative flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {showAbout && (
                <motion.div
                  key="about-card"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="z-50"
                >
                  <About onClose={() => setShowAbout(false)} />
                </motion.div>
              )}
              {showExperience && (
                <motion.div
                  key="experience-card"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="z-50"
                >
                  <Experience onClose={() => setShowExperience(false)} />
                </motion.div>
              )}
              {showProjects && (
                <motion.div
                  key="projects-card"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="z-50"
                >
                  <Project onClose={() => setShowProjects(false)} />
                </motion.div>
              )}
              {showContact && (
                <motion.div
                  key="contact-card"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="z-50"
                >
                  <Contact onClose={() => setShowContact(false)} />
                </motion.div>
              )}
              {showResume && (
                <motion.div
                  key="resume-card"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="z-50"
                >
                  <Resume onClose={() => setShowResume(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Navigation Dock - Hidden on Mobile */}
      <div className="hidden md:block">
        <Dock
          onToggleAbout={() => setShowAbout((prev) => !prev)}
          onToggleExperience={() => setShowExperience((prev) => !prev)}
          onToggleProjects={() => setShowProjects((prev) => !prev)}
          onToggleContact={() => setShowContact((prev) => !prev)}
          onToggleResume={() => setShowResume((prev) => !prev)}
          activeAbout={showAbout}
          activeExperience={showExperience}
          activeProjects={showProjects}
          activeContact={showContact}
          activeResume={showResume}
        />
      </div>
    </main>
  );
}
