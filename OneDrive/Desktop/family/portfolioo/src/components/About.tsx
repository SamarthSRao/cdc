"use client";

import { Twitter, Github, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function About({ onClose }: { onClose?: () => void }) {
  return (
    <motion.div 
      id="about" 
      drag 
      dragMomentum={false}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      initial={{ zIndex: 10 }}
      className="glass rounded-2xl p-6 flex flex-col h-full relative overflow-hidden cursor-grab active:cursor-grabbing bg-background/50 backdrop-blur-xl"
    >
      {/* Top Window Bar */}
      <div className="flex items-center justify-between w-full mb-8 z-10 relative">
        <div className="flex items-center gap-1.5 z-10">
          <button onClick={onClose} className="w-2.5 h-2.5 rounded-full flex-none bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors duration-150 cursor-pointer outline-none" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <p className="text-[10px] font-mono text-foreground/50 tracking-widest absolute left-1/2 -translate-x-1/2 uppercase">
          about
        </p>
      </div>

      {/* Hero Text */}
      <div className="flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          Samarth S
        </h1>
        <p className="text-xs font-mono text-foreground/50 tracking-widest uppercase mb-8">
          Backend Developer
        </p>

        {/* Biography */}
        <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
          Building distributed systems and backend systems.
          I am a student at the University of Waterloo, currently pursuing a degree in Computer Science.
          I am passionate about building scalable and reliable software systems.
          I am also a member of the WaterlooACM and the WaterlooAI clubs, where I participate in hackathons and coding competitions.
        </p>
      </div>

      {/* Footer */}
      <div className="w-full h-[1px] bg-border my-6" />

      <div className="flex items-center justify-between w-full mt-auto">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/identicons/samarth.png"
            alt="Avatar"
            className="w-10 h-10 rounded-lg object-cover bg-foreground/10"
          />
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold uppercase">Samarth S</span>
            <span className="text-[10px] font-mono text-foreground/50 flex items-center gap-1 uppercase">
              <MapPin size={10} /> Waterloo, ON
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">
            <Github size={18} />
          </a>
          <a href="#" className="text-foreground/50 hover:text-foreground transition-colors">
            <Twitter size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}