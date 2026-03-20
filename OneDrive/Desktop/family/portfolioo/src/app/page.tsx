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
      <Books />

      {/* Main Workspace Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-24 px-4 sm:px-8 h-[calc(100vh-160px)] pointer-events-none">
        
        {/* Top Right Corner: Calendar */}
        <div className="absolute top-24 right-4 sm:right-8 w-64 pointer-events-auto">
          <Calendar />
        </div>

        {/* Bottom Left Corner: Spotify */}
        <div className="absolute bottom-16 left-4 sm:left-8 w-[272px] pointer-events-auto">
          <Spotify />
        </div>

        {/* Bottom Right Corner: Git (GitHub Graph) */}
        <div className="absolute bottom-16 right-4 sm:right-8 w-[500px] pointer-events-auto">
          <GitHubGraph />
        </div>

        {/* Center Slot: All Dock Components (About, Experience, etc.) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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

      {/* Floating Navigation Dock */}
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
    </main>
  );
}
