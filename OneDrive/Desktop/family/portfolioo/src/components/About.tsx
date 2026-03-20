"use client";

import { Twitter, Github, MapPin, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export default function About({ onClose }: { onClose?: () => void }) {
  return (
    <motion.div
      id="about"
      drag={typeof window !== 'undefined' && window.innerWidth > 768}
      dragMomentum={false}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      initial={{ zIndex: 10 }}
      className="w-full md:w-[490px] md:h-[415px] flex flex-col relative overflow-hidden md:cursor-grab active:cursor-grabbing bg-transparent md:backdrop-blur-3xl md:bg-[#111111] md:rounded-[10px] md:border md:border-white/[0.08] md:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_0_0.5px_rgb(0,0,0)]"
    >
      {/* Top Windows/Mac OS Bar - Hidden on mobile */}
      <div className="hidden md:flex flex-none items-center h-8 px-4 border-b border-white/[0.05] relative select-none">
        <div className="flex items-center gap-1.5 z-10">
          <button onClick={onClose} className="w-2.5 h-2.5 rounded-full flex-none bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors duration-150 cursor-pointer outline-none" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
        </div>
        <p className="text-[9px] font-mono text-white/40 tracking-[0.2em] absolute left-1/2 -translate-x-1/2 uppercase pointer-events-none">
          ABOUT
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-sans scrollbar-hide bg-transparent md:bg-[#1a1a1a]/40">
        <section className="opacity-100">


          <div className="flex-grow mb-4  ">
            <h1 className="text-5xl md:text-3xl font-bold tracking-tight mb-1 text-white/90">
              Samarth S Rao
            </h1>

            <p className="text-[10px] text-white/40 tracking-widest uppercase mb-9 ">
              Backend Developer
            </p>
            <div className="w-full h-[1px] bg-white/[0.06] my-8" />
            <div className="text-white/70 leading-relaxed text-sm md:text-sm space-y-4 mb-25">
              <p>
                currently learning how distributed systems work,

                exploring backend systems and database internals in depth.
              </p>

            </div>
          </div>

          <div className="w-full h-[1px] bg-white/[0.06] my-8" />

          <div className="flex items-center justify-between w-full mt-auto">
            <div className="flex items-center gap-3">
              <img
                src="https://github.com/identicons/samarth.png"
                alt="Avatar"
                className="w-10 h-10 rounded-lg object-cover bg-white/5"
              />
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold uppercase text-white/90">Samarth S Rao</span>
                <span className="text-[10px] font-mono text-white/40 flex items-center gap-1 uppercase">
                  <MapPin size={10} /> Bengaluru, India
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="https://github.com/SamarthSRao" className="text-white/40 hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" className="text-white/40 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </section>
      </div >
    </motion.div >
  );
}