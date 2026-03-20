"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Project({ onClose }: { onClose?: () => void }) {
    const [activeTab, setActiveTab] = useState<"personal" | "client">("personal");

    const personalProjects = [
        {
            title: "Jss Rooms",
            description: "Campus Connectivity and Event Management Website with real-time chat and digital ticketing for college festivals.",
            stack: "Go · WebSockets · PostgreSQL · React 19"
        },
        {
            title: "Eco-Quest",
            description: "Sustainable Activity Tracker & Rewards Platform to incentivize eco-friendly living using activity milestones.",
            stack: "Node.js · MongoDB · Express · React 18"
        },
        {
            title: "Inter Prep",
            description: "Collaborative Interview Preparation & Knowledge Sharing Platform to master technical interview questions.",
            stack: "Golang · Gin · PostgreSQL · JWT"
        }
    ];

    const clientProjects = [
        {
            title: "Smart Wallet SDK",
            description: "Non-custodial wallet infrastructure with social recovery and gasless transactions for seamless user onboarding.",
            stack: "TypeScript · Ethers · web3.js"
        },
        {
            title: "Cross-chain Vaults",
            description: "Yield-optimizing vaults that automatically Rebalance assets across multiple chains using interoperability protocols.",
            stack: "Solidity · Anchor · Wormhole · React"
        }
    ];

    const currentProjects = activeTab === "personal" ? personalProjects : clientProjects;

    return (
        <motion.div
            drag={typeof window !== 'undefined' && window.innerWidth > 768}
            dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 100 }}
            initial={{ zIndex: 10 }}
            className="w-full md:w-[690px] md:h-[515px] flex flex-col relative overflow-hidden md:cursor-grab active:cursor-grabbing bg-transparent md:backdrop-blur-3xl md:bg-[#111111] md:rounded-[10px] md:border md:border-white/[0.08] md:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_0_0.5px_rgb(0,0,0)]"
        >
            {/* Top Windows/Mac OS Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-none items-center h-8 px-2 border-b border-white/[0.05] relative select-none">
                <div className="flex items-center gap-1.5 z-10">
                    <button
                        onClick={onClose}
                        className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors duration-150 cursor-pointer outline-none"
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                </div>
                <p className="text-[9px] font-mono text-white/40 tracking-[0.2em] absolute left-1/2 -translate-x-1/2 uppercase pointer-events-none">
                    PROJECTS
                </p>
            </div>

            {/* Tabs Header */}
            <div className="flex px-4 pt-6 gap-6 z-10">
                <button
                    onClick={() => setActiveTab("personal")}
                    className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-colors pb-1 border-b ${activeTab === "personal" ? "text-white border-white" : "text-white/20 border-transparent hover:text-white/40"}`}
                >
                    Personal
                </button>
                <button
                    onClick={() => setActiveTab("client")}
                    className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-colors pb-1 border-b ${activeTab === "client" ? "text-white border-white" : "text-white/20 border-transparent hover:text-white/40"}`}
                >
                    Client Work
                </button>
            </div>

            {/* Content section */}
            <div className="flex-1 overflow-y-auto p-4 pt-4 font-sans scrollbar-hide bg-transparent md:bg-[#1a1a1a]/40">
                <div className="space-y-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-0"
                        >
                            {currentProjects.map((project, index) => (
                                <div key={index} className="group py-2 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg">
                                    <div className="flex items-baseline justify-between gap-3 mb-2">
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[12px] font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                                                {project.title}
                                            </span>
                                            <p className="text-[10px] text-white/60 mt-2 leading-relaxed">
                                                {project.description}
                                            </p>
                                            <p className="font-mono text-[8px] mt-4 text-white/[0.15] tracking-widest uppercase">
                                                {project.stack}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}