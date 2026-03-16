"use client"

import { motion } from "framer-motion";

export default function Experience({ onClose }: { onClose?: () => void }) {
    return (
        <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 100 }}
            initial={{ zIndex: 10 }}
            className="aspect-square w-[400px] glass rounded-2xl flex flex-col relative overflow-hidden cursor-grab active:cursor-grabbing bg-background/50 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
            {/* Top Window Bar (The Shell Header) */}
            <div className="flex-none flex items-center h-9 px-4 border-b border-white/5 bg-white/5 relative select-none">
                <div className="flex items-center gap-1.5 z-10">
                    <button onClick={onClose} className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors cursor-pointer" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <p className="text-[10px] font-mono text-white/40 tracking-widest absolute left-1/2 -translate-x-1/2 uppercase">
                    experience
                </p>
            </div>

            {/* Scrollable Content (The View) */}
            <div className="flex-1 overflow-y-auto p-6 font-sans scrollbar-hide">
                <div className="space-y-6">
                    {/* Job Entry Example */}
                    <div className="group cursor-pointer border-b border-white/5 pb-4">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Exo Technologies</span>
                                <span className="font-mono text-[10px] text-white/50">Software Engineer</span>
                            </div>
                            <span className="font-mono text-[10px] text-white/30 whitespace-nowrap">2025 – Pres.</span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed">Building Solana-based protocols and infrastructure.</p>
                    </div>

                    {/* Add more job entries here following the same pattern */}
                </div>
            </div>
        </motion.div>
    );
}