"use client"

import { motion } from "framer-motion";

export default function Experience({ onClose }: { onClose?: () => void }) {
    const experiences = [
        {
            company: "Education",
            role: "CS Student @ JSS Academy",
            period: "2023 – 2027",
            description: "Focusing on Backend Development, Distributed Systems, and High-Performance Computing using Go, Java, and PostgreSQL.",
            stack: "Go · Java · PostgreSQL · Kubernetes"
        },
    ];

    return (
        <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 100 }}
            initial={{ zIndex: 10 }}
            className="w-[610px] h-[515px] flex flex-col relative overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-3xl"
            style={{
                backgroundColor: "#111111",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "rgba(0, 0, 0, 0.9) 0px 40px 80px, rgb(0, 0, 0) 0px 0px 0px 0.5px",
            }}
        >
            {/* Top Windows/Mac OS Bar */}
            <div className="flex-none flex items-center h-8 px-4 border-b border-white/[0.05]  relative select-none">
                <div className="flex items-center gap-1.5 z-10">
                    <button onClick={onClose} className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors cursor-pointer outline-none" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <p className="text-[10px] font-mono text-white/40 tracking-[0.2em] absolute left-1/2 -translate-x-1/2 uppercase pointer-events-none">
                    EXPERIENCE
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 bg-[#1a1a1a]/40 overflow-y-auto p-8 pt-6 font-sans scrollbar-hide">
                <section className="opacity-100">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-6 text-white/20">
                        EXPERIENCE
                    </p>

                    <div className="w-full h-[1px] bg-white/[0.06] my-8" />
                    <div className="space-y-0">
                        {experiences.map((exp, index) => (
                            <div key={index} className="group py-6 border-b border-white/[0.04] last:border-0">
                                <div className="flex items-baseline justify-between gap-4 mb-2">
                                    <div className="flex items-baseline gap-2 min-w-0">
                                        <span className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                            {exp.company}
                                        </span>
                                        <span className="font-mono text-[10px] text-white/40 truncate">
                                            {exp.role}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] text-white/20 flex-none uppercase tracking-widest">
                                        {exp.period}
                                    </span>
                                </div>
                                <p className="text-[12px] text-white/60 mb-2 leading-relaxed">
                                    {exp.description}
                                </p>
                                <p className="font-mono text-[10px] text-white/[0.15] tracking-wide">
                                    {exp.stack}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}