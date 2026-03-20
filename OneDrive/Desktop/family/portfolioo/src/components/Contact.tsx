"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, Twitter } from "lucide-react";

export default function Contact({ onClose }: { onClose?: () => void }) {
    const contactMethods = [
        {
            icon: <Mail size={16} />,
            label: "Email",
            value: "samarthsrao@gmail.com",
            href: "mailto:samarthsrao@gmail.com"
        },
        {
            icon: <Calendar size={16} />,
            label: "Schedule a call",
            value: "cal.com/samarth-s",
            href: "https://cal.com/samarth-s"
        },
        {
            icon: <Twitter size={16} />,
            label: "X / Twitter",
            value: "@samarthsrao",
            href: "https://x.com/samarthsrao"
        }
    ];

    return (
        <motion.div
            drag={typeof window !== 'undefined' && window.innerWidth > 768}
            dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 100 }}
            initial={{ zIndex: 10 }}
            className="w-full md:w-[500px] md:h-[440px] flex flex-col relative overflow-hidden md:cursor-grab active:cursor-grabbing bg-transparent md:backdrop-blur-3xl md:bg-[#111111] md:rounded-[10px] md:border md:border-white/[0.08] md:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_0_0.5px_rgb(0,0,0)]"
        >
            {/* Top Windows/Mac OS Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-none items-center h-8 px-4 border-b border-white/[0.05] relative select-none">
                <div className="flex items-center gap-1.5 z-10">
                    <button
                        onClick={onClose}
                        className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors duration-150 cursor-pointer outline-none"
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <p className=" text-[10px] font-mono text-white/40 tracking-[0.2em] absolute left-1/2 -translate-x-1/2 uppercase pointer-events-none">
                    CONTACT
                </p>
            </div>

            <div className=" bg-transparent md:bg-[#1a1a1a]/40 flex-1 overflow-y-auto p-8 font-sans scrollbar-hide">
                <section className="opacity-100 h-full flex flex-col">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-6 text-white/20">
                        CONTACT
                    </p>

                    <h1 className="text-[32px] font-bold text-white mb-3 tracking-tight">
                        Let's Connect
                    </h1>
                    <p className="text-[14px] text-white/50 mb-10 leading-relaxed">
                        Open to collaborations, freelance work, or just a conversation.
                    </p>

                    <div className="space-y-0 mt-auto">
                        <div className="w-full h-[1px] bg-white/[0.04]" />
                        {contactMethods.map((method, index) => (
                            <a
                                key={index}
                                href={method.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between py-6 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-all px-2 -mx-2 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-white/30 group-hover:text-white/60 transition-colors">
                                        {method.icon}
                                    </div>
                                    <span className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors">
                                        {method.label}
                                    </span>
                                </div>
                                <span className="font-mono text-[12px] text-white/20 group-hover:text-white/40 transition-colors">
                                    {method.value}
                                </span>
                            </a>
                        ))}
                    </div>
                </section>
            </div>
        </motion.div>
    );
}